import {
  IonBadge,
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNavLink,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonActionSheet,
} from '@ionic/react';
import './DefaultViewport.css';
import { fetchUserById, UserData } from '../utils/fetchUser';
import { fetchStatisticsByUserId, StatisticsData } from '../utils/fetchStatistics';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import axios from 'axios';
import GuestBook from './GuestBook';
import Rsvp from './Rsvp';

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
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>Beranda</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        {!loading && user && stats && (
          <>
            <p>Selamat datang, {user.name}</p>

            <IonList>
              <IonItem>
                <IonBadge slot="end">{stats.guest}</IonBadge>
                <IonLabel>Jumlah tamu</IonLabel>
              </IonItem>
              <IonItem>
                <IonBadge slot="end">{stats.present}</IonBadge>
                <IonLabel>Akan Hadir / Hadir</IonLabel>
              </IonItem>
              <IonItem>
                <IonBadge slot="end">{stats.absent}</IonBadge>
                <IonLabel>Tidak Hadir</IonLabel>
              </IonItem>
              <IonItem>
                <IonBadge slot="end">{stats.messages}</IonBadge>
                <IonLabel>RSVP</IonLabel>
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