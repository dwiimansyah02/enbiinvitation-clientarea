import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonList,
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption,
  useIonToast
} from '@ionic/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchUserById, UserData } from '../../utils/fetchUser';

interface GuestAddModalProps {
  modalOpen: boolean;
  loading?: boolean;
  setLoading?: (loading: boolean) => void;
  onClose?: () => void;
  onSuccess?: () => void;
}

const GuestAddModal: React.FC<GuestAddModalProps> = ({
  modalOpen,
  loading,
  setLoading,
  onClose,
  onSuccess
}) => {
  const [presentToast] = useIonToast();
  
  const [user, setUser] = useState<UserData | null>(null);

  const [clientId, setClientId] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestCategory, setGuestCategory] = useState('Guest');
  const [guestPhone, setGuestPhone] = useState('');

  useEffect(() => {
    const run = async () => {
      try {
        const storedUserId = localStorage.getItem('user_id');
        if (!storedUserId) return;

        const userRes = await fetchUserById(Number(storedUserId));
        setUser(userRes);
        setClientId(String(userRes.client_id));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading?.(false);
      }
    };

    run();
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading?.(true);
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('Token not found');

      const formData = new FormData();
      formData.append('client_id', clientId);
      formData.append('guest_category', guestCategory);
      formData.append('guest_name', guestName);
      if (guestPhone) {
        formData.append('guest_phone', guestPhone);
      }

      await axios.post(
        'https://enbiinvitation.com/api/guestbook/store',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      presentToast({
        message: 'Data tamu berhasil disimpan',
        duration: 1500,
        position: 'top',
      });

      onSuccess?.();
      onClose?.();
      setLoading?.(false);
    } catch (error) {
      presentToast({
        message: 'Gagal menyimpan tamu',
        duration: 2000,
        color: 'danger',
        position: 'top',
      });
    }
  };

  return (
    <IonModal isOpen={modalOpen}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tambah Tamu</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>Tutup</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonInput
              label="Nama Tamu"
              labelPlacement="stacked"
              placeholder="Contoh: John Doe & Partner"
              value={guestName}
              onIonInput={(e) => setGuestName(e.detail.value!)}
            />
          </IonItem>

          <IonItem>
            <IonSelect
              label="Kategori"
              labelPlacement="stacked"
              interface="popover"
              value={guestCategory}
              onIonChange={(e) => setGuestCategory(e.detail.value)}
            >
              <IonSelectOption value="Guest">Guest</IonSelectOption>
              <IonSelectOption value="VIP">VIP</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonInput
              label="Nomor Whatsapp"
              labelPlacement="stacked"
              placeholder="Contoh: 081234567890"
              inputMode="numeric"
              value={guestPhone}
              onIonInput={(e) => {
                const value = e.detail.value ?? '';
                const numericOnly = value.replace(/\D/g, '');
                setGuestPhone(numericOnly);
              }}
            />
          </IonItem>
        </IonList>

        <IonButton
          expand="block"
          color="primary"
          onClick={handleSubmit}
          disabled={loading || !guestName || !guestCategory}
        >
          Simpan
        </IonButton>
      </IonContent>
    </IonModal>
  );
};

export default GuestAddModal;