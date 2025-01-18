import { webSocket } from 'rxjs/webSocket';

const URL = 'ws://localhost:8080/climateData';  // URL of the WebSocket server HUB

const webSocketSubject = webSocket<any>(URL);

export const webSocket$ = webSocketSubject.asObservable();


