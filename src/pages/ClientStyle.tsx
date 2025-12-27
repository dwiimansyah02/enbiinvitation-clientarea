import {
  IonContent,
  IonHeader,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import '../DefaultViewport.css'
import { useEffect, useState } from 'react';
import { UserData, fetchUserById } from '../utils/fetchUser';
import { StyleData, fetchClientStyleByUserId } from '../utils/fetchClientAdditional';

interface InfoItemProps {
  title: string;
  subtitle: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ title, subtitle }) => (
  <IonItem>
    <IonLabel>
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </IonLabel>
  </IonItem>
);

const ClientStyle: React.FC = () => {

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);
  const [styleData, setStyleData] = useState<StyleData | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const storedUserId = localStorage.getItem('user_id');
        if (!storedUserId) return;

        const userRes = await fetchUserById(Number(storedUserId));
        setUser(userRes);

        if (userRes.client_id) {
          const galleryRes = await fetchClientStyleByUserId(userRes.client_id);
          setStyleData(galleryRes);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  return (
    <IonPage id="style-page">
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>Gaya Undangan</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        {loading ? (
          <IonList>
            <IonItem>
              <IonLabel>
                <h2><IonSkeletonText animated={true} style={{ width: '50%' }}></IonSkeletonText></h2>
                <p><i><IonSkeletonText animated={true} style={{ width: '80%' }}></IonSkeletonText></i></p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <h2><IonSkeletonText animated={true} style={{ width: '50%' }}></IonSkeletonText></h2>
                <p><i><IonSkeletonText animated={true} style={{ width: '80%' }}></IonSkeletonText></i></p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <h2><IonSkeletonText animated={true} style={{ width: '50%' }}></IonSkeletonText></h2>
                <p><i><IonSkeletonText animated={true} style={{ width: '80%' }}></IonSkeletonText></i></p>
              </IonLabel>
            </IonItem>
          </IonList>
        ) : user && styleData ? (
          <>
            <IonHeader collapse="condense">
              <IonToolbar>
                <IonTitle size="large">Gaya Undangan</IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonList>
              <InfoItem title={styleData.name} subtitle="Tema Undangan" />
              <InfoItem title={styleData.color.accent} subtitle="Warna Aksen" />
              <InfoItem title={styleData.color.background} subtitle="Warna Latar Belakang" />
              <InfoItem title={styleData.color.base} subtitle="Warna Dasar" />
              <InfoItem title={styleData.color.accent} subtitle="Warna Aksen" />
              <InfoItem title={styleData.color.border} subtitle="Warna Border" />
              <InfoItem title={styleData.color.button} subtitle="Warna Tombol" />
              <InfoItem title={styleData.font.base} subtitle="Font Dasar" />
              <InfoItem title={styleData.font.accent} subtitle="Font Aksen" />
              <InfoItem title={styleData.font.latin} subtitle="Font Latin" />
              <InfoItem title={styleData.font.latin_url} subtitle="URL Font Latin" />
            </IonList>
          </>
        ) : (
          <IonItem>
            <IonLabel>Tidak ada data gaya undangan</IonLabel>
          </IonItem>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ClientStyle;