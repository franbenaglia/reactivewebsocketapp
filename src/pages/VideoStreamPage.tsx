import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Page.css';
import VideoStream from '../components/VideoStream';

const VideoStreamPage: React.FC = () => {

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Video Stream</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Video Stream</IonTitle>
          </IonToolbar>
        </IonHeader>
        <VideoStream />
      </IonContent>
    </IonPage>
  );
};

export default VideoStreamPage;
