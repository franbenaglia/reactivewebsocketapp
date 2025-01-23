
import { Client } from '@stomp/stompjs';
import { WebSocket } from 'ws';

//Object.assign(global, { WebSocket });

export const client = new Client({
    brokerURL: 'ws://localhost:8080/climate-websocket',
    onConnect: () => {
        client.subscribe('/topic/climateData', message =>
            console.log(`Received: ${message.body}`)
        );
        //client.publish({ destination: '/app/climateData', body: 'First Message' });
    },
});

client.activate();