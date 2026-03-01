# 🌦️ Health & Weather AI ChatBot

An intelligent real-time chatbot that provides Weather updates, CDC
health information, and WHO health indicators using OpenAI-powered
intent detection and external APIs.

------------------------------------------------------------------------

## 👨‍💻 Owner

**Fajle Imam**

------------------------------------------------------------------------

## 🚀 Project Overview

This project is a real-time AI chatbot that:

-   Detects user intent using OpenAI
-   Fetches live weather data from OpenWeather API
-   Retrieves health information from CDC API
-   Retrieves WHO indicators using WHO GHO API
-   Provides intelligent AI-formatted responses
-   Supports real-time chat using Socket.IO

------------------------------------------------------------------------

## 🧠 How It Works

### 1️⃣ Intent Detection (AI Powered)

User messages are analyzed using OpenAI to detect intent in JSON format:

{ "intent": "weather \| cdc \| who \| other", "parameter": "city or
topic" }

### 2️⃣ API Integration

-   Weather → OpenWeatherMap API\
-   CDC Info → CDC Public API\
-   WHO Indicators → WHO GHO API

### 3️⃣ AI Response Formatting

API results are sent back to OpenAI to: - Convert raw data into a
human-friendly response - Keep answers short and clear - Maintain a
friendly tone

### 4️⃣ Real-Time Communication

Uses Socket.IO for: - Live chat updates - Instant responses -
Voice-ready output events

------------------------------------------------------------------------

## 🛠️ Technologies Used

-   Node.js\
-   Express.js\
-   Socket.IO\
-   MongoDB (Mongoose)\
-   OpenAI API\
-   Axios\
-   HTML / JavaScript

------------------------------------------------------------------------

## 📂 Project Structure

health-and-weather-Ai-ChatBot/ │ ├── index.js \# Main server file\
├── client.js \# Frontend socket logic\
├── index.html \# Chat UI\
├── .env \# API keys (not uploaded to GitHub)\
└── package.json

------------------------------------------------------------------------

## ⚙️ Installation & Setup

1.  Clone the repository: git clone
    https://github.com/your-username/health-and-weather-Ai-ChatBot.git

2.  Install dependencies: npm install

3.  Create .env file:

OPENAI_API_KEY=your_openai_key\
OPENWEATHER_API_KEY=your_openweather_key\
MONGODB_URI=your_mongodb_connection_string\
PORT=3000

4.  Run the server: node index.js

Open browser: http://localhost:3000

------------------------------------------------------------------------

## 💬 Example Queries

-   What is the weather in Chennai?
-   Tell me about COVID from CDC
-   Show WHO indicators for malaria
-   What is Artificial Intelligence?

------------------------------------------------------------------------

## 📚 Learning Outcomes

-   AI-based Intent Detection\
-   REST API Integration\
-   Real-time Communication\
-   Backend Architecture\
-   Environment Variable Security

------------------------------------------------------------------------

## 🔐 Security

All API keys are stored securely using .env and are not uploaded to
GitHub.

------------------------------------------------------------------------

## 🤝 Future Improvements

-   Add chat history storage\
-   Add authentication system\
-   Improve UI design\
-   Add multi-language support\
-   Deploy online

------------------------------------------------------------------------

## 📜 License

This project is open-source under the MIT License.

------------------------------------------------------------------------

## ⭐ Support

If you like this project, please give it a star on GitHub!
