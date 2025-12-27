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
  useIonToast,
  IonText,
  IonSpinner,
  IonLabel,
} from '@ionic/react';
import { useEffect, useState } from 'react';

import axios from 'axios';

interface GuestEditModalProps {
  selectedId?: number;
  modalOpen: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

const GuestEditModal: React.FC<GuestEditModalProps> = ({
  selectedId,
  modalOpen,
  onClose,
  onSuccess
}) => {
  const [presentToast] = useIonToast();

  const [loading, setLoading] = useState(true);

  const [guestName, setGuestName] = useState('');
  const [categoryEdit, setCategory] = useState('');
  const [phoneEdit, setPhone] = useState('');

  const [errors, setErrors] = useState<{ guestName?: string; category?: string }>({});

  useEffect(() => {
    const fetchGuestDetail = async () => {
      if (!selectedId || !modalOpen) return;

      setLoading(true);
    
      try {
        const token = localStorage.getItem('auth_token');
      
        const response = await axios.get(
          `https://enbiinvitation.com/api/guestbook/guest/${selectedId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      
        const guest = response.data.data;
      
        setGuestName(guest.name ?? '');
        setCategory(guest.category ?? '');
        setPhone(guest.phone ?? '');
        setErrors({});
        setLoading(false);
      } catch (err: any) {
        presentToast({
          message: 'Gagal mengambil data tamu',
          duration: 2000,
          color: 'danger',
          position: 'top',
        });
      }
    };
  
    fetchGuestDetail();
  }, [selectedId, modalOpen]);
  
  const handleSave = async () => {
    setErrors({});
    
    const newErrors: { guestName?: string; category?: string } = {};
    if (!guestName.trim()) newErrors.guestName = 'Nama tamu wajib diisi';
    if (!categoryEdit.trim()) newErrors.category = 'Kategori wajib dipilih';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      presentToast({
        message: 'Periksa form, ada field yang wajib diisi',
        duration: 2000,
        color: 'danger',
        position: 'top',
      });
      return;
    }

    if (!selectedId) {
      presentToast({
        message: 'ID tamu tidak valid',
        color: 'danger',
        duration: 2000
      });
      return;
    }
  
    try {
      const formData = new FormData();
      const token = localStorage.getItem('auth_token');
      formData.append('guest_name_edit', guestName);
      formData.append('guest_category_edit', categoryEdit);
      formData.append('guest_phone_edit', phoneEdit || '');

      const response = await axios.post(
        `https://enbiinvitation.com/api/guestbook/update/${selectedId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      presentToast({
        message: 'Data tamu berhasil diperbarui',
        duration: 1500,
        position: 'top',
      });
    
      onClose?.();
      onSuccess?.();
      
    } catch (err: any) {
      presentToast({
        message: err.response?.data?.message || err.message || 'Gagal memperbarui data',
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
          <IonTitle>Edit Tamu</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>Tutup</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      
      <IonContent className="ion-padding">
        <IonList>
          {loading ? (
            <IonItem>
              <IonLabel>Sedang memuat data tamu...</IonLabel>
              <IonSpinner></IonSpinner>
            </IonItem>
          ) : (
            <>
              <IonItem>
                <IonInput
                  label="Nama Tamu"
                  labelPlacement="stacked"
                  placeholder="Contoh: John Doe & Partner"
                  value={guestName}
                  onIonChange={(e) => setGuestName(e.detail.value ?? '')}
                />
              </IonItem>
              {errors.guestName && (
                <IonText color="danger" className="ion-padding-start">
                  {errors.guestName}
                </IonText>
              )}
              <IonItem>
                <IonSelect
                  label="Kategori"
                  labelPlacement="stacked"
                  interface="popover"
                  value={categoryEdit}
                  placeholder="Pilih kategori"
                  onIonChange={(e) => {setCategory(e.detail.value ?? '')}}
                >
                  <IonSelectOption value="Guest">Guest</IonSelectOption>
                  <IonSelectOption value="VIP">VIP</IonSelectOption>
                </IonSelect>
              </IonItem>
              {errors.category && (
                <IonText color="danger" className="ion-padding-start">
                  {errors.category}
                </IonText>
              )}
              <IonItem>
                <IonInput
                  label="Nomor Whatsapp"
                  labelPlacement="stacked"
                  placeholder="Contoh: 081234567890"
                  inputMode="numeric"
                  value={phoneEdit}
                  onIonInput={(e) => {
                    const value = e.detail.value ?? '';
                    const numericOnly = value.replace(/\D/g, '');
                    setPhone(numericOnly);
                  }}
                />
              </IonItem>
            </>
          )}
        </IonList>

        <ul style={{ display: 'none' }}>
          <li>id: {selectedId}</li>
          <li>name: {guestName}</li>
          <li>category: {categoryEdit}</li>
          <li>phone: {phoneEdit}</li>
        </ul>
        
        {!loading && (
          <IonButton expand="block" color="primary" onClick={handleSave}>
            Simpan
          </IonButton>
        )}
      </IonContent>
      
    </IonModal>
  );
};

export default GuestEditModal;
