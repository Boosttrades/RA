import { ImageSourcePropType } from "react-native";

export const MANUAL_PAGE_IMAGES: ImageSourcePropType[] = [
  require("@/assets/manual/IMG_1411.jpg"),
  require("@/assets/manual/IMG_1412.jpg"),
  require("@/assets/manual/IMG_1413.jpg"),
  require("@/assets/manual/IMG_1415.jpg"),
  require("@/assets/manual/IMG_1416.jpg"),
  require("@/assets/manual/IMG_1417.jpg"),
  require("@/assets/manual/IMG_1418.jpg"),
  require("@/assets/manual/IMG_1419.jpg"),
  require("@/assets/manual/IMG_1420.jpg"),
  require("@/assets/manual/IMG_1421.jpg"),
  require("@/assets/manual/IMG_1422.jpg"),
  require("@/assets/manual/IMG_1423.jpg"),
  require("@/assets/manual/IMG_1424.jpg"),
  require("@/assets/manual/IMG_1425.jpg"),
  require("@/assets/manual/IMG_1427.jpg"),
  require("@/assets/manual/IMG_1428.jpg"),
  require("@/assets/manual/IMG_1429.jpg"),
  require("@/assets/manual/IMG_1430.jpg"),
  require("@/assets/manual/IMG_1431.jpg"),
  require("@/assets/manual/IMG_1432.jpg"),
  require("@/assets/manual/IMG_1433.jpg"),
  require("@/assets/manual/IMG_1434.jpg"),
  require("@/assets/manual/IMG_1435.jpg"),
  require("@/assets/manual/IMG_1436.jpg"),
  require("@/assets/manual/IMG_1437.jpg"),
  require("@/assets/manual/IMG_1438.jpg"),
  require("@/assets/manual/IMG_1439.jpg"),
  require("@/assets/manual/IMG_1441.jpg"),
  require("@/assets/manual/IMG_1442.jpg"),
  require("@/assets/manual/IMG_1443.jpg"),
  require("@/assets/manual/IMG_1444.jpg"),
  require("@/assets/manual/IMG_1445.jpg"),
  require("@/assets/manual/IMG_1446.jpg"),
  require("@/assets/manual/IMG_1447.jpg"),
  require("@/assets/manual/IMG_1448.jpg"),
  require("@/assets/manual/IMG_1449.jpg"),
  require("@/assets/manual/IMG_1450.jpg"),
  require("@/assets/manual/IMG_1451.jpg"),
  require("@/assets/manual/IMG_1452.jpg"),
  require("@/assets/manual/IMG_1453.jpg"),
  require("@/assets/manual/IMG_1454.jpg"),
  require("@/assets/manual/IMG_1455.jpg"),
  require("@/assets/manual/IMG_1456.jpg"),
  require("@/assets/manual/IMG_1457.jpg"),
  require("@/assets/manual/IMG_1458.jpg"),
  require("@/assets/manual/IMG_1459.jpg"),
];

export interface TocEntry {
  id: string;
  title: string;
  pageIndex: number;
  keywords: string[];
  bookPage: string;
}

export const TABLE_OF_CONTENTS: TocEntry[] = [
  {
    id: "cover",
    title: "Cover Page",
    pageIndex: 1,
    bookPage: "—",
    keywords: ["cover", "royal ambassadors of nigeria", "junior", "intermediate", "senior", "manual"],
  },
  {
    id: "toc",
    title: "Table of Contents",
    pageIndex: 3,
    bookPage: "—",
    keywords: ["contents", "table", "index", "chapters", "list"],
  },
  {
    id: "worth",
    title: "The Worth of a Boy",
    pageIndex: 4,
    bookPage: "iv",
    keywords: ["worth", "boy", "poem", "orvil reid", "southern baptist", "missionary", "mexico", "mine", "diamonds"],
  },
  {
    id: "abbr",
    title: "RA Abbreviations",
    pageIndex: 4,
    bookPage: "v",
    keywords: ["abbreviations", "RA", "RAN", "PF", "NPF", "MRC", "LTC", "MOD", "NC", "NBC", "MMU", "VC", "RANEC", "NEC", "RE", "SBC"],
  },
  {
    id: "preface",
    title: "Preface to the Second Edition",
    pageIndex: 5,
    bookPage: "vi",
    keywords: ["preface", "second edition", "harold wicks", "revised", "wicl", "samson olaniyan", "1977"],
  },
  {
    id: "foreword",
    title: "Foreword",
    pageIndex: 6,
    bookPage: "vii",
    keywords: ["foreword", "introduction", "director", "men missionary union", "youth"],
  },
  {
    id: "ack",
    title: "Acknowledgement",
    pageIndex: 8,
    bookPage: "x",
    keywords: ["acknowledgement", "duro ayanrinola", "missionary organizations", "simon olatunji", "dawari george"],
  },
  {
    id: "order",
    title: "The Order of Royal Ambassadors",
    pageIndex: 9,
    bookPage: "1",
    keywords: ["order", "what is it", "history", "baptist", "worldwide", "international", "1908", "ranec", "nec", "ra marshal", "africa", "asia", "australia", "boys ages 10 to 24"],
  },
  {
    id: "vision",
    title: "Vision, Goals & Cardinal Objectives",
    pageIndex: 10,
    bookPage: "3",
    keywords: ["vision", "goals", "cardinal objectives", "mission", "purpose", "ran", "discipleship", "ministry plan"],
  },
  {
    id: "pledge",
    title: "The RA Pledge",
    pageIndex: 11,
    bookPage: "4",
    keywords: ["pledge", "promise", "ephesians 4:1", "walk worthy", "vocation", "called"],
  },
  {
    id: "motto",
    title: "The RA Motto",
    pageIndex: 11,
    bookPage: "4",
    keywords: ["motto", "ambassadors for christ", "2 corinthians 5:20", "share the light"],
  },
  {
    id: "hymn",
    title: "The RA Hymn — The King's Business",
    pageIndex: 12,
    bookPage: "5",
    keywords: ["hymn", "kings business", "song", "music", "sing", "lyrics"],
  },
  {
    id: "commission",
    title: "Commission and Declarations",
    pageIndex: 12,
    bookPage: "6",
    keywords: ["commission", "declaration", "great commission", "matthew 28", "declaration of faith"],
  },
  {
    id: "emblem",
    title: "The RA Emblem",
    pageIndex: 13,
    bookPage: "7",
    keywords: ["emblem", "shield", "torch", "wheel", "crown", "soldier", "ephesians 6:16", "faith", "blue circle", "gold edge", "junior intermediate senior symbol"],
  },
  {
    id: "colors",
    title: "The RA Colors",
    pageIndex: 13,
    bookPage: "8",
    keywords: ["colors", "colours", "blue", "gold", "white", "loyalty", "purity", "worth", "christ the king", "lord master"],
  },
  {
    id: "chapter-org",
    title: "The Royal Ambassador Chapter",
    pageIndex: 14,
    bookPage: "8",
    keywords: ["chapter", "organization", "officers", "president", "vice president", "secretary", "treasurer", "provost", "missions officer", "publicity officer", "song leader", "counsellor", "25 boys", "registration"],
  },
  {
    id: "committees",
    title: "Committees",
    pageIndex: 15,
    bookPage: "10",
    keywords: ["committees", "leadership", "structure", "executive", "welfare", "evangelism", "missions committee"],
  },
  {
    id: "ranks",
    title: "The Royal Ambassadors Ranks",
    pageIndex: 17,
    bookPage: "15",
    keywords: ["ranks", "ranking system", "candidate", "prospect", "intern", "assistant intern", "apprentice", "journeyman", "craftsman", "ambassador", "royal ambassador", "dean", "age groups", "10 years", "12 years", "13 years", "16 years", "17 years", "19 years", "requirements", "sunday school", "memory verse", "certification"],
  },
  {
    id: "induction",
    title: "Induction of New Members",
    pageIndex: 24,
    bookPage: "28",
    keywords: ["induction", "new members", "ceremony", "initiation", "joining", "candidate", "counsellor", "pledge", "bible", "installation", "recognition service"],
  },
  {
    id: "uniforms",
    title: "RA Uniforms",
    pageIndex: 27,
    bookPage: "32",
    keywords: ["uniform", "uniforms", "dress", "clothing", "attire", "cap", "shirt", "trousers", "badge", "scarf", "junior senior intermediate"],
  },
  {
    id: "programmes",
    title: "Special Programme Suggestions for RA Activities",
    pageIndex: 30,
    bookPage: "38",
    keywords: ["programme", "program", "activities", "suggestions", "special", "crafts", "sports", "recreation", "camping", "community service", "first aid"],
  },
  {
    id: "meeting",
    title: "Chapter Meeting",
    pageIndex: 33,
    bookPage: "43",
    keywords: ["meeting", "chapter meeting", "agenda", "proceeding", "president", "recorder", "gavel", "hymn", "roll call", "minutes", "discussion", "aob", "any other business"],
  },
  {
    id: "evaluating",
    title: "Evaluating a Chapter Meeting",
    pageIndex: 35,
    bookPage: "46",
    keywords: ["evaluating", "evaluation", "assessment", "chapter meeting quality", "review", "score"],
  },
  {
    id: "other-prog",
    title: "Other Suggested Programmes for All Levels",
    pageIndex: 36,
    bookPage: "47",
    keywords: ["other programmes", "all levels", "junior", "intermediate", "senior", "discipleship", "bible study", "prayer", "service project"],
  },
  {
    id: "sponsoring",
    title: "Royal Ambassadors Sponsoring Organization",
    pageIndex: 39,
    bookPage: "56",
    keywords: ["sponsoring", "organization", "church", "baptist", "men missionary union", "mmu", "support", "local church"],
  },
  {
    id: "counselor",
    title: "The Counselor's Corner",
    pageIndex: 40,
    bookPage: "58",
    keywords: ["counselor", "counsellor", "corner", "know each boy", "family", "volunteer", "mentor", "guidance", "boy's family", "friend", "address", "school"],
  },
  {
    id: "books",
    title: "Suggested Books for RA Leaders and Members",
    pageIndex: 43,
    bookPage: "63",
    keywords: ["books", "reading", "leaders", "members", "bibliography", "suggested reading", "resources", "references"],
  },
];

export function searchToc(query: string): TocEntry[] {
  if (!query.trim()) return TABLE_OF_CONTENTS;
  const lower = query.toLowerCase();
  return TABLE_OF_CONTENTS.filter(
    (entry) =>
      entry.title.toLowerCase().includes(lower) ||
      entry.keywords.some((kw) => kw.toLowerCase().includes(lower))
  );
}
