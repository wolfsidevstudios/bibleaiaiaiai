import { CLIP_VERSES } from './clipVerses';

const TOPIC_VERSE_MAP: { [key: string]: { text: string; reference: string }[] } = {
    'Faith': [
        { text: "Walk by faith, not by sight.", reference: "2 Corinthians 5:7" },
        { text: "Trust in the Lord with all your heart.", reference: "Proverbs 3:5" },
        { text: "With God, all things are possible.", reference: "Matthew 19:26" },
        { text: "Be still, and know that I am God.", reference: "Psalm 46:10" },
    ],
    'Love': [
        { text: "Love never fails.", reference: "1 Corinthians 13:8" },
        { text: "God is love.", reference: "1 John 4:8" },
        { text: "Perfect love casts out fear.", reference: "1 John 4:18" },
        { text: "I have found the one whom my soul loves.", reference: "Song of Solomon 3:4" }
    ],
    'Forgiveness': [
        { text: "His mercy is everlasting.", reference: "Psalm 100:5" },
        { text: "The truth will set you free.", reference: "John 8:32" },
    ],
    'Hope': [
        { text: "The joy of the Lord is your strength.", reference: "Nehemiah 8:10" },
        { text: "He restores my soul.", reference: "Psalm 23:3" },
    ],
    'Strength': [
        { text: "I can do all things through Christ.", reference: "Philippians 4:13" },
        { text: "He gives power to the weak.", reference: "Isaiah 40:29" },
    ],
    'Peace': [
        { text: "It is well with my soul.", reference: "Psalm 62:1" },
        { text: "Be still, and know that I am God.", reference: "Psalm 46:10" },
    ],
    'Prayer': [
        { text: "Give thanks to the Lord.", reference: "Psalm 107:1" },
    ],
    'Creation': [
        { text: "Let there be light.", reference: "Genesis 1:3" },
    ],
};

export const getVersesForTopics = (topics: string[]): { text: string; reference: string }[] => {
    if (!topics || topics.length === 0) {
        // Fallback to a random selection if no topics are provided
        return [...CLIP_VERSES].sort(() => 0.5 - Math.random()).slice(0, 10);
    }

    const verseSet = new Set<string>();
    const result: { text: string; reference: string }[] = [];

    topics.forEach(topic => {
        const verses = TOPIC_VERSE_MAP[topic] || [];
        verses.forEach(verse => {
            if (!verseSet.has(verse.reference)) {
                verseSet.add(verse.reference);
                result.push(verse);
            }
        });
    });

    // If not enough topic-specific verses, fill with general ones
    if (result.length < 5) {
        CLIP_VERSES.forEach(verse => {
            if (result.length < 10 && !verseSet.has(verse.reference)) {
                verseSet.add(verse.reference);
                result.push(verse);
            }
        });
    }

    return result.sort(() => 0.5 - Math.random());
};
