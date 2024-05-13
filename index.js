function displayStatus(websocket, statusDisplay) {
  websocket.addEventListener("open", () => {
    statusDisplay.innerHTML = "Caht connected";
  });

  websocket.addEventListener("close", () => {
    statusDisplay.innerHTML = "No connection";
  });
}

function recvMessage(websocket, messageDisplay) {
  websocket.addEventListener("message", (data) => {
    const newDiv = document.createElement("div");
    const newContent = document.createTextNode(data.data);
    newDiv.appendChild(newContent);
    messageDisplay.appendChild(newDiv);
  });
}

function sendMessage(websocket, messageForm, messageText) {
  messageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    message = messageText.value;
    websocket.send(message);
    messageText.value = "";
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const websocket = new WebSocket("ws://localhost:8001");
  const statusDisplay = document.getElementById("status");
  const messageDisplay = document.getElementById("message-container");
  const messageForm = document.getElementById("send-message-form");
  var messageText = document.getElementById("message-textbox");
  displayStatus(websocket, statusDisplay);
  recvMessage(websocket, messageDisplay);
  sendMessage(websocket, messageForm, messageText);
});
