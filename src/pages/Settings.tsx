import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './DefaultViewport.css';

const Settings: React.FC = () => {
  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home"></IonBackButton>
          </IonButtons>
          <IonTitle>Pengaturan</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <div id="container">
          <strong>Akses Ditolak</strong>
          <p>Mohon maaf, anda tidak diizinkan untuk mengakses halaman pengaturan.</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
