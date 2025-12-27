export interface UserData {
  id: number;
  client_id: number;
  name: string;
  email: string;
}

export const fetchUserById = async (userId: number): Promise<UserData> => {
  const token = localStorage.getItem('auth_token');

  const res = await fetch(
    `https://enbiinvitation.com/api/user/${userId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Gagal mengambil data user');
  }

  const data = await res.json();

  return {
    id: data.user.id,
    client_id: data.user.client_id,
    name: data.user.name,
    email: data.user.email,
  };
};