# ⚙️ SpeechRacer Backend

Welcome to the **SpeechRacer Backend**! This repository contains the backend logic and routing for the SpeechRacer application, enabling real-time communication and gameplay.

---

## **Setup**

1. **🔨 Install Dependencies**  
   Navigate to the `/backend` folder and install the required dependencies by running:  
   ```bash
   pip install -r requirements.txt
   ```

2. **Environment Configuration**  
   Create a `.env` file in the `/backend` directory and add the following variable:
   ```bash
   MONGO_PASSWORD=<your_mongo_password>
   ```
   You will need your own MongoDB database set up.

## **🏃 Running**

1. **Start the Backend**  
   Run the backend code using:  
   ```bash
   uvicorn main:app
   ```

2. **Install Uvicorn**  
   If you don’t have Uvicorn installed, you can install it using:  
   ```bash
   pip install uvicorn
   ```

## **🗂️ File Structure**

- **`speech_racer.py`**  
  Handles the game logic, including managing players, prompts, and scoring.

- **`main.py`**  
  Manages API routing and the creation of game instances.

- **`.pem` Files**  
  Used to enable secure permissions when connecting to MongoDB.

---

## **🔌Explanation**

The SpeechRacer backend uses **WebSockets** for real-time communication between the frontend and backend. Messages are exchanged in the form of JSON objects with the following structure:  
```json
{
  "method": "str"
}
```

``` **Message Types**
- **`progress`**: Updates sent by players to report their progress.
- **`complete`**: Signals the completion of a task by a player.

These updates are propagated to other players in the same game, ensuring a synchronized experience.
```
