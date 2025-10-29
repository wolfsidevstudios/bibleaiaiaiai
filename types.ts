

export interface Verse {
  book_id: string;
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface BibleApiResponse {
  reference: string;
  verses: Verse[];
  text: string;
  translation_id: string;
  translation_name: string;
  translation_note: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts?: { text: string }[];
  plan?: Plan;
}

export interface DailyContent {
  day: number;
  title: string;
  scripture: string;
  body: string;
  prayer: string;
}

export interface Plan {
  id: string;
  title: string;
  duration: string;
  image?: string;
  description: string;
  content: DailyContent[];
}

export interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
}

export interface PexelsApiResponse {
  page: number;
  per_page: number;
  photos: PexelsPhoto[];
  total_results: number;
  next_page: string;
}

export interface Clip {
  id: string;
  photo: PexelsPhoto;
  verse: {
    text: string;
    reference: string;
  };
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  reference: string;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  image: string;
  questions: QuizQuestion[];
}
