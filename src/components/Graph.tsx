import { IonFab, IonToggle } from '@ionic/react';
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import { useEffect, useState } from 'react';
import { Line } from "react-chartjs-2";
import { Climate } from '../model/Climate';
import './List.css';
import { webSocket$ } from '../websocket/Configuration';

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

  useEffect(() => {

    configData();

    webSocket$.subscribe((data) => {
      const d = JSON.parse(data);
      console.log(d);
      console.log(data);
      if (!stop) {
        setClimate([...climate, data]);
      }
    });

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