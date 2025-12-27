// =====================
// Types
// =====================
export interface GuestData {
  id: number;
  category: string;
  name: string;
  phone: string;
  slug: string;
  client_url: string;
}

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T[];
}

// =====================
// Fetch Function
// =====================
export const fetchGuestById = async (
  userId: number
): Promise<GuestData[]> => {
  const token = localStorage.getItem('auth_token');

  if (!token) {
    throw new Error('Token tidak ditemukan. Silakan login ulang.');
  }

  const res = await fetch(
    `https://enbiinvitation.com/api/guestbook/client/${userId}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Gagal mengambil data guest');
  }

  const json: ApiResponse<GuestData> = await res.json();

  return json.data ?? [];
};