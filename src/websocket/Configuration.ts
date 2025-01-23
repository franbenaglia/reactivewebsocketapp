export const clientWebSocket = new WebSocket('ws://localhost:8080/climateData');

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
