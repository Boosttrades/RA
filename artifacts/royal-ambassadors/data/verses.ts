export interface MemoryVerse {
  id: string;
  text: string;
  reference: string;
  topic: string;
}

export const MEMORY_VERSES: MemoryVerse[] = [
  // Core RA identity
  {
    id: "1",
    text: "We are therefore Christ's ambassadors, as though God were making his appeal through us.",
    reference: "2 Corinthians 5:20",
    topic: "Ambassadorship",
  },
  {
    id: "2",
    text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
    reference: "Joshua 1:9",
    topic: "Courage",
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
  // Service & Leadership
  {
    id: "11",
    text: "For even the Son of Man did not come to be served, but to serve, and to give his life as a ransom for many.",
    reference: "Mark 10:45",
    topic: "Service",
  },
  {
    id: "12",
    text: "Do not merely listen to the word, and so deceive yourselves. Do what it says.",
    reference: "James 1:22",
    topic: "Obedience",
  },
  {
    id: "13",
    text: "Start children off on the way they should go, and even when they are old they will not turn from it.",
    reference: "Proverbs 22:6",
    topic: "Training",
  },
  {
    id: "14",
    text: "But you will receive power when the Holy Spirit comes on you; and you will be my witnesses in Jerusalem, and in all Judea and Samaria, and to the ends of the earth.",
    reference: "Acts 1:8",
    topic: "Witnessing",
  },
  {
    id: "15",
    text: "He has shown you, O mortal, what is good. And what does the Lord require of you? To act justly and to love mercy and to walk humbly with your God.",
    reference: "Micah 6:8",
    topic: "Character",
  },
  // Scripture & Prayer
  {
    id: "16",
    text: "All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness, so that the servant of God may be thoroughly equipped for every good work.",
    reference: "2 Timothy 3:16-17",
    topic: "Scripture",
  },
  {
    id: "17",
    text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
    reference: "Philippians 4:6",
    topic: "Prayer",
  },
  {
    id: "18",
    text: "Your word is a lamp for my feet, a light on my path.",
    reference: "Psalm 119:105",
    topic: "God's Word",
  },
  // Brotherhood & Community
  {
    id: "19",
    text: "How good and pleasant it is when God's people live together in unity!",
    reference: "Psalm 133:1",
    topic: "Brotherhood",
  },
  {
    id: "20",
    text: "So in everything, do to others what you would have them do to you, for this sums up the Law and the Prophets.",
    reference: "Matthew 7:12",
    topic: "Golden Rule",
  },
  // Growth & Seeking God
  {
    id: "21",
    text: "But seek first his kingdom and his righteousness, and all these things will be given to you as well.",
    reference: "Matthew 6:33",
    topic: "Priorities",
  },
  {
    id: "22",
    text: "But grow in the grace and knowledge of our Lord and Saviour Jesus Christ.",
    reference: "2 Peter 3:18",
    topic: "Spiritual Growth",
  },
  {
    id: "23",
    text: "You are the light of the world. A town built on a hill cannot be hidden. In the same way, let your light shine before others, that they may see your good deeds and glorify your Father in heaven.",
    reference: "Matthew 5:14-16",
    topic: "Witness",
  },
  {
    id: "24",
    text: "Love the Lord your God with all your heart and with all your soul and with all your mind and with all your strength.",
    reference: "Mark 12:30",
    topic: "Devotion",
  },
  {
    id: "25",
    text: "Now it is required that those who have been given a trust must prove faithful.",
    reference: "1 Corinthians 4:2",
    topic: "Faithfulness",
  },
];

export function getDailyVerse(): MemoryVerse {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  return MEMORY_VERSES[dayOfYear % MEMORY_VERSES.length];
}
