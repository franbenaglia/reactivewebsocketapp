import { IonFab, IonToggle } from '@ionic/react';
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import { useEffect, useState } from 'react';
import { Line } from "react-chartjs-2";
import { Climate } from '../model/Climate';
import './List.css';
import { StompSessionProvider, useSubscription } from "react-stomp-hooks";

const URL_WS_SERVER = import.meta.env.VITE_URL_WS_SERVER;
const VITE_WS_TOPIC = import.meta.env.VITE_WS_TOPIC;


interface Data {
  labels: number[];
  datasets: any[];
}

Chart.register(CategoryScale);

const Graph: React.FC = () => {

  const [climate, setClimate] = useState<Climate[]>([]);
  const [chartData, setChartData] = useState<Data>({ labels: [], datasets: [] });
  const [stop, setStop] = useState(false);

  const availableColors: string[] = ['red', 'white', 'blue', 'green', 'yellow', 'purple', 'cyan', 'magenta', 'pink'];

  const clientWebSocket = new WebSocket('ws://localhost:8080/climateData');

  useEffect(() => {

    configData();

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

    clientWebSocket.onmessage = function (data) {
      console.log("clientWebSocket.onmessage.data", data.data);
      const d: Climate = JSON.parse(data.data);
      console.log(d);

      setClimate([...climate, d]);

    }

  }, [climate]);

  const configData = () => {

    const map = new Map<number, Climate[]>();
    const dss: any[] = [];
    const labels: any[] = [];

    for (let i = 0; i < 48; i++) {
      labels.push(i);
    }

    climate.map((data, idx) => {

      //labels.push(data.idx);

      if (data.idx == 0) {
        map.clear();
      }

      if (map.has(data.channel)) {
        map.set(data.channel, [...map.get(data.channel), data]);
      } else {
        map.set(data.channel, [data]);
      }
    });

    for (const c of map.values()) {

      dss.push(
        {
          label: "Temperature",
          data: c && c.length > 0 ? c.map((data) => data.temperature) : [],
          backgroundColor: availableColors,
          borderColor: "black",
          borderWidth: 2
        }
      );

    }
    const cd: Data = { labels: labels, datasets: dss };
    setChartData(cd);
  }


  const toggleStop = () => {
    const stopped = !stop;
    setStop(stopped);
  }

  const Subscribing = () => {
    useSubscription(VITE_WS_TOPIC, (message) => {
      const d = JSON.parse(message.body);
      if (!stop) {
        setClimate([...climate, d]);
      }
    }
    );
    return <></>;
  }


  //stomp version inside template
  const stomp = () => {
    <StompSessionProvider
      url={URL_WS_SERVER} >
      <Subscribing />
    </StompSessionProvider>
  }

  return (
    <>
      <Line
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Temperature"
            },
            legend: {
              display: false
            }
          }
        }}
      />

      <IonFab slot="fixed" vertical="top" horizontal="start">
        <IonToggle checked={stop} onClick={() => toggleStop()}>Stop data logger</IonToggle>
      </IonFab >

    </>
  );
};

export default Graph;