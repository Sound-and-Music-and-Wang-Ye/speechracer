from fastapi import FastAPI, WebSocket
from typing import Dict
from datetime import datetime
import asyncio
from speech_racer import SpeechRacer
from functools import lru_cache
from pydantic_settings import BaseSettings
from fastapi.middleware.cors import CORSMiddleware

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

game_instances: Dict[str, SpeechRacer] = {}

@app.websocket("/speechracer/ws/{name}")
async def websocket_endpoint(websocket: WebSocket, name: str):
    await websocket.accept()

    time_entered = datetime.now()
    time_entered_key = time_entered.strftime("%Y-%m-%d %H:%M")
    print(time_entered_key)
    is_new_game = time_entered_key not in game_instances

    if is_new_game:
        game_instances[time_entered_key] = SpeechRacer(time_entered, get_settings())
    
    game_instance = game_instances[time_entered_key]
    await game_instance.handle_connection(websocket, name)
    await game_instance.handle_client(websocket, name)

    if is_new_game:
      # delete game instance after 6 minutes
      await asyncio.sleep(360)
      del game_instances[time_entered_key]