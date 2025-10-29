import { PexelsApiResponse } from '../types';

const API_KEY = '8Mh8jDK5VAgGnnmNYO2k0LqdaLL8lbIR4ou5Vnd8Zod0cETWahEx1MKf';
const API_BASE_URL = 'https://api.pexels.com/v1';

export const fetchPhotos = async (page: number, perPage: number = 5): Promise<PexelsApiResponse | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/curated?page=${page}&per_page=${perPage}`, {
      headers: {
        Authorization: API_KEY,
      },
    });
    if (!response.ok) {
      console.error('Pexels API response not ok:', response.statusText);
      return null;
    }
    const data: PexelsApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch from Pexels API:', error);
    return null;
  }
};
