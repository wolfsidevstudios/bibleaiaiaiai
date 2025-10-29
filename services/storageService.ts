import { Clip } from '../types';

const BOOKMARKS_KEY = 'mybible_bookmarks';
const CLIPS_BOOKMARKS_KEY = 'mybible_clip_bookmarks';

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