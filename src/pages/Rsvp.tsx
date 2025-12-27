import {
  IonBackButton,
  IonBadge,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonSearchbar,
  IonSkeletonText,
  IonText,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { fetchUserById, UserData } from '../utils/fetchUser';
import './DefaultViewport.css';
import { chevronForward } from 'ionicons/icons';

interface RsvpData {
  name: string;
  status: string;
  confirmation: string;
  messages: string;
  datetime: string;
}

const Rsvp: React.FC = () => {
  const [loading, setLoading] = useState(true);
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
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const formatTanggalID = (date: string) => {
    const target = new Date(date);
    const now = new Date();

    const diffMs = now.getTime() - target.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec >= 0) {
      if (diffDay >= 30) {
        return target.toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'short',
        });
      }

      if (diffDay > 0) return `${diffDay}h lalu`;
      if (diffHour > 0) return `${diffHour}j lalu`;
      if (diffMin > 0) return `${diffMin}m lalu`;
      return 'baru saja';
    }
    
    const futureMs = target.getTime() - now.getTime();
    const futureHour = Math.ceil(futureMs / (1000 * 60 * 60));
    const futureDay = Math.ceil(futureHour / 24);

    if (futureDay > 0) return `${futureDay} hari lagi`;
    return `${futureHour} jam lagi`;
  };

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

        {loading ? (
          <IonList>
            {Array.from({ length: 10 }).map((_, index) => (
              <IonItem key={index}>
                <div className="unread-indicator-wrapper" slot="start"></div>
                <IonLabel>
                  <IonSkeletonText
                    animated
                    style={{ width: '80%', height: '20px' }}
                  />
                  <IonSkeletonText
                    animated
                    style={{ width: '60%', height: '15px', marginTop: '8px' }}
                  />
                  <br />
                  <IonSkeletonText
                    animated
                    style={{ width: '30%', height: '15px', marginTop: '8px' }}
                  />
                </IonLabel>
                <div className="metadata-end-wrapper" slot="end">
                  <IonSkeletonText
                    animated
                    style={{ width: '40px', height: '20px' }}
                  />
                </div>
              </IonItem>
            ))}
          </IonList>
        ) : (
          <IonList inset={true}>
            {filteredRsvps.map((item, index) => (
              <IonItem button={true} detail={false} key={index}>
                <div className="unread-indicator-wrapper" slot="start"></div>
                <IonLabel>
                  <strong>{item.name}</strong>
                  <IonText>{item.messages}</IonText>
                  <br />
                  <IonNote color="medium" className="ion-text-wrap">
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
                  </IonNote>
                </IonLabel>
                <div className="metadata-end-wrapper" slot="end">
                  <IonNote color="medium">{formatTanggalID(item.datetime)}</IonNote>
                  <IonIcon color="medium" icon={chevronForward}></IonIcon>
                </div>
              </IonItem>
            ))}
          </IonList>
        )}

      </IonContent>
    </IonPage>
  );
};

export default Rsvp;