import { IonContent, IonHeader, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonPage, IonTitle, IonToolbar, useIonToast, IonSearchbar, IonButtons, IonButton, IonActionSheet, IonIcon, IonBackButton } from '@ionic/react';
import { useState, useEffect } from 'react';
import { fetchGuestById, GuestData } from '../utils/fetchGuest'
import { fetchUserById, UserData } from '../utils/fetchUser';
import './DefaultViewport.css';

import GuestAddModal from './components/GuestAddModal';
import GuestEditModal from './components/GuestEditModal';
import { handleCopy } from './components/handleCopy';
import { handleWhatsapp } from './components/handleWhatsapp';
import axios from 'axios';

const GuestBook: React.FC = () => {

  const [presentToast] = useIonToast();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [guests, setGuests] = useState<GuestData[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<GuestData | null>(null);
  const [searchText, setSearchText] = useState('');

  const [isAddModal, setIsAddModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [isDelete, setIsDelete] = useState(false);


  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchUserById(Number(userId))
      .then(setUser)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const loadGuests = async () => {
    if (!user?.client_id) return;
    try {
      const data = await fetchGuestById(user.client_id);
      setGuests(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadGuests();
  }, [user?.client_id]);

  const safeLower = (value?: string | null) => value?.toLowerCase() ?? '';

  const filteredGuests = guests.filter((guest) => {
    const keyword = searchText.toLowerCase();

    return (
      safeLower(guest.name).includes(keyword) ||
      safeLower(guest.phone).includes(keyword) ||
      safeLower(guest.category).includes(keyword)
    );
  });

  const handleEdit = async (guest: GuestData) => {
    setSelectedGuest(guest);
    setIsEditModal(true);
  }

  const handleDelete = async (guest: GuestData) => {
    setSelectedGuest(guest);
    setIsDelete(true)
  };

  const handleConfirmDelete = async () => {
    if (!selectedGuest) return;

    try {
      const token = localStorage.getItem('auth_token');
      await axios.post(
        `https://enbiinvitation.com/api/guestbook/delete/${selectedGuest.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      presentToast({
        message: 'Tamu berhasil dihapus',
        duration: 1500,
        position: 'top',
      });

      setIsDelete(false);
      setSelectedGuest(null);
      loadGuests();
    } catch (error) {
      console.error(error);
      presentToast({
        message: 'Gagal menghapus tamu',
        duration: 2000,
        color: 'danger',
        position: 'top',
      });
    }
  };
  
  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home"></IonBackButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton onClick={() => setIsAddModal(true)}>Tambah Tamu</IonButton>
          </IonButtons>
          <IonTitle>Buku Tamu</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar value={searchText} debounce={300} placeholder="Cari tamu..." onIonInput={(e) => setSearchText(e.detail.value!)}></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true} className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Header</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          {filteredGuests.map((guest) => (
            <IonItemSliding key={guest.id}>
              <IonItemOptions side="start">
                <IonItemOption color="primary" onClick={() => handleCopy(guest, presentToast)}>Salin</IonItemOption>
                {guest.phone && (
                  <IonItemOption color="success" onClick={() => handleWhatsapp(guest)}>Whatsapp</IonItemOption>
                )}
              </IonItemOptions>
              <IonItem>
                <IonLabel>
                  <strong>{guest.name}</strong>
                  <p>{guest.phone}</p>
                </IonLabel>
                <p>{guest.category}</p>
              </IonItem>
              <IonItemOptions side="end">
                <IonItemOption color="warning" onClick={() => handleEdit(guest)}>Edit</IonItemOption>
                <IonItemOption color="danger" onClick={() => handleDelete(guest)}>Hapus</IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
          ))}
        </IonList>
        <GuestAddModal modalOpen={isAddModal} onClose={() => setIsAddModal(false)} onSuccess={() => loadGuests()} />
        <GuestEditModal modalOpen={isEditModal} selectedId={selectedGuest?.id} onClose={() => setIsEditModal(false)} onSuccess={() => loadGuests()} />
        <IonActionSheet
          isOpen={isDelete}
          header="Kamu yakin ingin menghapus tamu ini?"
          buttons={[
            {
              text: 'Ya',
              role: 'destructive',
              handler: handleConfirmDelete,
            },
            {
              text: 'Tidak',
              role: 'cancel',
            },
          ]}
          onDidDismiss={() => setIsDelete(false)}
        />
      </IonContent>
    </IonPage>
  );
};


export default GuestBook;