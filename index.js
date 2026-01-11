const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

// ------ OPENAI CODE ------
const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function askOpenAI(messages, model = "gpt-3.5-turbo") {
  const res = await openai.chat.completions.create({
    model,
    messages,
  });
  return res.choices[0].message.content.trim();
}
// -------------------------

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

const uri = process.env.MONGODB_URI || "your_mongodb_uri_here";
async function connectDB() {
  try {
    await mongoose.connect(uri);
    console.log('✅ Mongoose Connected Successfully');
  } catch (error) {
    console.error('❌ Mongoose connection error:', error.message);
  }
}
connectDB();

app.use(express.static(__dirname));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const CDC_API = "https://tools.cdc.gov/api/v2/resources/media";

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("chat message", async (msg) => {
    console.log("User asked:", msg);
    let reply = "";
    let apiResult = "";

    // --- 1. Intent detection with OpenAI ---
    const intentPrompt = [
      { role: "system", content: "You are an assistant for a chatbot. Given a user question about weather, health, or any topic, reply ONLY in this JSON format: {\"intent\":\"weather|cdc|who|other\",\"parameter\":\"city/topic/etc.\"}" },
      { role: "user", content: msg }
    ];
    let intent = "other", parameter = "";

    try {
      const intentResp = await askOpenAI(intentPrompt);
      const parsed = JSON.parse(intentResp);
      intent = parsed.intent || "other";
      parameter = parsed.parameter || "";
    } catch (e) {
      intent = "other";
    }

    // --- 2. API call phase ---
    if (intent === "weather") {
      let city = parameter || "Delhi";
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`
        );
        apiResult = {
          name: response.data.name,
          condition: response.data.weather[0].description,
          temp: response.data.main.temp,
          humidity: response.data.main.humidity
        };
      } catch (e) {
        reply = `⚠️ Sorry, couldn't get weather for "${city}".`;
      }
    } else if (intent === "cdc") {
      let topic = parameter || "covid";
      try {
        const result = await axios.get(
          `${CDC_API}?topic=${encodeURIComponent(topic)}`
        );
        if (result.data && result.data.results && result.data.results.length > 0) {
          apiResult = result.data.results.slice(0, 2).map(i => ({
            title: i.Title, url: i.Url
          }));
        } else {
          reply = `No CDC health info found for "${topic}".`;
        }
      } catch (e) {
        reply = "⚠️ Sorry, couldn't fetch CDC data.";
      }
    } else if (intent === "who") {
      let topic = parameter || "";
      try {
        const ghoApiUrl = 'https://ghoapi.azureedge.net/api/Indicator';
        const response = await axios.get(ghoApiUrl);
        const indicators = response.data.value;
        const filtered = indicators.filter(i =>
          (i.IndicatorName + i.IndicatorCode).toLowerCase().includes(topic.toLowerCase())
        );
        if (filtered.length > 0) {
          apiResult = filtered.slice(0, 2).map(i => ({
            name: i.IndicatorName,
            code: i.IndicatorCode
          }));
        } else {
          reply = `No WHO indicators found for "${topic}".`;
        }
      } catch (e) {
        reply = "⚠️ Sorry, WHO/GHO API issue.";
      }
    }

    // --- 3. Format final reply using OpenAI ---
    if (!reply && (apiResult !== "")) {
      const answerPrompt = [
        {
          role: "system",
          content: "You are a knowledgeable, friendly chatbot. Given the following user question and API info, return a helpful, accurate answer in under 3 sentences."
        },
        { role: "user", content: `User asked: "${msg}" and here is info: ${JSON.stringify(apiResult)}` }
      ];
      try {
        reply = await askOpenAI(answerPrompt);
      } catch (e) {
        console.error("OpenAI Error:", e);
        reply = "⚠️ AI error or quota reached.";
      }
    }

    // --- 4. Fallback to direct OpenAI answer ---
    if (!reply) {
      try {
        const fallbackPrompt = [
          { role: "system", content: "You are a knowledgeable, friendly chatbot." },
          { role: "user", content: msg }
        ];
        reply = await askOpenAI(fallbackPrompt);
      } catch (e) {
        reply = "⚠️ AI error or quota reached.";
      }
    }

    socket.emit("chat message", reply);
    socket.emit("chat voice", reply);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
