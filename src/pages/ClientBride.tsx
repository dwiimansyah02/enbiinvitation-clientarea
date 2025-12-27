import {
  IonAvatar,
  IonBackButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRow,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import './DefaultViewport.css'
import { useEffect, useState } from 'react';
import { UserData, fetchUserById } from '../utils/fetchUser';
import { ClientData, fetchClientByUserId } from '../utils/fetchClient';
import { GalleryData, GiftData, fetchClientGalleryByUserId, fetchClientGiftByUserId } from '../utils/fetchClientAdditional';

interface InfoItemProps {
  title: string;
  subtitle: string;
}

interface GalleryItemProps {
  alt: string;
  src: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ title, subtitle }) => (
  <IonItem>
    <IonLabel>
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </IonLabel>
  </IonItem>
);

const GalleryItem: React.FC<GalleryItemProps> = ({ alt, src }) => (
  <IonImg
    alt={alt}
    src={`https://enbiinvitation.com/storage/images/${src}`}
  >
  </IonImg>
);

const ClientBride: React.FC = () => {

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);
  const [client, setClient] = useState<ClientData | null>(null);
  const [galleries, setGalleries] = useState<GalleryData[]>([]);
  const [gifts, setGifts] = useState<GiftData[]>([]);

  useEffect(() => {
    const run = async () => {
      try {
        const storedUserId = localStorage.getItem('user_id');
        if (!storedUserId) return;

        const userRes = await fetchUserById(Number(storedUserId));
        setUser(userRes);

        if (userRes.client_id) {
          const clientRes = await fetchClientByUserId(userRes.client_id);
          const galleryRes = await fetchClientGalleryByUserId(userRes.client_id);
          const giftRes = await fetchClientGiftByUserId(userRes.client_id);
          setGifts(giftRes);
          setGalleries(galleryRes);
          setClient(clientRes);
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
    <IonPage id="bride-page">
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home"></IonBackButton>
          </IonButtons>
          <IonTitle>Data Mempelai</IonTitle>
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
        ) : user && client ? (
          <>
            <IonHeader collapse="condense">
              <IonToolbar>
                <IonTitle size="large">Data Mempelai</IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonList>
              
              {/* Bride */}
              <IonItem>
                <IonImg slot="start"
                  alt="Bride Avatar"
                  src={`https://enbiinvitation.com/storage/images/${client.bride.photo}`}
                >
                </IonImg>
              </IonItem>

              <InfoItem title={client.bride.name} subtitle="Nama Mempelai Wanita" />
              <InfoItem title={client.bride.alias} subtitle="Alias Mempelai Wanita" />
              <InfoItem title={client.bride.parent} subtitle="Orang Tua Mempelai Wanita" />

              {/* Groom */}
              <IonItem>
                <IonImg slot="start"
                  alt="Groom Avatar"
                  src={`https://enbiinvitation.com/storage/images/${client.groom.photo}`}
                >
                </IonImg>
              </IonItem>

              <InfoItem title={client.groom.name} subtitle="Nama Mempelai Pria" />
              <InfoItem title={client.groom.alias} subtitle="Alias Mempelai Pria" />
              <InfoItem title={client.groom.parent} subtitle="Orang Tua Mempelai Pria" />

              {/* Akad */}
              <InfoItem title={client.event.akad.date} subtitle="Tanggal Akad" />
              <InfoItem title={client.event.akad.time_start} subtitle="Waktu Mulai Akad" />
              <InfoItem title={client.event.akad.time_end} subtitle="Waktu Selesai Akad" />
              <InfoItem title={client.event.akad.place} subtitle="Tempat Akad" />
              <InfoItem title={client.event.akad.address} subtitle="Alamat Akad" />

              {/* Resepsi */}
              <InfoItem title={client.event.resepsi.date} subtitle="Tanggal Resepsi" />
              <InfoItem title={client.event.resepsi.time_start} subtitle="Waktu Mulai Resepsi" />
              <InfoItem title={client.event.resepsi.time_end} subtitle="Waktu Selesai Resepsi" />
              <InfoItem title={client.event.resepsi.place} subtitle="Tempat Resepsi" />
              <InfoItem title={client.event.resepsi.address} subtitle="Alamat Resepsi" />

              {/* Gallery */}
              <IonGrid>
                <IonRow>
                  {galleries.map((gallery, index) => (
                    <IonCol size="auto" key={index}>
                      <GalleryItem
                        alt={`Gallery Image ${gallery.thumbnail}`}
                        src={gallery.thumbnail}
                      />
                    </IonCol>
                  ))}
                </IonRow>
              </IonGrid>

              {/* Gift */}
              {gifts.map((gift, index) => (
                <IonItem key={index}>
                  {gift.category === 'bank' && (
                    <>
                      <IonAvatar slot="start">
                        <img alt={gift.name} src={`https://enbiinvitation.com/storage/images/bank/${gift.bank_name}`} />
                      </IonAvatar>
                      <IonLabel>{gift.name} - {gift.value}</IonLabel>
                    </>
                  )}
                  {gift.category === 'address' && (<IonLabel>Alamat: {gift.value}</IonLabel>)}
                  
                </IonItem>
              ))}

            </IonList>
          </>
        ) : (
          <IonItem>
            <IonLabel>Tidak ada data mempelai</IonLabel>
          </IonItem>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ClientBride;