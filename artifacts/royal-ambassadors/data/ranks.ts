export interface RankRequirement {
  id: string;
  text: string;
}

export interface Rank {
  id: string;
  name: string;
  level: number;
  description: string;
  requirements: RankRequirement[];
  color: string;
}

export const RANKS: Rank[] = [
  {
    id: "intern",
    name: "Intern",
    level: 1,
    description: "Begin your journey as a Royal Ambassador — learn the foundation of faith and service.",
    requirements: [
      { id: "i1", text: "Learn the Royal Ambassador Promise" },
      { id: "i2", text: "Learn the Royal Ambassador Pledge" },
      { id: "i3", text: "Memorize Joshua 1:9" },
      { id: "i4", text: "Complete Chapter 1: The RA Pledge & Promise" },
      { id: "i5", text: "Attend 4 consecutive RA meetings" },
    ],
    color: "#6B7280",
  },
  {
    id: "page",
    name: "Page",
    level: 2,
    description: "Grow in God's Word and develop a consistent prayer life.",
    requirements: [
      { id: "p1", text: "Complete all Intern rank requirements" },
      { id: "p2", text: "Memorize Philippians 4:13" },
      { id: "p3", text: "Complete Chapter 2: God and His Word" },
      { id: "p4", text: "Complete Chapter 3: Prayer and Devotion" },
      { id: "p5", text: "Share your faith story with a fellow RA" },
      { id: "p6", text: "Complete one community service project" },
    ],
    color: "#3B82F6",
  },
  {
    id: "squire",
    name: "Squire",
    level: 3,
    description: "Demonstrate Christian character in your daily life and relationships.",
    requirements: [
      { id: "sq1", text: "Complete all Page rank requirements" },
      { id: "sq2", text: "Memorize Matthew 28:19-20" },
      { id: "sq3", text: "Complete Chapter 4: Christian Living" },
      { id: "sq4", text: "Lead a devotional at an RA meeting" },
      { id: "sq5", text: "Participate in a mission project" },
      { id: "sq6", text: "Score 80% or higher on the Squire Quiz" },
    ],
    color: "#10B981",
  },
  {
    id: "knight",
    name: "Knight",
    level: 4,
    description: "Take on leadership responsibilities and demonstrate commitment to missions.",
    requirements: [
      { id: "k1", text: "Complete all Squire rank requirements" },
      { id: "k2", text: "Memorize Romans 8:28" },
      { id: "k3", text: "Complete Chapter 5: Church and Missions" },
      { id: "k4", text: "Lead a mission awareness project" },
      { id: "k5", text: "Mentor a younger Royal Ambassador" },
      { id: "k6", text: "Complete a significant community service project" },
    ],
    color: "#8B5CF6",
  },
  {
    id: "ambassador",
    name: "Ambassador",
    level: 5,
    description: "Represent Christ's love and serve as a leader within the Royal Ambassadors.",
    requirements: [
      { id: "a1", text: "Complete all Knight rank requirements" },
      { id: "a2", text: "Memorize Jeremiah 29:11" },
      { id: "a3", text: "Complete Chapter 6: Community and Service" },
      { id: "a4", text: "Organize a church or community mission event" },
      { id: "a5", text: "Complete 50 documented hours of service" },
      { id: "a6", text: "Present a missions report to the congregation" },
    ],
    color: "#EF4444",
  },
  {
    id: "royal-ambassador",
    name: "Royal Ambassador",
    level: 6,
    description: "The highest achievement — a leader fully committed to Christ and global missions.",
    requirements: [
      { id: "ra1", text: "Complete all Ambassador rank requirements" },
      { id: "ra2", text: "Memorize all RA memory verses" },
      { id: "ra3", text: "Complete all six Manual chapters" },
      { id: "ra4", text: "Lead an international mission awareness campaign" },
      { id: "ra5", text: "Complete 100 documented hours of service" },
      { id: "ra6", text: "Be affirmed by pastor and RA leadership council" },
    ],
    color: "#D4A217",
  },
];

export function getCurrentRankIndex(rankId: string): number {
  return RANKS.findIndex((r) => r.id === rankId);
}
