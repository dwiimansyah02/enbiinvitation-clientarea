import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonActionSheet,
} from '@ionic/react';
import './DefaultViewport.css'
import axios from 'axios';
import { peopleOutline, bookmarkOutline, happyOutline, sadOutline } from 'ionicons/icons';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { StatisticsData, fetchStatisticsByUserId } from '../utils/fetchStatistics';
import { UserData, fetchUserById } from '../utils/fetchUser';

const Home: React.FC = () => {

  const [user, setUser] = useState<UserData | null>(null);
  const [stats, setStats] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const [present] = useIonActionSheet();
  const history = useHistory();

  useEffect(() => {
    const run = async () => {
      try {
        const storedUserId = localStorage.getItem('user_id');
        if (!storedUserId) return;

        const userRes = await fetchUserById(Number(storedUserId));
        setUser(userRes);

        if (userRes.client_id) {
          const statsRes = await fetchStatisticsByUserId(userRes.client_id);
          setStats(statsRes);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const handleLogout = () => {
    present({
      header: 'Anda yakin ingin log out dari sistem?',
      buttons: [
        {
          text: 'Ya',
          role: 'destructive',
        },
        {
          text: 'Tidak',
          role: 'cancel',
        },
      ],
      onDidDismiss: async (ev) => {
        if (ev.detail.role === 'destructive') {
          try {
            const token = localStorage.getItem('auth_token');

            if (token) {
              await axios.post(
                'https://enbiinvitation.com/api/auth/logout',
                {},
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                  },
                }
              );
            }
          } catch (error) {
            console.error('Logout API failed:', error);
          } finally {
            localStorage.removeItem('is_logged_in');
            localStorage.removeItem('user_id');
            localStorage.removeItem('auth_token');
  
            history.replace('/auth/login');
          }
        }
      },
    });
  };

  return (
    <IonPage id="home-page">
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>Beranda</IonTitle>
        </IonToolbar>
      </IonHeader>
    
      <IonContent fullscreen className="ion-padding">
        {!loading && user && stats && (
          <>
            <p>Selamat datang, {user.name}</p>
        
             <IonList inset={true}>
              <IonItem button={true}>
                <IonIcon color="primary" slot="start" icon={peopleOutline} size="large"></IonIcon>
                <IonLabel>Daftar Tamu</IonLabel>
                <IonNote slot="end">{stats.guest}</IonNote>
              </IonItem>
              <IonItem button={true}>
                <IonIcon color="primary" slot="start" icon={bookmarkOutline} size="large"></IonIcon>
                <IonLabel>Jumlah RSVP</IonLabel>
                <IonNote slot="end">{stats.messages}</IonNote>
              </IonItem>
              <IonItem button={true}>
                <IonIcon color="success" slot="start" icon={happyOutline} size="large"></IonIcon>
                <IonLabel>Akan Hadir / Hadir</IonLabel>
                <IonNote slot="end">{stats.present}</IonNote>
              </IonItem>
              <IonItem button={true}>
                <IonIcon color="danger" slot="start" icon={sadOutline} size="large"></IonIcon>
                <IonLabel>Tidak Hadir</IonLabel>
                <IonNote slot="end">{stats.absent}</IonNote>
              </IonItem>
            </IonList>
        
            <div className="space-y-2">
              <IonButton expand="block" onClick={() => history.push('/guestbook')}>Buku tamu</IonButton>
              <IonButton expand="block" onClick={() => history.push('/rsvp')}>RSVP</IonButton>
              <IonButton expand="block" onClick={() => history.push('/settings')}>Pengaturan</IonButton>
            </div>
            <hr className="mb-10" />
            <IonButton expand="block" color="danger" onClick={handleLogout}>Log out</IonButton>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Home;