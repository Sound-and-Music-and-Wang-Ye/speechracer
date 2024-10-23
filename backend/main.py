import asyncio
from datetime import datetime
from typing import List, Dict, Any
from pymongo import MongoClient
from fastapi import FastAPI, Depends, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.websockets import WebSocketDisconnect
from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing_extensions import Annotated
from functools import lru_cache

class Settings(BaseSettings):
    mongo_password: str

@lru_cache
def get_settings():
    return Settings()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1 minute lobby, 4 minutes game time
class GameInstance:
    def __init__(self, text: str, time_entered: datetime):
        self.players: Dict[str, WebSocket] = {}
        self.text = text
        self.text_length = len(text)
        self.time_entered = time_entered
        asyncio.create_task(self.start_game())

    def get_player_data(self):
        return {name: {"x": 0, "y": 0} for name in self.players.keys()}

    async def handle_connection(self, websocket: WebSocket, name: str):
        self.players[name] = websocket

        await websocket.send_json({
            "method": "connect",
            "players": self.get_player_data()
        })

    async def handle_client(self, websocket: WebSocket):
        data = {}
        try:
            while True:
                data = await websocket.receive_json()
                method = data.get("method")
                if method == "progress":
                    player_name = data.get("name")
                    await self.notify_all_players("progress", {
                        "name": player_name,
                        "progress": data.get("progress")
                    })
        except WebSocketDisconnect as e:
            player_name = data.get("name", "")
            if player_name in self.players:
                await self.notify_all_players("disconnect", {
                  "name": e.detail
                })
        
    async def notify_all_players(self, method: str, data: Dict[str, Any]):
        print(f"Notifying all players with {method} and {data}")
        for player in self.players.values():
            await player.send_json({
                "method": method,
                "get_player_data": self.get_player_data(),
                **data
            })
        
    async def start_game(self):
        await asyncio.sleep(60)
        await self.notify_all_players("start", {"text": self.text})
        await asyncio.sleep(240)
        await self.notify_all_players("end", {})

game_instances: Dict[str, GameInstance] = {}

@app.websocket("/ws/lobby/{name}")
async def websocket_endpoint(websocket: WebSocket, name: str, settings: Annotated[Settings, Depends(get_settings)]):
    await websocket.accept()

    time_entered = datetime.now()
    time_entered_key = time_entered.strftime("%Y-%m-%d %H:%M")
    is_new_game = time_entered_key not in game_instances

    if is_new_game:
        connection = f"mongodb+srv://admin:{settings.mongo_password}@cluster0.1jxisbd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&tlsCAFile=isrgrootx1.pem"
        client = MongoClient(connection)
        random_text = await client.speechracer.texts.find_one()
        game_instances[time_entered_key] = GameInstance(random_text, time_entered)
    
    game_instance = game_instances[time_entered_key]
    await game_instance.handle_connection(websocket, name)
    await game_instance.handle_client(websocket)

    if is_new_game:
      # delete game instance after 6 minutes
      await asyncio.sleep(360)
      del game_instances[time_entered_key]
