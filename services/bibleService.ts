
import { BibleApiResponse } from '../types';

const API_BASE_URL = 'https://bible-api.com';

export const fetchVerse = async (query: string): Promise<BibleApiResponse | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(query)}`);
    if (!response.ok) {
      console.error('Bible API response not ok:', response.statusText);
      return null;
    }
    const data: BibleApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch verse:', error);
    return null;
  }
};
