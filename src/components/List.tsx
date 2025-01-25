import { IonCol, IonGrid, IonRow } from '@ionic/react';
import { useEffect, useState } from 'react';
import { Climate } from '../model/Climate';
//import { clientWebSocket } from '../websocket/Configuration';
import './List.css';
import useWebSocket, { ReadyState } from 'react-use-websocket';
const URL_WS_SERVER = import.meta.env.VITE_URL_WS_SERVER;

const List: React.FC = () => {

  const [climate, setClimate] = useState<Climate[]>([]);
  const [channelColor, setChannelColor] = useState<Map<number, string>>(new Map<number, string>());
  const [colorCount, setColorCount] = useState<Map<string, number>>(new Map<string, number>());

  const [socketUrl, setSocketUrl] = useState(URL_WS_SERVER);
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
  const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  const [index, setIndex] = useState<number>(0);

  const availableColors: string[] = ['red', 'white', 'blue', 'green', 'yellow', 'purple', 'cyan', 'magenta', 'pink'];


  useEffect(() => {

    initializeColor();

    if (lastMessage !== null) {
      const d: Climate = JSON.parse(lastMessage.data);
      console.log(d);
      cssForChannel(d.channel);
      setClimate([...climate, d]);
    }




    //data.color = availableColors[index];
    //setIndex(index => {
    //  if (!channelColor.has(data.channel)) {
    //    setChannelColor(previous => previous.set(data.channel, data.color));
    //  }
    //  return index < availableColors.length ? index + 1 : 0;
    //});

  }, [lastMessage]);


  const cssForChannel = (c: number): void => {
    assignColorToChannel(c);
  }

  const initializeColor = () => {
    for (let c of availableColors) {
      colorCount.set(c, 0)
    }
    setColorCount(colorCount);
  }

  const assignColorToChannel = (channel: number): void => {

    if (!channelColor.has(channel)) {
      let luc = lessUsedColor();
      channelColor.set(channel, luc);
      setChannelColor(channelColor);
      colorCount.set(luc, colorCount.get(luc) + 1);
      setColorCount(colorCount)
    }

  }

  const lessUsedColor = (): string => {

    let color: string;
    let arrayVal: number[] = Array.from(colorCount.values());
    let minor: number = Math.min(...arrayVal);

    colorCount.forEach((value, key, map) => {
      if (value === minor) {
        color = key;
      }
    })
    return color;
  }


  const getCssChannel = (channel: number): string => {
    let color = 'red';
    if (channelColor.has(channel)) {
      color = channelColor.get(channel);
    }
    return color;

  }

  return (
    <div>

      <IonGrid>
        <IonRow>
          <IonCol>Channel</IonCol>
          <IonCol>Temperature</IonCol>
          <IonCol>Humidity</IonCol>

        </IonRow>

        {climate && climate.map((c, i) => {
          let z = getCssChannel(c.channel);
          if (getCssChannel(c.channel)) {
            return (
              <IonRow key={i}>
                <IonCol style={{ color: z }}>{c.channel}</IonCol>
                <IonCol style={{ color: 'red' }}>{c.temperature}</IonCol>
                <IonCol style={{ color: 'green' }}>{c.humidity}</IonCol>
              </IonRow >
            )
          } else ''
        }
        )
        }

      </IonGrid >

    </div>
  );
};

export default List;