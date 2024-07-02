function getWebSocketServer() {
  if (window.location.hostname === "adwaithkrishna.github.io") {
    return "wss://caht-se9v.onrender.com";
  } else if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === ""
  ) {
    return "ws://localhost:8001";
  } else {
    throw new Error(`Unsupported host: ${window.location.host}`);
  }
}

function init(websocket, statusDisplay) {
  websocket.addEventListener("open", () => {
    statusDisplay.innerHTML = "Caht connected";
    let event = { type: "init" };
    const params = new URLSearchParams(window.location.search);
    if (params.has("join")) {
      event.join = params.get("join");
    } else {
    }
    websocket.send(JSON.stringify(event));
  });

  websocket.addEventListener("close", () => {
    statusDisplay.innerHTML = "No connection";
  });
}

function recvMessage(websocket, messageDisplay, joinLink) {
  websocket.addEventListener("message", ({ data }) => {
    const event = JSON.parse(data);
    switch (event.type) {
      case "init":
        joinLink.innerHTML = `Copy link / Share: ${event.join}`;
        joinLink.href = "?join=" + event.join;
        break;
      case "message":
        const newDiv = document.createElement("div");
        const newContent = document.createTextNode(event.message);
        newDiv.appendChild(newContent);
        messageDisplay.appendChild(newDiv);
    }
  });
}

function sendMessage(websocket, messageForm, messageText) {
  messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    messageText.value = messageText.value.trim();
    if (messageText.value) {
      const event = { type: "message", message: messageText.value };
      websocket.send(JSON.stringify(event));
      messageText.value = "";
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const websocket = new WebSocket(getWebSocketServer());
  const statusDisplay = document.getElementById("status");
  const messageDisplay = document.getElementById("message-container");
  const messageForm = document.getElementById("send-message-form");
  const messageText = document.getElementById("message-textbox");
  const joinLink = document.getElementById("join");
  init(websocket, statusDisplay);
  recvMessage(websocket, messageDisplay, joinLink);
  sendMessage(websocket, messageForm, messageText);
});
