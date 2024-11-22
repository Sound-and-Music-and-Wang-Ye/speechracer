# SpeechRacer Backend

## Setup
In the `/backend` folder, install the dependencies using `pip install -r requirements.txt`.
After that, create an `.env` file, putting in a `MONGO_PASSWORD`, where you'll have to ask us for the info.

## Running
After installation, run the backend code using `uvicorn main:app`, and install [https://www.uvicorn.org/](uvicorn) if you need to.

## Explanation
The SpeechRacer backend runs on websockets, where messages are exchanged between the frontend and backend. The messages are JSON objects of the form `{ method: str }`, where the method details how the frontend or backend should behave. We have `progress` and `complete`, which are updates from the player. These updates are then propagated to the other players in the game.