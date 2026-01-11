const socket = io('http://192.168.120.1:3000'); // connect to backend
const chatbox = document.getElementById("chatbox");

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.classList.add("msg", sender);
  div.innerText = text;
  chatbox.appendChild(div);
  chatbox.scrollTop = chatbox.scrollHeight;
  if (sender === "bot") speak(text); // bot speaks
}

// Send message to backend
function sendMessage() {
  const msg = document.getElementById("msgInput").value;
  if (!msg) return;
  addMessage(msg, "user");
  socket.emit("chat message", msg);
  document.getElementById("msgInput").value = "";
}

// Receive message from backend
socket.on("chat message", (msg) => {
  addMessage(msg, "bot");
});

// 🔊 Text-to-Speech
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}

// 🎤 Speech-to-Text
function startVoice() {
  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.onresult = function(event) {
    const msg = event.results[0][0].transcript;
    document.getElementById("msgInput").value = msg;
    sendMessage();
  };
  recognition.start();
}
