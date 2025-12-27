import axios from 'axios';

export interface StatisticsData {
  guest: number;
  present: number;
  absent: number;
  messages: number;
}

export const fetchStatisticsByUserId = async (
  userId: number
): Promise<StatisticsData> => {
  const response = await axios.get(
    `https://enbiinvitation.com/api/statistics/${userId}`
  );

  return response.data.data;
};
