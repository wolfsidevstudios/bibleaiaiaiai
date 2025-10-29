export interface BibleTopic {
  name: string;
  emoji: string;
  description: string;
}

export const BIBLE_TOPICS: BibleTopic[] = [
  { name: 'Faith', emoji: '🙏', description: "Trust and belief in God's promises." },
  { name: 'Love', emoji: '❤️', description: "God's love for us and our love for others." },
  { name: 'Forgiveness', emoji: '🤝', description: "Receiving and giving pardon and grace." },
  { name: 'Hope', emoji: '✨', description: "Confident expectation in eternal salvation." },
  { name: 'Grace', emoji: '💧', description: "God's unmerited favor and divine assistance." },
  { name: 'Wisdom', emoji: '💡', description: "Seeking divine knowledge and understanding." },
  { name: 'Strength', emoji: '💪', description: "Finding power and resilience in God." },
  { name: 'Peace', emoji: '🕊️', description: "Inner tranquility that surpasses understanding." },
  { name: 'Prayer', emoji: '🙌', description: "Communicating with God." },
  { name: 'Salvation', emoji: '✝️', description: "Deliverance from sin and its consequences." },
  { name: 'Creation', emoji: '🌍', description: "God's work as the maker of all things." },
  { name: 'Prophecy', emoji: '📜', description: "Divine revelation and future events." }
];
