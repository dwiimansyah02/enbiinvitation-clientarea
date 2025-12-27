import axios from 'axios';

/* ================= STYLE ================= */

export interface StyleDetail {
  id: number;
  style_id: number;
  name: string;
  value: string;
  animation_set: string | null;
}

export interface StyleView {
  id: number;
  style_id: number;
  name: string;
  value: string;
}

export interface StyleData {
  id: number;
  name: string;
  slug: string;
  type: string;
  color: {
    background: string;
    base: string;
    accent: string;
    border: string;
    button: string;
  };
  font: {
    base: string;
    accent: string;
    latin: string;
    latin_url: string;
  };
  detail: StyleDetail[];
  viewstyle: StyleView[];
}

/* ================= GALLERY ================= */

export interface GalleryData {
  id: number;
  client_id: number;
  thumbnail: string;
}

/* ================= GIFT ================= */

export interface GiftData {
  id: number;
  client_id: number;
  category: string;
  bank_name: string;
  name: string;
  value: string;
}

/* ================= API RESPONSE ================= */

export interface ClientResponse {
  status: number;
  message: string;
  data: {
    style: StyleData;
    gallery: GalleryData[];
    gift: GiftData[];
  };
}

const API_URL = 'https://enbiinvitation.com/api/client';

export const fetchClientStyleByUserId = async (
  userId: number
): Promise<StyleData> => {
  const { data } = await axios.get<ClientResponse>(`${API_URL}/${userId}`);
  return data.data.style;
};

export const fetchClientGalleryByUserId = async (
  userId: number
): Promise<GalleryData[]> => {
  const { data } = await axios.get<ClientResponse>(`${API_URL}/${userId}`);
  return data.data.gallery;
};

export const fetchClientGiftByUserId = async (
  userId: number
): Promise<GiftData[]> => {
  const { data } = await axios.get<ClientResponse>(`${API_URL}/${userId}`);
  return data.data.gift;
};
