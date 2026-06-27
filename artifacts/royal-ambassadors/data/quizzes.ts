export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "In Joshua 1:9, God tells Joshua to be strong and courageous. What reason does God give?",
    options: [
      "Because Joshua is a great warrior",
      "Because the Lord your God will be with you wherever you go",
      "Because Israel has a mighty army",
      "Because Joshua has studied the Law",
    ],
    correctIndex: 1,
    explanation: "God's promise is the reason for courage — his presence, not our own strength.",
  },
  {
    id: "q2",
    question: "What is the Great Commission found in Matthew 28:19?",
    options: [
      "Love your neighbor as yourself",
      "Go and make disciples of all nations",
      "Pray without ceasing",
      "Honor your father and mother",
    ],
    correctIndex: 1,
    explanation: "Jesus commanded his followers to make disciples of all nations — this is the Great Commission.",
  },
  {
    id: "q3",
    question: 'Complete the verse: "I can do all this through him who..."',
    options: [
      "loves me unconditionally",
      "created the heavens and earth",
      "gives me strength",
      "has saved me from sin",
    ],
    correctIndex: 2,
    explanation: "Philippians 4:13 teaches that our ability comes from Christ's strength, not our own.",
  },
  {
    id: "q4",
    question: "What is the meaning of the word 'missions' in the Royal Ambassador context?",
    options: [
      "Military service to the government",
      "Building church buildings overseas",
      "Sharing the Gospel and serving people around the world",
      "Traveling to foreign countries for adventure",
    ],
    correctIndex: 2,
    explanation: "Missions means carrying God's love and the message of Jesus to people everywhere.",
  },
  {
    id: "q5",
    question: "According to John 3:16, why did God give his only Son?",
    options: [
      "To judge the world for its sins",
      "So that whoever believes in him shall not perish but have eternal life",
      "To establish his kingdom on earth",
      "To fulfill the prophecies of the Old Testament",
    ],
    correctIndex: 1,
    explanation: "John 3:16 is the heart of the Gospel — God's love leads to salvation for all who believe.",
  },
  {
    id: "q6",
    question: "Which of the following is listed as a Fruit of the Spirit in Galatians 5?",
    options: [
      "Courage, wisdom, and discipline",
      "Wealth, health, and success",
      "Love, joy, peace, patience, and kindness",
      "Faith, hope, and charity",
    ],
    correctIndex: 2,
    explanation: "Galatians 5:22-23 lists the fruit of the Spirit: love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, and self-control.",
  },
  {
    id: "q7",
    question: "In Proverbs 3:5, we are told to trust in the Lord with all our heart and NOT do what?",
    options: [
      "Lean on our own understanding",
      "Ask others for advice",
      "Read the Bible every day",
      "Attend church regularly",
    ],
    correctIndex: 0,
    explanation: "Proverbs 3:5 contrasts trusting God with leaning on our own limited understanding.",
  },
  {
    id: "q8",
    question: "What does Romans 8:28 tell us God works for?",
    options: [
      "The good of everyone in the world",
      "The good of those who love him and are called according to his purpose",
      "The destruction of evil in the world",
      "The success of Christian nations",
    ],
    correctIndex: 1,
    explanation: "Romans 8:28 is a promise specifically for those who love God and are called to his purpose.",
  },
  {
    id: "q9",
    question: "According to Isaiah 40:31, what happens to those who hope in the Lord?",
    options: [
      "They will receive great wealth",
      "They will never experience hardship",
      "They will renew their strength and soar like eagles",
      "They will be protected from all enemies",
    ],
    correctIndex: 2,
    explanation: "Isaiah 40:31 promises renewed strength — running, walking, and soaring — for those who hope in God.",
  },
  {
    id: "q10",
    question: "What does the Royal Ambassador Promise call us to do for people around the world?",
    options: [
      "Build hospitals and schools in every nation",
      "Have a Christlike concern, share the message, work with others, and give to missions",
      "Learn every language and culture on earth",
      "Become professional missionaries",
    ],
    correctIndex: 1,
    explanation: "The RA Promise covers concern, sharing, teamwork, and giving — a complete picture of mission involvement.",
  },
];
