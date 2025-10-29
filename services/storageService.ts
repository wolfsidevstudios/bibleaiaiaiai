import { Clip, Plan, UserProfile, StreakData, OnboardingData } from '../types';

const BOOKMARKS_KEY = 'mybible_bookmarks';
const CLIPS_BOOKMARKS_KEY = 'mybible_clip_bookmarks';
const PLANS_KEY = 'mybible_saved_plans';
const PLAN_PROGRESS_KEY = 'mybible_plan_progress';
const USER_PROFILE_KEY = 'mybible_user_profile';
const STREAK_KEY = 'mybible_daily_streak';
const LAST_READ_KEY = 'mybible_last_read';
const DAILY_PRAYER_KEY = 'mybible_daily_prayer';
const ONBOARDING_DATA_KEY = 'mybible_onboarding_data';

// Onboarding Data
export const getOnboardingData = (): OnboardingData | null => {
  const dataJson = localStorage.getItem(ONBOARDING_DATA_KEY);
  return dataJson ? JSON.parse(dataJson) : null;
};

export const saveOnboardingData = (data: OnboardingData): void => {
  localStorage.setItem(ONBOARDING_DATA_KEY, JSON.stringify(data));
};

// Daily Prayer
export interface DailyPrayerData {
  date: string; // YYYY-MM-DD
  prayer: string;
}

export const getDailyPrayer = (): DailyPrayerData | null => {
  const prayerJson = localStorage.getItem(DAILY_PRAYER_KEY);
  return prayerJson ? JSON.parse(prayerJson) : null;
};

export const saveDailyPrayer = (prayer: string, date: string): void => {
  const data: DailyPrayerData = { prayer, date };
  localStorage.setItem(DAILY_PRAYER_KEY, JSON.stringify(data));
};


// Last Read Chapter
interface LastReadData {
  book: string;
  chapter: number;
}

export const getLastRead = (): LastReadData | null => {
  const lastReadJson = localStorage.getItem(LAST_READ_KEY);
  return lastReadJson ? JSON.parse(lastReadJson) : null;
};

export const saveLastRead = (book: string, chapter: number): void => {
  const data: LastReadData = { book, chapter };
  localStorage.setItem(LAST_READ_KEY, JSON.stringify(data));
};


// Daily Streak
export const getStreakData = (): StreakData | null => {
  const streakJson = localStorage.getItem(STREAK_KEY);
  return streakJson ? JSON.parse(streakJson) : null;
};

export const saveStreakData = (data: StreakData): void => {
  localStorage.setItem(STREAK_KEY, JSON.stringify(data));
};

export const updateStreak = (): StreakData => {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  const streakData = getStreakData();

  if (!streakData) {
    const newStreak = { count: 1, lastVisit: todayStr };
    saveStreakData(newStreak);
    return newStreak;
  }

  if (streakData.lastVisit === todayStr) {
    return streakData; // Already visited today
  }

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  if (streakData.lastVisit === yesterdayStr) {
    // Streak continues
    const newStreak = { count: streakData.count + 1, lastVisit: todayStr };
    saveStreakData(newStreak);
    return newStreak;
  } else {
    // Streak broken, reset to 1
    const newStreak = { count: 1, lastVisit: todayStr };
    saveStreakData(newStreak);
    return newStreak;
  }
};


// User Profile
export const getUserProfile = (): UserProfile | null => {
  const profileJson = localStorage.getItem(USER_PROFILE_KEY);
  return profileJson ? JSON.parse(profileJson) : null;
};

export const saveUserProfile = (profile: UserProfile): void => {
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
};

export const removeUserProfile = (): void => {
  localStorage.removeItem(USER_PROFILE_KEY);
};


// Verse Bookmarks
export const getBookmarks = (): string[] => {
  const bookmarksJson = localStorage.getItem(BOOKMARKS_KEY);
  return bookmarksJson ? JSON.parse(bookmarksJson) : [];
};

export const addBookmark = (verseReference: string): void => {
  const bookmarks = getBookmarks();
  if (!bookmarks.includes(verseReference)) {
    const newBookmarks = [...bookmarks, verseReference];
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(newBookmarks));
  }
};

export const removeBookmark = (verseReference: string): void => {
  const bookmarks = getBookmarks();
  const newBookmarks = bookmarks.filter(ref => ref !== verseReference);
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(newBookmarks));
};

// Clip Bookmarks
export const getClipBookmarks = (): Clip[] => {
  const bookmarksJson = localStorage.getItem(CLIPS_BOOKMARKS_KEY);
  return bookmarksJson ? JSON.parse(bookmarksJson) : [];
};

export const addClipBookmark = (clip: Clip): void => {
  const bookmarks = getClipBookmarks();
  if (!bookmarks.some(b => b.id === clip.id)) {
    const newBookmarks = [...bookmarks, clip];
    localStorage.setItem(CLIPS_BOOKMARKS_KEY, JSON.stringify(newBookmarks));
  }
};

export const removeClipBookmark = (clipId: string): void => {
  const bookmarks = getClipBookmarks();
  const newBookmarks = bookmarks.filter(b => b.id !== clipId);
  localStorage.setItem(CLIPS_BOOKMARKS_KEY, JSON.stringify(newBookmarks));
};

export const isClipBookmarked = (clipId: string): boolean => {
    const bookmarks = getClipBookmarks();
    return bookmarks.some(b => b.id === clipId);
};

// Saved Plans
export const getSavedPlans = (): Plan[] => {
  const plansJson = localStorage.getItem(PLANS_KEY);
  return plansJson ? JSON.parse(plansJson) : [];
};

export const savePlan = (plan: Plan): void => {
  const plans = getSavedPlans();
  if (!plans.some(p => p.id === plan.id)) {
    const newPlans = [...plans, plan];
    localStorage.setItem(PLANS_KEY, JSON.stringify(newPlans));
  }
};

export const isPlanSaved = (planId: string): boolean => {
  const plans = getSavedPlans();
  return plans.some(p => p.id === planId);
};

// Plan Progress
export type PlanProgress = { [planId: string]: { currentDay: number } };

export const getPlanProgress = (): PlanProgress => {
  const progressJson = localStorage.getItem(PLAN_PROGRESS_KEY);
  return progressJson ? JSON.parse(progressJson) : {};
};

export const startOrContinuePlan = (planId: string): void => {
  const progress = getPlanProgress();
  if (!progress[planId]) {
    progress[planId] = { currentDay: 1 };
    localStorage.setItem(PLAN_PROGRESS_KEY, JSON.stringify(progress));
  }
};

export const updatePlanProgress = (planId: string, day: number): void => {
  const progress = getPlanProgress();
  // Ensure the plan has been started before updating
  if (progress[planId]) {
    progress[planId].currentDay = day;
    localStorage.setItem(PLAN_PROGRESS_KEY, JSON.stringify(progress));
  }
};

export const isPlanStarted = (planId: string): boolean => {
    const progress = getPlanProgress();
    return !!progress[planId];
};