import { Clip, Plan } from '../types';

const BOOKMARKS_KEY = 'mybible_bookmarks';
const CLIPS_BOOKMARKS_KEY = 'mybible_clip_bookmarks';
const PLANS_KEY = 'mybible_saved_plans';
const PLAN_PROGRESS_KEY = 'mybible_plan_progress';


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
