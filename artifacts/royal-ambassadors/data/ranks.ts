export interface RankRequirement {
  id: string;
  text: string;
}

export interface Rank {
  id: string;
  name: string;
  level: number;
  ageGroup: string;
  description: string;
  requirements: RankRequirement[];
  color: string;
}

export const RANKS: Rank[] = [
  {
    id: "candidate",
    name: "Candidate",
    level: 1,
    ageGroup: "Any age (entry rank)",
    description:
      "Also called Prospect. Complete this rank before becoming a full member of a Royal Ambassador chapter.",
    requirements: [
      { id: "c1", text: "Attend four chapter meetings" },
      {
        id: "c2",
        text: "Learn and say the Royal Ambassador motto, pledge, hymn, and commission and declaration",
      },
      {
        id: "c3",
        text: "Learn and explain the Royal Ambassador colours and emblem",
      },
      { id: "c4", text: "Start and complete the Basic Discipleship Course" },
      { id: "c5", text: "Be accepted into the chapter by majority vote" },
    ],
    color: "#6B7280",
  },
  {
    id: "assistant-intern",
    name: "Assistant Intern",
    level: 2,
    ageGroup: "10 years old",
    description:
      "Begin your journey as a Royal Ambassador — learn foundational knowledge of faith, the Bible, and community service.",
    requirements: [
      {
        id: "ai1",
        text: "Attend Sunday School lessons for at least 6 months in the year, and write out and submit topics and memory verses of the studies",
      },
      {
        id: "ai2",
        text: "Attend Church Training and/or House Fellowship for at least 30 Sundays in the year of study (fellowship leader and church pastor will sign certification)",
      },
      {
        id: "ai3",
        text: "Attend RA weekly meetings for at least 40 meetings a year (chapter secretary and president are to sign certification)",
      },
      {
        id: "ai4",
        text: "Learn, say or sing: (i) RA Motto, (ii) RA Pledge, (iii) Stanza 1 of the RA hymn",
      },
      {
        id: "ai5",
        text: 'Share with the chapter what it means to be "A Royal Ambassador"',
      },
      {
        id: "ai6",
        text: "Tell the life history of Jesus from His birth to age 12 as found in Luke 12",
      },
      {
        id: "ai7",
        text: "Tell the story of the Lost Sheep as found in Luke 15:3-9 and explain what the story means",
      },
      {
        id: "ai8",
        text: "Learn and say: (i) First three of the Ten Commandments, (ii) First six books of the Bible",
      },
      {
        id: "ai9",
        text: "Invite a friend to Sunday School, House Fellowship or RA meeting",
      },
      {
        id: "ai10",
        text: "Do the following community service projects: (i) Visit 2 elderly people in your church and do some work for them receiving nothing in return, (ii) Do services for your pastor (e.g. wash his car, cut grass, wash or sweep his house)",
      },
    ],
    color: "#3B82F6",
  },
  {
    id: "intern",
    name: "Intern",
    level: 3,
    ageGroup: "11 years old",
    description:
      "Grow in God's Word, deepen your prayer life, and share your faith story with your chapter.",
    requirements: [
      {
        id: "i1",
        text: "Attend, write out and submit topic and memory verses of Sunday School lessons for at least 6 months in the year of study",
      },
      {
        id: "i2",
        text: "Attend Church Training and/or House Fellowship for at least 30 Sundays in the year of study (house fellowship leader and church pastor will sign certification)",
      },
      {
        id: "i3",
        text: "Attend RA weekly meeting for at least 40 meetings a year (chapter secretary and president will sign certification)",
      },
      {
        id: "i4",
        text: "Learn and say: (i) RA motto, (ii) First two stanzas of the RA hymn",
      },
      {
        id: "i5",
        text: "Tell the life history of Jesus from His birth to age 12 as found in Luke 12",
      },
      {
        id: "i6",
        text: "Tell the story of the Lost Sheep as found in Luke 15:3-9 and explain what the story means",
      },
      {
        id: "i7",
        text: "Learn and say: (i) First three of the Ten Commandments, (ii) First six books of the Bible",
      },
      {
        id: "i8",
        text: "Share with the Chapter: (i) What you want to become in the future with emphasis on what you need to do to achieve/develop that career, (ii) A community service project you did without any gratification/pay",
      },
      {
        id: "i9",
        text: "Write and submit or share with the Chapter: (i) My experience the first day I ever shared Christ with someone, (ii) The sport/game I love most",
      },
    ],
    color: "#10B981",
  },
  {
    id: "senior-intern",
    name: "Senior Intern",
    level: 4,
    ageGroup: "12 years old",
    description:
      "Demonstrate Christian character in daily life and explain the RA's cardinal objectives and salvation testimony.",
    requirements: [
      {
        id: "si1",
        text: "Attend, write out and submit topic and memory verses of Sunday School lessons for at least 6 months in the year of study",
      },
      {
        id: "si2",
        text: "Attend Church Training and/or House Fellowship for at least 30 Sundays in the year of study (house fellowship leader and church pastor will sign certification)",
      },
      {
        id: "si3",
        text: "Attend RA weekly meeting for at least 40 meetings a year (chapter secretary and president will sign certification)",
      },
      {
        id: "si4",
        text: "Learn, explain or sing: (i) The RA colours, (ii) Three stanzas of the RA hymn, (iii) The Commission and Declaration, (iv) The RA emblem",
      },
      {
        id: "si5",
        text: "Tell the story of the Good Samaritan as found in Luke 10:29-37 and discuss the importance of First Aid",
      },
      {
        id: "si6",
        text: 'During the period of study, do the "Basic Discipleship Lessons" course (if not yet done) and get certification from your pastor',
      },
      {
        id: "si7",
        text: "Explain the 7 cardinal objectives of the RA of Nigeria",
      },
      {
        id: "si8",
        text: 'Write and share with the chapter on "My Salvation Testimony"',
      },
      {
        id: "si9",
        text: "Do any two of the following: (i) A community service project for your church, neighbourhood or school, (ii) Study 5 vocations in Nigeria and what it takes to achieve them, (iii) Describe a sport you love and discuss current events in that sport",
      },
    ],
    color: "#8B5CF6",
  },
  {
    id: "envoy",
    name: "Envoy",
    level: 5,
    ageGroup: "13 years old",
    description:
      "Study the Bible more deeply, engage in discipleship, and visit those in need in your community.",
    requirements: [
      {
        id: "e1",
        text: "What does it mean to be born again? Discuss with reference to John 3:1-19",
      },
      {
        id: "e2",
        text: "Do a character study on any 3 of the following: Paul, David, Abraham, Joseph, or Elisha",
      },
      {
        id: "e3",
        text: "Participate in a sword drill contest at the chapter, association, conference or national level and produce a letter confirming your participation",
      },
      {
        id: "e4",
        text: "Study the book of Romans and discuss the highlights",
      },
      {
        id: "e5",
        text: "Meet the basic requirements: (i) Attend Sunday School for at least 6 months in the year of study, (ii) Attend Church Training or House Fellowship for at least 30 Sundays and produce certification, (iii) Attend RA weekly meeting for at least 40 meetings a year, (iv) Learn the order of Royal Ambassadors",
      },
      {
        id: "e6",
        text: "Learn the departments of the Nigerian Baptist Convention (see current NBC Diary for details)",
      },
      {
        id: "e7",
        text: "Do the Follow the Master discipleship course",
      },
      {
        id: "e8",
        text: "Visit a compassion or remand home, old people's home, or orphanage and share the gospel and gifts as you are led",
      },
      {
        id: "e9",
        text: "Learn about computer literacy and share how it can further the gospel",
      },
      {
        id: "e10",
        text: '"For all have sinned and fallen short of the glory of God." Use this as a first statement in a witnessing training rehearsal at a chapter meeting',
      },
    ],
    color: "#F59E0B",
  },
  {
    id: "special-envoy",
    name: "Special Envoy",
    level: 6,
    ageGroup: "14 years old",
    description:
      "Learn to share the plan of salvation, do the Serve the Master course, and organise activities within your chapter.",
    requirements: [
      {
        id: "se1",
        text: "Do a study on how God can use individual RA members and the entire organisation to serve Him (see John 6:5-13)",
      },
      {
        id: "se2",
        text: "What does 1 Corinthians 13 mean to you? Do a write-up",
      },
      {
        id: "se3",
        text: "Write or discuss a major Bible character and show what RAs can learn from that character",
      },
      {
        id: "se4",
        text: "Use the following verses to tell someone who is not a Christian how he/she can be saved: Romans 3:10, 23; 6:23; 1 John 1:9; Acts 1:8",
      },
      {
        id: "se5",
        text: "Meet the basic requirements: (i) Attend Sunday School for at least 6 months in the year of study, (ii) Attend Church Training/House Fellowship for at least 80 Sundays and produce certification, (iii) Attend at least 40 RA meetings in a year",
      },
      {
        id: "se6",
        text: "Do the Serve the Master discipleship course",
      },
      {
        id: "se7",
        text: "Write out your salvation testimony to demonstrate how you know you are saved",
      },
      {
        id: "se8",
        text: "Discuss one major national event and its implications for missions",
      },
      {
        id: "se9",
        text: "Organise a mini competition among members of your chapter (e.g. scrabble, table tennis)",
      },
      {
        id: "se10",
        text: "Know the names of principal officers of the Convention (see Convention current diary for details)",
      },
    ],
    color: "#EF4444",
  },
  {
    id: "senior-envoy",
    name: "Senior Envoy",
    level: 7,
    ageGroup: "15 years old",
    description:
      "Complete the Master Life discipleship course, attend national leadership training, and lead a community service project against social vices.",
    requirements: [
      {
        id: "senv1",
        text: "Tell or write the story of Jesus' transfiguration and what He talked about with Moses and Elijah (Matthew 17:1-13; Mark 9:2-13; Luke 9:28-36)",
      },
      {
        id: "senv2",
        text: "Memorize and explain the meaning of Psalm 1",
      },
      {
        id: "senv3",
        text: "Write a brief biography of a Baptist missionary (living or dead, in or outside Nigeria)",
      },
      {
        id: "senv4",
        text: "Do the Master Life discipleship course in the year of study",
      },
      {
        id: "senv5",
        text: "Attend the annual National Leadership Training at Ede in the year of study",
      },
      {
        id: "senv6",
        text: "Do a summary of Paul's first missionary journey",
      },
      {
        id: "senv7",
        text: "Meet the basic requirements: (i) Attend Sunday School for at least 6 months in the year of study, (ii) Attend Church Training/House Fellowship for at least 30 Sundays and produce certification, (iii) Attend at least 40 RA meetings in a year, (iv) Know the origin/history of the RA of Nigeria",
      },
      {
        id: "senv8",
        text: "As a community service project, study and lead a group of volunteer RAs to contribute to fighting social vices",
      },
      {
        id: "senv9",
        text: "Do a rundown of major sporting events that will be held in the year of study",
      },
      {
        id: "senv10",
        text: "Know the names of principal officers of the RA of Nigeria",
      },
    ],
    color: "#EC4899",
  },
  {
    id: "dean",
    name: "Dean",
    level: 8,
    ageGroup: "16 years old",
    description:
      "Study stewardship and the Beatitudes, research global Baptist missions, and do the Experiencing God discipleship lesson.",
    requirements: [
      {
        id: "d1",
        text: 'With reference to the story of the rich young man and Jesus in Matthew 19:16-26 and Mark 10:17-28, discuss "stewardship of possession"',
      },
      {
        id: "d2",
        text: "Memorize and list out the Beatitudes as found in Matthew 5:1-12. Explain them and discuss how one can be saved",
      },
      {
        id: "d3",
        text: "Explain basic computer application methods and teach the chapter",
      },
      {
        id: "d4",
        text: "Make a list of 20 countries where Baptist work is found and an interesting Baptist programme in one of them (visit the Baptist World Alliance website)",
      },
      {
        id: "d5",
        text: "Research current events in the Global Missions Board of the Nigerian Baptist Convention and share how RAs can fit into them",
      },
      {
        id: "d6",
        text: "Do a summary of Paul's 2nd missionary journey",
      },
      {
        id: "d7",
        text: "Meet the basic requirements: (i) Attend Sunday School for at least 6 months in the year of study, (ii) Attend Church Training and/or House Fellowship for at least 30 Sundays and produce evidence, (iii) Attend at least 40 RA meetings in a year, (iv) Know the origin/history of the RA of Nigeria",
      },
      {
        id: "d8",
        text: "Visit a prison, remand home, home for the elderly, or motherless babies home; share the gospel, pray, and give a gift as you are led",
      },
      {
        id: "d9",
        text: "Do the Experiencing God discipleship lesson during the period/year of study",
      },
    ],
    color: "#0EA5E9",
  },
  {
    id: "ambassador",
    name: "Ambassador",
    level: 9,
    ageGroup: "17–19 years old",
    description:
      "Take on leadership responsibilities, train a junior RA, and must be a baptized believer to receive promotion.",
    requirements: [
      {
        id: "a1",
        text: "Discuss two ordinances of the Baptist church using the story of Jesus' baptism and the Lord's Supper as a background",
      },
      {
        id: "a2",
        text: "Using the story of the talents as found in Matthew 25:14-30, discuss how the diverse talents of RAs can be used to serve God",
      },
      {
        id: "a3",
        text: "Draw a map of Nigeria and locate the Home Mission Fields",
      },
      {
        id: "a4",
        text: "Discuss whether Christians can contribute to national development and how",
      },
      {
        id: "a5",
        text: "Serve as a Sunday School teacher, House Fellowship leader or participate in planting a new church",
      },
      {
        id: "a6",
        text: "Discuss the 7 cardinal objectives of the RA of Nigeria",
      },
      {
        id: "a7",
        text: "Meet the basic requirements: (i) Train a junior RA to pass his rank this year, (ii) Attend Sunday School and chapter meetings as stated in the rank of Dean, (iii) Do any work to help someone in which you will receive no pay, (iv) Meet with others working on the same rank on the possibility of starting or strengthening a new RA chapter",
      },
      {
        id: "a8",
        text: "Make a careful study of the danger of alcohol and tobacco on the human body and share it with the anti Social-vices Club of your association, conference and the Convention",
      },
      {
        id: "a9",
        text: "Discuss two major international events that occurred in the world during the period of study",
      },
      {
        id: "a10",
        text: "Write to the Social Ministries Division of the Convention requesting information on areas of need. Mobilize your chapter to pray and assist in that regard",
      },
      {
        id: "a11",
        text: "VERY IMPORTANT: You must be a baptized believer at this point or there will be no promotion. Submit evidence of your baptism into the church",
      },
    ],
    color: "#D4A217",
  },
  {
    id: "ambassador-extraordinary",
    name: "Ambassador Extraordinary",
    level: 10,
    ageGroup: "20–22 years old",
    description:
      "The senior leadership rank — help plant a church or new RA chapter, visit a mission field, and share your life purpose in Christ.",
    requirements: [
      {
        id: "ae1",
        text: "Discuss 5 miracles of Jesus and draw a lesson of faith from each of them",
      },
      {
        id: "ae2",
        text: "Do a study and explain practical witnessing (see Witness Training Course)",
      },
      {
        id: "ae3",
        text: "Give a brief outline of Baptist beliefs about the Bible, salvation, baptism, the Lord's Supper, and missions (see the Enquirers handbook)",
      },
      {
        id: "ae4",
        text: "Write a short history of your church, association or conference",
      },
      {
        id: "ae5",
        text: "Be acquainted with the basics of Information and Communication Technology (ICT) and share your knowledge with junior RAs in your chapter",
      },
      {
        id: "ae6",
        text: "Help start either a new church or a new Royal Ambassador chapter in a church",
      },
      {
        id: "ae7",
        text: "Visit a mission field in Nigeria and write a report of your visit",
      },
      {
        id: "ae8",
        text: 'To demonstrate your purpose in life, write on "What God is calling me to do in this life"',
      },
      {
        id: "ae9",
        text: "What is the Federation of International Football Association (FIFA) all about? What are its major competitions (see FIFA Website)?",
      },
      {
        id: "ae10",
        text: "Organise a community service project for boys in your chapter and lead them in carrying it out with the cooperation of your chapter leaders",
      },
      {
        id: "ae11",
        text: "All conditions on attendance and basic knowledge of RA are a pre-requisite",
      },
      {
        id: "ae12",
        text: "Communicate with RAs or an RA chapter outside Nigeria by email (attach computer printout as evidence)",
      },
    ],
    color: "#7C3AED",
  },
  {
    id: "ambassador-plenipotentiary",
    name: "Ambassador Plenipotentiary",
    level: 11,
    ageGroup: "23–24 years old",
    description:
      "The highest rank in Royal Ambassadors — demonstrate mastery of missions, leadership, and Christian service through a comprehensive project booklet and chapter defence.",
    requirements: [
      {
        id: "ap1",
        text: "Write a biography of the person after whom your chapter is named. Read it in a chapter meeting and include it in your project booklet",
      },
      {
        id: "ap2",
        text: "Make a chart of maps showing Paul's missionary journeys. Present a report on it to your chapter and include it in your project booklet",
      },
      {
        id: "ap3",
        text: "Read two books about missions and write a summary review on each in your project booklet",
      },
      {
        id: "ap4",
        text: "Using the Internet, keep up correspondences with RA chapters from three other countries and include evidence of your exchanged correspondence in the project booklet",
      },
      {
        id: "ap5",
        text: "Interview a Home or Foreign missionary either personally or by correspondence, and use your findings to develop a mission plan for the RAs of Nigeria in your conference, association or chapter",
      },
      {
        id: "ap6",
        text: "Help to start a Sunday School class, preaching station, House Fellowship or serve in a place of leadership in the Sunday School, Church Training or assist the Counsellor in your chapter for at least a year",
      },
      {
        id: "ap7",
        text: "Train an intermediate RA to pass his rank",
      },
      {
        id: "ap8",
        text: "Produce a handcraft work and explain its relevance to our ministry of reconciliation (the craft must be submitted with the project booklet)",
      },
      {
        id: "ap9",
        text: "Attend the leadership training for that year to defend your project",
      },
      {
        id: "ap10",
        text: "Write a drama on missions",
      },
      {
        id: "ap11",
        text: "Describe the current state of the country in writing. Include your suggestions and expected reforms in the write-up; or preach hope to a hopeless Nigerian",
      },
    ],
    color: "#991B1B",
  },
];

export function getCurrentRankIndex(rankId: string): number {
  return RANKS.findIndex((r) => r.id === rankId);
}
