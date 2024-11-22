# SpeechRacer Backend

## Setup
In the `/backend` folder, install the dependencies using `pip install -r requirements.txt`.
After that, create an `.env` file, putting in a `MONGO_PASSWORD`, where you'll have to ask us for the info.

## Running
After installation, run the backend code using `uvicorn main:app`, and install [uvicorn](https://www.uvicorn.org/) if you need to.

## File Structure
There are two files containing code, which are `speech_racer.py` and `main.py`. `speech_racer.py` handles the logic flow for each game, handling players, prompts, and scoring. On the other hand, `main.py` handles the routing and creation of game instances.

The `.pem` files are there to enable permissions when connecting with MongoDB.

## Explanation
The SpeechRacer backend runs on websockets, where messages are exchanged between the frontend and backend. The messages are JSON objects of the form `{ method: str }`, where the method details how the frontend or backend should behave. We have `progress` and `complete`, which are updates from the player. These updates are then propagated to the other players in the game.