import {
  IonBackButton,
  IonBadge,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonSearchbar,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { fetchUserById, UserData } from '../utils/fetchUser';
import './DefaultViewport.css';

interface RsvpData {
  name: string;
  status: string;
  confirmation: string;
  messages: string;
  datetime: string;
}

const Rsvp: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [rsvps, setRsvps] = useState<RsvpData[]>([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        const storedUserId = localStorage.getItem('user_id');
        if (!storedUserId) return;

        const userRes = await fetchUserById(Number(storedUserId));
        setUser(userRes);

        const clientId = userRes.client_id;
        const response = await axios.get(
          `https://enbiinvitation.com/api/messages/client/${clientId}`
        );

        const sortedData = response.data.data.sort(
          (a: RsvpData, b: RsvpData) =>
            new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
        );
        
        setRsvps(sortedData);

      } catch (error) {
        console.error('Failed to load RSVP:', error);
      }
    };

    init();
  }, []);

  const formatTanggalID = (date: string) =>
  new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const filteredRsvps = rsvps.filter(item => {
    const keyword = searchText.toLowerCase();
    return (
      item.name?.toLowerCase().includes(keyword) ||
      item.messages?.toLowerCase().includes(keyword) ||
      item.status?.toLowerCase().includes(keyword)
    );
  });

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home"></IonBackButton>
          </IonButtons>
          <IonTitle>RSVP</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar value={searchText} debounce={300} placeholder="Cari pesan..." onIonInput={(e) => setSearchText(e.detail.value!)}></IonSearchbar>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">RSVP</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonList>
          {filteredRsvps.map((item, index) => (
            <IonCard key={index}>
              <IonCardHeader>
                <IonCardTitle>
                  {item.name}
                  <IonBadge
                    style={{ marginLeft: 8 }}
                    color={
                      item.confirmation === '2'
                        ? 'success'
                        : item.confirmation === '1'
                        ? 'primary'
                        : 'danger'
                    }
                  >
                    {item.status}
                  </IonBadge>
                </IonCardTitle>

                <IonCardSubtitle>
                  Dipost tanggal: {formatTanggalID(item.datetime)}
                </IonCardSubtitle>
              </IonCardHeader>

              <IonCardContent>
                {item.messages}
              </IonCardContent>
            </IonCard>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Rsvp;