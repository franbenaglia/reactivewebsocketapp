const VITE_URL_WS_SERVER = import.meta.env.VITE_URL_WS_SERVER;

const clientWebSocket = new WebSocket(VITE_URL_WS_SERVER);

clientWebSocket.onopen = function () {
    console.log("clientWebSocket.onopen", clientWebSocket);
    console.log("clientWebSocket.readyState", "websocketstatus");
    //clientWebSocket.send("event-me-from-browser");
}
clientWebSocket.onclose = function (error) {
    console.log("clientWebSocket.onclose", clientWebSocket, error);

}
clientWebSocket.onerror = function (error) {
    console.log("clientWebSocket.onerror", clientWebSocket, error);

}
clientWebSocket.onmessage = function (error) {
    //console.log("clientWebSocket.onmessage", clientWebSocket, error);

}
