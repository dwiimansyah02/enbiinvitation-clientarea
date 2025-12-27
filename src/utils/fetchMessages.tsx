import axios from 'axios';

export interface MessagesData {
  name: string;
  status: string;
  confirmation: number;
  messages: string;
  datetime: string
}

export const fetchMessagesByUserId = async (
  userId: number
): Promise<MessagesData> => {
  const response = await axios.get(
    `https://enbiinvitation.com/api/messages/${userId}`
  );

  return response.data.data;
};
