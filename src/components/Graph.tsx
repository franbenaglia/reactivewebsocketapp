import { IonButton, IonFab, IonToggle } from '@ionic/react';
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import { useEffect, useState } from 'react';
import { Line } from "react-chartjs-2";
import { Climate } from '../model/Climate';
import './List.css';
import { StompSessionProvider, useSubscription } from "react-stomp-hooks";
import useWebSocket, { ReadyState } from 'react-use-websocket';

const URL_WS_SERVER = import.meta.env.VITE_URL_WS_SERVER;
const URL_WS_STOMP_SERVER = import.meta.env.VITE_URL_WS_STOMP_SERVER;
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
  const [socketUrl, setSocketUrl] = useState(URL_WS_SERVER);
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
  const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([]);
  const [chartDataMulti, setChartDataMulti] = useState<Map<number, Climate[]>>(new Map<number, Climate[]>());
  const [multi, setMulti] = useState(true);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  const availableColors: string[] = ['red', 'white', 'blue', 'green', 'yellow', 'purple', 'cyan', 'magenta', 'pink'];

  useEffect(() => {

    configData();

    if (lastMessage !== null) {
      const d: Climate = JSON.parse(lastMessage.data);
      console.log(d);
      setClimate([...climate, d]);
    }
  }, [lastMessage]);


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
        //map.clear();
      }

      if (map.has(data.channel)) {
        map.set(data.channel, [...map.get(data.channel), data]);
      } else {
        map.set(data.channel, [data]);
      }
    });

    setChartDataMulti(map);

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

  const reset = () => {
    setClimate([]);
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

  const toggleView = () => {
    setMulti(!multi);
  }


  //stomp version inside template
  const stomp = () => {
    <StompSessionProvider
      url={URL_WS_STOMP_SERVER} >
      <Subscribing />
    </StompSessionProvider>
  }

  return (
    <>
      {!multi ? (<Line
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
      />)
        :
        (

          Array.from(chartDataMulti.entries()).map((key, value) =>
            <Line
              data={
                {
                  labels: key[1] && key[1].length > 0 ? key[1].map((data, idx) => new Date(data.date).getTime()) : [],
                  datasets: [{
                    label: "Temperature channel: " + key[0],
                    data: key[1] && key[1].length > 0 ? key[1].map((data, idx) => data.temperature) : [],
                    backgroundColor: availableColors,
                    borderColor: "black",
                    borderWidth: 2
                  }]
                }
              }
              options={{
                plugins: {
                  title: {
                    display: true,
                    text: "Temperature channel: " + key[0],
                  },
                  legend: {
                    display: false
                  }
                }
              }}
            />
          )

        )
      }

      <IonFab slot="fixed" vertical="top" horizontal="start">
        <IonToggle checked={stop} onClick={() => toggleStop()}>Stop data logger</IonToggle>
      </IonFab >
      <IonFab slot="fixed" vertical="top" horizontal="end">
        <IonButton size="small" onClick={() => reset()}>Reset data logger</IonButton>
      </IonFab >
      <IonFab slot="fixed" vertical="center" horizontal="end">
        <IonToggle checked={multi} onClick={() => toggleView()}>Switch view</IonToggle>
      </IonFab >

    </>
  );
};

export default Graph;