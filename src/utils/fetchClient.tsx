import axios from 'axios';

export interface ClientData {
  id: number;
  title: string;
  url: string;
  hastag: string;
  music: string;
  photos: (string | null)[];
  bride: {
    name: string;
    alias: string;
    photo: string;
    parent: string;
  };
  groom: {
    name: string;
    alias: string;
    photo: string;
    parent: string;
  };
  event: {
    akad: {
      date: string;
      time_start: string;
      time_end: string;
      place: string;
      address: string;
    };
    resepsi: {
      date: string;
      time_start: string;
      time_end: string;
      place: string;
      address: string;
    };
  };
}

export interface ClientResponse {
  status: number;
  message: string;
  data: {
    client: ClientData;
  };
}

export const fetchClientByUserId = async (
  userId: number
): Promise<ClientData> => {
  const response = await axios.get<ClientResponse>(
    `https://enbiinvitation.com/api/client/${userId}`
  );

  return response.data.data.client;
};
