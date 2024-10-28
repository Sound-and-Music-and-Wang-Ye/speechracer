import asyncio
import random
from pymongo import MongoClient
from datetime import datetime
from typing import List, Dict, Any
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.websockets import WebSocketDisconnect
from pydantic_settings import BaseSettings
from functools import lru_cache

PARA_COUNT = 6343

class Settings(BaseSettings):
    mongo_password: str

    class Config:
        env_file = ".env"

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
    def __init__(self, para_id: int, time_entered: datetime):
        self.players: Dict[str, WebSocket] = {}
        self.player_progresses: Dict[str, int] = {}
        self.para_id = para_id
        self.time_entered = time_entered
        asyncio.create_task(self.start_game())

        settings = get_settings()
        connection = f"mongodb+srv://admin:{settings.mongo_password}@cluster0.1jxisbd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&tlsCAFile=isrgrootx1.pem"
        client = MongoClient(connection)
        self.text = client.speechracer.texts.aggregate([{"$sample": {"size": 1}}]).next()

    async def handle_connection(self, websocket: WebSocket, name: str):
        self.players[name] = websocket
        self.player_progresses[name] = 0
        # time to next minute
        time_remaining = 60 - datetime.now().second
        await self.notify_all_players("connect", { "time_remaining": time_remaining })

    async def handle_client(self, websocket: WebSocket, name: str):
        data = {}
        try:
            while True:
                data = await websocket.receive_json()
                method = data.get("method")
                if method == "progress":
                    player_name = data.get("name")
                    self.player_progresses[player_name] = data.get("progress")
                    await self.notify_all_players("progress", {})
        except WebSocketDisconnect as e:
            print(f"Player disconnected")
            self.players.pop(name)
            self.player_progresses.pop(name)
            if name in self.players:
                await self.notify_all_players("disconnect", {
                  "name": e.detail
                })
        
    async def notify_all_players(self, method: str, data: Dict[str, Any]):
        print(f"Notifying all players with {method} and {data}")
        for player in self.players.values():
            await player.send_json({
                "method": method,
                "players": self.player_progresses,
                **data
            })
        
    async def start_game(self):
        time_remaining = 60 - datetime.now().second
        # await asyncio.sleep(4)
        await asyncio.sleep(time_remaining)
        await self.notify_all_players("start", {"text": self.text["text"], "source": self.text["source"]})
        await asyncio.sleep(3600)
        await self.notify_all_players("end", {})

game_instances: Dict[str, GameInstance] = {}

@app.websocket("/speechracer/ws/{name}")
async def websocket_endpoint(websocket: WebSocket, name: str):
    await websocket.accept()

    time_entered = datetime.now()
    time_entered_key = time_entered.strftime("%Y-%m-%d %H:%M")
    is_new_game = time_entered_key not in game_instances

    if is_new_game:
        para_id = random.randint(0, PARA_COUNT)
        game_instances[time_entered_key] = GameInstance(para_id, time_entered)
    
    game_instance = game_instances[time_entered_key]
    await game_instance.handle_connection(websocket, name)
    await game_instance.handle_client(websocket, name)

    if is_new_game:
      # delete game instance after 6 minutes
      await asyncio.sleep(360)
      del game_instances[time_entered_key]
