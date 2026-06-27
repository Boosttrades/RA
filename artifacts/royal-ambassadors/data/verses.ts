export interface MemoryVerse {
  id: string;
  text: string;
  reference: string;
  topic: string;
}

export const MEMORY_VERSES: MemoryVerse[] = [
  {
    id: "1",
    text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
    reference: "Joshua 1:9",
    topic: "Courage",
  },
  {
    id: "2",
    text: "The Lord is my shepherd; I shall not want.",
    reference: "Psalm 23:1",
    topic: "Trust",
  },
  {
    id: "3",
    text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
    reference: "John 3:16",
    topic: "Salvation",
  },
  {
    id: "4",
    text: "Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit.",
    reference: "Matthew 28:19",
    topic: "Missions",
  },
  {
    id: "5",
    text: "I can do all this through him who gives me strength.",
    reference: "Philippians 4:13",
    topic: "Strength",
  },
  {
    id: "6",
    text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
    reference: "Proverbs 3:5-6",
    topic: "Faith",
  },
  {
    id: "7",
    text: "Those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
    reference: "Isaiah 40:31",
    topic: "Hope",
  },
  {
    id: "8",
    text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.",
    reference: "Jeremiah 29:11",
    topic: "Purpose",
  },
  {
    id: "9",
    text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
    reference: "Romans 8:28",
    topic: "Providence",
  },
  {
    id: "10",
    text: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud.",
    reference: "1 Corinthians 13:4",
    topic: "Love",
  },
];

export function getDailyVerse(): MemoryVerse {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  return MEMORY_VERSES[dayOfYear % MEMORY_VERSES.length];
}
