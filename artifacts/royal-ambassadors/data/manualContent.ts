export interface ManualSection {
  id: string;
  title: string;
  group: "front" | "main";
  content: string;
}

export interface SearchResult {
  section: ManualSection;
  snippet: string;
  matchIndex: number;
}

export const MANUAL_SECTIONS: ManualSection[] = [
  {
    id: "title",
    title: "Title Page",
    group: "front",
    content: `ROYAL AMBASSADORS OF NIGERIA

MANUAL
Revised Edition

"We are ambassadors for Christ"
2 Corinthians 5:20

Prepared by
HAROLD D. WICKSS`,
  },
  {
    id: "copyright",
    title: "Copyright",
    group: "front",
    content: `2006, Publishing Board, Nigerian Baptist Convention

ISBN 978-053130-0

All Rights Reserved. No part of this publication without the prior written permission of the publisher, is allowed. All applicable national and international Laws protect all articles herein.

Produced by
Royal Ambassadors Unit,
Missionary Organizations Department
Nigerian Baptist Convention
P. M. B. 5113, Ibadan

www.royalambassadorsofnigerianbc.org
www.nigerianbaptist.org/ra

Published by
Publications Department
Nigerian Baptist Convention, Ibadan

Printed by
Baptist Press (Nig.) Limited
P. M. B. 5071, Ibadan 12697-10-06-5000`,
  },
  {
    id: "preface",
    title: "Preface to the Second Edition",
    group: "front",
    content: `PREFACE TO THE SECOND EDITION

The Lord greatly used the Rev. Dr. Harold D. Wicl — former missionary to Nigeria — to make the Royal Ambassadors of Nigeria what it is today. It was he who helped many seminary students in the seventies to develop more interest in leading Royal Ambassadors in churches. The writer is one of many young people who developed interest in the work.

It was during Rev. Dr. Wicks' chairmanship of the Central Committee for Men and Boys' Work (now Men's Missionary Union) that the department was formally established by the Convention.

Dr. Wicks carefully prepared the material in this manual for the use of Royal Ambassadors. This manual has been reprinted many times, especially since the Men's Missionary Union Department was formally established in 1977.

Because the manual has been in use for some time it has become necessary to make some amendments, based on suggestions from both the Royal Ambassadors themselves and their counsellors, who have been using the manual. We are grateful to Dr. Wicks for allowing the additions and amendments.

Rev. Dr. Samson O. Olaniyan
Director,
Men's Missionary Union and Youth Department
Nigerian Baptist Convention
1991`,
  },
  {
    id: "foreword",
    title: "Foreword",
    group: "front",
    content: `FOREWORD

I am convinced that so many things, affected by the world's fast and hectic pace, are fast losing their meaning and values today. Human plans, targets and programmes are giving way to the need for change (for the better), not wanting to risk the danger of becoming obsolete and left behind. In the same way, we in the leadership team of Royal Ambassadors have seen the need for a pressing, timely, inclusively contemporary and more indigenous manual for this fast growing Royal Ambassadors of Nigeria.

The word manual is derived from a medieval root that connotes the idea of "control" or "order." Oxford Advanced Learners' Dictionary defines it as a book containing information or practical instructions on a given subject. This definition is true of the RA manual. Men, boys, Counselors and all denominational leaders look into the manual as a pilot does his map.

One of the major changes that this review will feature is the re-wording of the international founding goal of RA worldwide (the RA pledge). Another major change is the ranking system and structure. Some of the western perspectives that needed contemporarization and indigenization were also brought under review.

Many Nigerian Baptist leaders including the Missionary Organizations Department's Director, Rev. Dr. Duro Ayanrinola and the General Secretary, Rev. Dr. S. Ademola Ishola also found it auspicious to have the manual reviewed.

While it may be said that the potentiality and prospects of a boy are perhaps the most undervalued force on earth today, I am most grateful to God for the "Barnabas" spirit we have found in the life of our leader and father, Rev. Dr. Ademola Ishola, who believes that the boys are the generation of future leaders, and have encouraged us accordingly.

Therefore, I thank God for these daring few who understand the time and are joining God wherever He is at work — people who played unqualified and unparallel roles both toward this work and the development of the ministries of Royal Ambassadors of Nigeria thus far.

Worthy of appreciation is the efforts of all the members, past, present and prospective of Royal Ambassadors of Nigeria; the currently serving NEC members and the Manual Review Committee (MRC) who burnt their candles at both ends in order to compile existing work with the God-given perspectives of the Marshal, Dawari Etela George, the national secretary, Festus Akinola and my humble self to actualize this epoch making achievement.

Therefore, while present this manual for the use of Royal Ambassadors members and prospects in churches of Nigeria and West Africa, I ask the Lord to bless you all and I return all the glory to Him by saying soli deo gloriam, "to God alone be all the glory."

Simon O. Olatunji
NBC, RA Unit Head
June 2006`,
  },
  {
    id: "acknowledgement",
    title: "Acknowledgement",
    group: "front",
    content: `ACKNOWLEDGEMENT

Upon turning the pages of a book, I want to know two things immediately: First, what is the book all about? Second, how can I get the best from it? This book, Royal Ambassadors Manual provides you with all you need to know about Royal Ambassadors, Nigerian Baptist Convention. Being Comprehensive enough, it contains the history, the cardinal objectives, mission, vision and philosophy, strategies of promotion, fundamental principles and structures of Royal Ambassadors.

If you are a curious person who wants to know what the RA is all about and what they are doing, read this book. If you want to serve the Lord as a volunteer worker, mentor and counsellor and you do not know how best to plug in, read this book. It is a book that will properly orientate you on all ministry opportunities and challenges of volunteer helper or mentor of the younger generation.

You can read this book in either of two ways:

1. You can read it from cover to cover; following it page by page and gain tremendous knowledge of Royal Ambassadors of Nigeria.

2. You can also read it as a problem-solving tool when poised to know about a particular thing about this boys' organization, you can locate the related portion through its explicit content page.

Sincere and deep appreciation is expressed to Rev. Simon Olatunji, Counsellor Dawari George and others who laboured hard with them to constitute the committee on this revision.

It is my prayer that this revised edition of the Royal Ambassadors Manual will further enhance the good work the Lord has started to do in the area of missions' advancement and spiritual awakening in our RA Unit.

Rev. Dr. Duro Ayanrinola
Director, Missionary Organizations Department
Nigerian Baptist Convention Ibadan`,
  },
  {
    id: "worth",
    title: "The Worth of a Boy",
    group: "main",
    content: `THE WORTH OF A BOY

What would you say is the worth of a boy:
In sin and sorrow, in service and joy?

So much good or bad wrapped up in each life
To build up and serve or tear down in strife.
A mine of diamonds, a bomb to destroy?
Depends entirely on who gets the boy?

The devil, the world, and flesh make their bid:
But what will your church do to win this "kid?"

Some men have hobbies in which they invest
Much time and money with real zeal and zest.
But those who fathom life's great thrills and joys
Major on making real men out of boys.

— ORVIL W. REID,
Southern Baptist Missionary to Mexico`,
  },
  {
    id: "abbreviations",
    title: "RA Abbreviations",
    group: "main",
    content: `RA ABBREVIATIONS

RA       — Royal Ambassador
Ras      — Royal Ambassadors
RAN      — Royal Ambassadors of Nigeria
PF       — Patrons' Forum
NPF      — National Patrons' Forum
MRC      — Manual Review Committee
LT       — Leadership Training
LTC      — Leadership Training Conference
MOD      — Missionary Organizations Department
NC       — Nominating Committee
NBC      — Nigerian Baptist Convention
MMU      — Men's Missionary Union
VC       — Volunteer Counsellor
RANEC    — Royal Ambassadors National Executive Committee
NEC      — National Executive Council
RE       — Revised Edition
SBC      — Southern Baptist Convention`,
  },
  {
    id: "order",
    title: "The Order of Royal Ambassadors",
    group: "main",
    content: `THE ORDER OF ROYAL AMBASSADORS

WHAT IS IT?

Royal Ambassadors is the name of a Baptist worldwide missionary organization for boys between the ages of 10 and 24 — an international organization found in many countries of the world, wherever there are Baptists. It is found on the continents of Africa, Asia, Australia, Europe, North America, and South America. The organization in Nigeria is called Royal Ambassadors of Nigeria (RAN).

In its mission education and ministry plan, RAN has a foundational Christian education plans for Junior RA, boys between the ages 10 and 12; basic discipleship plans for Intermediate RA, boys from age 13 to 16 (or Secondary School age); and solid mission education and action plans for Senior RA, who are boys within ages 17 and 24.

The vision and work of Royal Ambassadors started in the United States of America in 1908 among the Brotherhood Commission of the Southern Baptist Convention, USA; and came to Nigeria as one of the world's leading organizations for boys through the SBC missionaries in the 1920s.

The Women's Missionary Union sponsored the organization from the beginning until 1954 when it was proposed that the men of the Nigerian Baptist Convention should take over the boy's work. The situation that led to the proposal of Men and Boys' Department in 1961 which served both men and boys, then later became the defunct Men's Missionary Union & Youths Department, now known as Missionary Organizations Department since 1998.

Royal Ambassadors National Executive Committee (RANEC) comprises of all elected national officers of the organization only; while the National Executive Council (NEC) includes all Conference RA Directors. The RA Marshal is the presiding officer in all meetings (of executives or general sessions). But the council cooperates with the MMU NEC through an advisory representative designated RA Council Adviser; and operates from the MU Office, Baptist Building, Ibadan through a denominational/administrative head of the unit.

To the glory of God, RAN now exists in all Baptist associations, conferences and the Convention, and is spreading its missions' advancement tentacles to the West African sub-regions.`,
  },
  {
    id: "vision",
    title: "Vision, Goals & Cardinal Objectives",
    group: "main",
    content: `VISION, GOALS & CARDINAL OBJECTIVES OF ROYAL AMBASSADORS

Our Vision
Touching the lives of boys... impacting the eternity of men!

Our Founding Goals
• To become well informed, responsible follower of Christ.
• To have Christ-like concern for all people.
• To carry the message of Christ around the world.
• To work with others in sharing Christ.
• To keep myself clean and healthy in mind and body.

Our Cardinal Objectives
• Helping boys in personal spiritual development and discipleship.
• Equipping members for mission action.
• Ensuring educational and career development of boys.
• Promoting social awareness, responsibility and responsiveness.
• Promoting personal and corporate discipline and cohesion.
• Promoting personal commitment demonstrated in stewardship of life, churchmanship and denominational interest, and understanding as well as appreciation of Baptist beliefs and practices.
• Enabling members' personality, potentiality, and dignity development.

Our Philosophy
The foundation, vision and ministries of RAN are responses to the Lord's command to make disciples of ALL nations. Our philosophy of ministry to boys is because it is easy to catch them young. One of the earliest mottos of the organization is: "It is easy to mould boys than to mend men." Besides, today's boys are the men of tomorrow, who will be saddled with the social and spiritual responsibilities of leading humanity and influencing decisions in families, societal, global and spiritual spheres of life. They must not be left to wrong hands.`,
  },
  {
    id: "pledge",
    title: "The RA Pledge, Motto and Hymn",
    group: "main",
    content: `THE ROYAL AMBASSADOR PLEDGE, MOTTO AND HYMN

THE PLEDGE

As a Royal Ambassador I will do my best:
To become a well-informed, responsible follower of Christ;
To have a Christ-like concern for all people;
To carry the message of Christ around the world;
To work with others in sharing Christ; and
To keep myself clean and healthy in mind and body.

THE MOTTO

The Royal Ambassador motto is found in 2 Corinthians 5:20:
"We are ambassadors for Christ."

THE HYMN — "THE KING'S BUSINESS"

Verse 1
I am a stranger here, within a foreign land,
My home is far away, upon a golden strand,
Ambassador to be of realms beyond the sea,
I'm here on business for my King.

CHORUS
This is the message that I bring,
A message angels fain would sing:
"Oh, be ye reconciled," thus saith my Lord and King,
"Oh, be ye reconciled to God."

Verse 2
This is the King's command that all men everywhere,
Repent and turn away from sin's seductive snare;
That all who will obey, with him shall reign for aye,
And that's my business for my King.

Verse 3
My home is brighter far than Sharon's rosy plain,
Eternal life and joy throughout its vast domain;
My Sovereign bids me tell how mortals there may dwell,
And that's my business for my King.

— E.T. Cassel`,
  },
  {
    id: "commission",
    title: "Commission and Declarations",
    group: "main",
    content: `COMMISSION AND DECLARATIONS

President: Who is an ambassador?
Boys: An ambassador is one who represents a king at the court of another king.

President: As an ambassador who do you represent?
Boys: "We are ambassador for Christ," (2 Corinthians 5:20).

President: What is the motive of your service?
Boys: "The love of Christ compels us" (2 Corinthians 5:14).

President: What is the eternal message of your services?
Boys: "We pray you in Christ's name, be reconciled to God" (2 Corinthians 5:20).

President: What is the King's Command?
Boys: "Therefore go and make disciples of all nations, baptizing them in the Name of the Father and of the Son and of the Holy Spirit, teaching them to obey everything I have commanded you. And surely, I am with you always, to the very end of the age" (Matthew 28:19-20).`,
  },
  {
    id: "emblem",
    title: "The Royal Ambassador Emblem",
    group: "main",
    content: `THE ROYAL AMBASSADOR EMBLEM

The Royal Ambassador Emblem is a blue shield on a background of a white circle. It has a gold edge around the circle. The shield represents a soldier. In Ephesians 6:16, the Christian is instructed to "take the shield of faith." The shield reminds the youth to have faith in God whom he will represent as an ambassador.

The shield is divided into three parts: a torch, a wheel, and a crown.

THE TORCH
The torch is the symbol for Junior Royal Ambassadors. It represents light and the spreading of the gospel.

THE WHEEL
The wheel represents the Intermediate Royal Ambassadors. It is the symbol of the rank of Apprentice. It represents the boy as a learner of trade (of becoming Ambassadors for Christ). It (the wheel) is a sign of movement and progress. It reminds the boy to progressively pattern his life after the Carpenter Boy from Nazareth and to qualify as His representative. The Intermediate boy is trained to know that there is no higher work than that of becoming an Ambassador for Christ.

THE CROWN
The crown is the symbol for the Senior Royal Ambassadors. A crown represents a king. This crown represents Christ who is the King of kings and Lord of lords. It signifies that the Senior Royal Ambassador has reached an age, and acquired certain knowledge, that qualifies him to serve as an effective Ambassador for Christ, the King. The Senior Royal Ambassador will want to discharge his duty being loyal and faithful to the King.`,
  },
  {
    id: "colours",
    title: "The Royal Ambassador Colours",
    group: "main",
    content: `THE ROYAL AMBASSADOR COLOURS

The Royal Ambassador colors are blue, gold and white.

THE BLUE stands for loyalty:
• Loyalty to Christ the King.
• Loyalty to the Church and her mission.
• Loyalty to the Royal Ambassadors organization and its beliefs.

THE GOLD stands for value or worth:
• The worth of Christ to the boy as Lord and Master; and
• The worth of the boy to Christ as His ambassador.

THE WHITE stands for purity:
• Purity of body
• Purity of mind
• Purity of soul in the worship of one God and Him alone.`,
  },
  {
    id: "chapter",
    title: "The Royal Ambassador Chapter",
    group: "main",
    content: `THE ROYAL AMBASSADOR CHAPTER

The Royal Ambassador group in a church is called a chapter. A chapter may have up to 25 boys in its membership. If there are 26 or more boys in the Chapter more counsellors can be enlisted and two chapters formed.

Each Chapter should be properly organized. This means giving the chapter name and electing the necessary officers. The chapter will use the RA pledge, motto, hymn, commission and declaration and some rules. After the chapter is organized, it should be registered with RAN, Baptist Building, Ibadan, through the conference in which the church is located.

CHAPTER OFFICERS

The officers in a Royal Ambassador Chapter are:
• President
• Vice President
• Secretary
• Assistant Secretary
• Financial Secretary
• Treasurer
• Provost
• Missions Officer
• Special Duties Officer
• Publicity Officer
• Song Leader
• Counsellor

NOTE: It could be less or more as may be the need.

ELECTION OF OFFICERS

The officers should be elected and trained for their work before they begin to serve. The Counsellors will be elected through the MMU of the Church upon the recommendation of Royal Ambassadors. It is the duty of Counsellors to train the chapter officers. The RA chapter officers begin their work at the start of the church year.

The officers may serve for a one-year period. It is suggested that new officers be elected in order to let more of the boys serve in places of leadership.

COMMITTEES

A chapter may make use of committees to execute some of its work. Some of the suggested chapter committees are: nominating, programme, enlistment, recreation and sports, service projects and ranking. A committee may be composed of a chairman and at least two members.

DUTIES OF THE COMMITTEES

• The Nominating Committee may be responsible for election of members for the various offices or other committees of the chapter.

• The Programme Committee will use the Christ Ambassadors (Life & Work Series) yearbook to plan the programmes for the chapter meetings. The chapter vice president may serve as the chairman.

• The Enlistment Committee is responsible for enlisting new members into Royal Ambassador work. This committee is in charge of visitation, recruitment and induction ceremonies.

• The Recreation and Sports Committee will plan and direct the recreation and sports of the chapter. They will plan recreational and athletic events for chapter meetings and special occasions.

• The Service Projects Committee will plan and promote various kinds of service projects for the chapter. They will be responsible for encouraging the members to give themselves in useful service to others.

• The Ranking Committee will organize and encourage members to work on ranking promotion exercises as well as execute all programmes involving ranks, ethics and promotion services.

MEMBERSHIP

Any boy in a local Baptist church and their prospects between ages 10 and 12 is an eligible candidate into the Junior Royal Ambassadors; while those between the ages of 13 and 16 may be enrolled into Intermediate Royal Ambassadors.

While it is advisable to join the work of Royal Ambassadors in the earlier years; there is also the opportunity for young men between the ages 17 and 24 to be eligible candidates into Senior Royal Ambassadors.

MEETINGS

The chapter meetings should be held once a week, if possible. Where this is not possible, the meetings may take place twice a month. They should be held at a time when the largest number can attend.

FINANCES

All members shall be encouraged to give to the church. Members should be taught to tithe and give to the special offerings as well, apart from free will contributions/donations at chapter meetings.

CHAPTER NAME

A good name should be selected for the Royal Ambassador chapter. The chapter could be named after an outstanding Christian — a pastor, a missionary, or a member of the church.

REGISTRATION

As soon as the chapter is organized, it should be registered with the association, conference and the Convention RA after which a charter or a certificate of registration will be sent from the Convention to the chapter to keep. Without this certificate and registration number, the chapter is not officially recognized.`,
  },
  {
    id: "ranks",
    title: "The Royal Ambassadors Ranking System",
    group: "main",
    content: `THE ROYAL AMBASSADORS RANKING SYSTEM

Before any prospect can become a member of a Royal Ambassador chapter, he must first complete the requirements of a candidate for his age group. Upon being accepted as a member of Royal Ambassadors, he will learn to become a good ambassador for Christ. He will do this by learning certain things about God, about the Bible and about people. The boy will also be encouraged to put into practice that which he learns.

The counsellor should keep a careful record of the progress of each member. He will sign his initials on the line in the manual after the boy has completed each requirement. Upon the completion of a rank, the boy is entitled to take part in a recognition service in the church to honour members who have completed requirement for a rank in the year.

THE ROYAL AMBASSADORS RANKS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. THE CANDIDATE (Otherwise called Prospect)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
(A boy must complete this rank before becoming a member.)
• Attend four chapter meetings.
• Learn and say the Royal Ambassador motto, pledge, hymn, and commission and declaration.
• Learn and explain the Royal Ambassador colors and emblem for the Royal Ambassadors.
• Start and complete basic discipleship Course.
• Be accepted into the chapter by majority vote.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. ASSISTANT INTERN (for 10 years old boys)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A. Attend Sunday School lessons for at least 6 months in the year, and must write out and submit the topics and memory verses of the studies.
B. Attend Church Training and/or House Fellowship for at least 30 Sundays the year of study. House fellowship leader and church pastor will sign certification.
C. Attend RA weekly meetings for at least 40 meetings a year. Chapter secretary and president are to sign certification.
D. Learn, say or sing the following:
   i) RA Motto
   ii) RA Pledge
   iii) Stanza 1 of the RA hymn
E. Share with chapter what it means to be "A Royal Ambassador."
F. Tell the life history of Jesus from His birth to age 12 as found in Luke 12.
G. Tell the story of the Lost Sheep as found in Luke 15:3-9. Explain what the story means.
H. Learn and say the following:
   i) First three of the Ten Commandments
   ii) First six books of the Bible
I. Invite a friend to Sunday School, House Fellowship or RA meeting with you.
J. Do the following community service projects:
   i) Visit 2 elderly people in your church and do some work they need done for them, receiving nothing in return — except for their prayers.
   ii) Do services for your pastor (e.g. wash his car, cut grass in his compound, wash or sweep his house etc.)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. INTERN (for 11 years old boys)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A. Attend, write out and submit topic and memory verses of Sunday School lessons for at least 6 months in the year of study.
B. Attend Church Training and/or House Fellowship for at least 30 Sundays in the Year of study. The House fellowship leader and church pastor will sign certification.
C. Attend RA weekly meeting for at least 40 meetings a year. Chapter secretary and president will sign certification.
D. Learn and say the following:
   i) RA motto
   ii) First two stanzas of RA hymn
E. Tell the life history of Jesus from His birth to age 12 as found in Luke 12.
F. Tell the story of the Lost Sheep as found in Luke 15:3-9. Explain what the story means.
G. Learn and say the following:
   i) First three of the Ten Commandments
   ii) First six books of the Bible
H. Share the following with the Chapter:
   i) What you want to become in the future with emphasis on what you need to do to achieve/develop the career.
   ii) On a Community service project that you did without any gratification/pay.
J. Write and submit or share the following with the Chapter:
   i) My experience the first day I ever shared Christ with someone.
   ii) The sport/game I love most.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. SENIOR INTERN (for 12 years old boys)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A. Attend, write out and submit topic and memory verses of Sunday School lessons for at least 6 months in the year of study.
B. Attend Church Training and/or House Fellowship for at least 30 Sundays in the year of study. House fellowship leader and church pastor will sign certification.
C. Attend RA weekly meeting for at least 40 meetings a year. Chapter secretary and president will sign certification.
D. Learn, explain or sing the following:
   i) The RA colours
   ii) Three stanzas of RA hymn
   iii) The Commission and Declaration
   iv) The RA emblem
E. Tell the story of the Good Samaritan as found in Luke 10:29-37. Discuss the importance of First Aid.
F. During the period of study, do the "Basic Discipleship Lessons" course (if you have not done it) and get certification from your pastor.
G. Explain the 7 cardinal objectives of the RA of Nigeria.
H. Write and share with the chapter on "My Salvation Testimony."
I. Do any two of the following:
   i) A community service project for your church, neighbourhood or school.
   ii) Study 5 vocations in Nigeria and what it takes to achieve them.
   iii) Describe a sport you love and discuss current events in that sport.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. ENVOY (for 13 years old boys)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A. What does it mean to be born again? Discuss with reference to John 3:1-19.
B. Do a character study on any 3 of the following:
   i) Paul  ii) David  iii) Abraham  iv) Joseph  v) Elisha
C. Participate in a sword drill contest at the chapter, association, conference or national level and produce a letter confirming your participation.
D. Study the book of Romans and discuss the highlights.
E. Meet the following basic requirements:
   i) Attend Sunday School for at least 6 months in the year of study.
   ii) Attend Church Training or House Fellowship for at least 30 Sundays and produce certification.
   iii) Attend RA weekly meeting for at least 40 meetings a year.
   iv) Learn the order of Royal Ambassadors.
F. Learn the departments of the Nigerian Baptist Convention (See current NBC Diary for details).
G. Do the Follow the Master discipleship course.
H. Visit a compassion or remand home, old peoples home or orphanage etc., share the gospel and gift as you're led.
I. Learn a thing or two about computer and share how computer literacy can further the gospel.
J. "For all have sinned and fallen short of the glory of God." Use this as a first statement in a witnessing training rehearsal at a chapter meeting.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6. SPECIAL ENVOY (for 14 years old boys)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A. Do a study on how God can use individual RA members and entire organization to serve Him (see John 6:5-13).
B. What does 1 Corinthians 13 mean to you? Do a write-up.
C. Write or discuss a major Bible character in the Bible and show what RAs can learn from the character of that person.
D. Use the following verses to tell someone who is not a Christian how he/she can be saved (Romans 3:10, 23; 6:23; 1 John 1:9; Acts 1:8).
E. Meet the following basic requirements:
   i) Attend Sunday School for at least 6 months in the year of study.
   ii) Attend Church Training/House Fellowship for at least 80 Sundays, produce certification from fellowship leader.
   iii) Attend at least 40 RA meetings in a year.
F. Do the Serve the Master discipleship course.
G. Write out your salvation testimony to demonstrate how you know you are saved.
H. Discuss one major national event and its implications for missions.
I. Organize a mini competition among members of your chapter (e.g. scrabble, table tennis etc.).
J. Know the names of principal officers of the Convention (See Convention current diary for details).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
7. SENIOR ENVOY (for 15 years old boys)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A. Tell or write the story of Jesus' transfiguration. What did Jesus talk about with Moses and Elijah (Matthew 17:1-13; Mark 9:2-13; Luke 9:28-36)?
B. Memorize and explain the meaning of Psalm 1.
C. Write a brief biography of a Baptist missionary living or dead in or outside Nigeria.
D. Do the Master Life discipleship course in the year of study.
E. Attend the annual National Leadership Training at Ede in the year of study.
F. Do a summary of Paul's first missionary journey.
G. Meet the following basic requirements:
   i) Attend Sunday School for at least 6 months in the year of study.
   ii) Attend Church Training (House Fellowship) for at least 30 Sundays, produce certification from fellowship leaders.
   iii) Attend at least 40 RA meetings in a year.
   iv) Know the origin/history of the RA of Nigeria.
H. As a community service project, do a study and lead a group of volunteer RAs to contribute to fighting social vices.
I. Do a rundown of major sporting events that will hold in the year of study.
J. Know the names of principal officers of the RA of Nigeria.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
8. DEAN (for 16 years old boys)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A. With reference to the story of the rich young man and Jesus as found in Matthew 19:16-26 and Mark 10:17-28, discuss "stewardship of possession."
B. Memorize and list out the Beatitudes as found in Matthew 5:1-12. Explain them. How can one be saved? Discuss.
D. Explain basic computer application methods and teach the chapter.
E. Make a list of 20 countries where Baptist work is found and an interesting Baptist programme in one of them. (Visit the Baptist World Alliance Website.)
F. Research current events in the Global Missions Board of the Nigerian Baptist Convention and share how RAs can fit into them.
G. Do a summary of Paul's 2nd missionary journey.
H. Meet the following basic requirements:
   i) Attend Sunday School for at least 6 months in the year of study.
   ii) Attend Church Training and/or House Fellowship for at least 30 Sundays, and produce the evidence.
   iii) Attend at least 40 RA meetings in a year.
   iv) Know the origin/history of the RA of Nigeria.
I. Visit a prison or remand home or home for the elderly or motherless babies home and share the gospel, pray and give any gift as you are led.
J. Do the Experiencing God discipleship lesson during the period/year of study.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
9. AMBASSADOR (for boys between 17 and 19 years)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A. Discuss two ordinances of the Baptist church, using the story of Jesus' baptism and the Lord's Supper as a background.
B. Using the story of the talents as found in Matthew 25:14-30, discuss how the diverse talents of RAs can be used to serve God.
C. Draw a map of Nigeria and locate the Home Mission Fields in them (see the mission week of emphasis booklets).
D. Is it possible for Christians to contribute to national developments? How? Write or Discuss.
E. Serve as a Sunday School teacher, House Fellowship leader or participate in planting a new church.
F. Discuss the 7 cardinal objectives of the RA of Nigeria.
G. Meet the following basic requirements:
   i) Train junior RA to pass his rank this year.
   ii) Attend Sunday School lessons and chapter meetings as stated in the rank of Dean.
   iii) Do any work to help someone in which you will receive no pay.
   iv) Meet with others working on the same rank on the possibility of starting or strengthening a new RA Chapter.
H. Make a careful study of the danger of the use of alcohol and tobacco on human body. Share it or send it to the anti Social-vices Club of your association, conference and the Convention.
I. Discuss two major international events that occurred in the world during the period of study.
J. Write to the Social Ministries Division of the Convention requesting for information on areas of need. Mobilize your chapter to pray and assist in that regard.
K. VERY IMPORTANT: At this point, it is expected that you are a baptized believer, or else there will be no promotion. Submit evidence of your baptism into the church.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
10. AMBASSADOR EXTRA ORDINARY (for 20–22 years old boys)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A. Discuss 5 miracles of Jesus and draw a lesson of faith from them.
B. Do a study and explain practical witnessing. (See Witness Training Course.)
C. Give a brief outline of Baptist beliefs about the Bible, salvation, baptism, the Lord's Supper and missions. (See the Enquirers handbook.)
D. Write a short history of your church, association or conference.
E. Be acquainted with the basics of Information and Communication Technology (ICT). Share your knowledge with Junior RAs in your chapter.
F. Help start either a new church or a new Royal Ambassador chapter in a church.
G. Visit a mission field in Nigeria and write a report of your visit.
H. To demonstrate your purpose in life, write on "What God is calling me to do in this life."
I. What is the Federation of International Football Association (FIFA) all about? What are its major competitions (see FIFA Website)?
J. Organise a community service project for boys in your chapter and lead them in carrying it out with the cooperation of your chapter leaders.
K. All conditions on attendance and basic knowledge of RA are a pre-requisite.
L. Communicate with RAs or an RA chapter outside Nigeria by email. (Attach computer printout.)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
11. AMBASSADOR PLENIPOTENTIARY (for 23 and 24 years old boys)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A. Write a biography of the person after whom your chapter is named. Read it in a chapter meeting and include it in your project booklet.
B. Make a chart of maps showing Paul's missionary journeys. Present a report on it to your chapter and include it in your project booklet.
C. Read two books about missions and write a summary review on each in your project booklet.
D. Using the Internet, keep up correspondences with RA chapters from three other countries and include evidence of your exchanged correspondence in the project booklet.
E. Interview a Home or Foreign missionary either personally or by correspondence, and use your findings to develop a mission plan for the RAs of Nigeria in your conference or association or chapter.
F. Help to start a Sunday School class, preaching station, House Fellowship or serve in a place of leadership in the Sunday School, Church Training or assist the Counsellor in your chapter for at least a year.
G. Train an intermediate RA to pass his rank.
H. Produce a handcraft work and explain its relevance to our ministry of reconciliation. (The craft must be submitted with the project booklet.)
I. Attend the leadership training for that year to defend your project.
J. Write a drama on missions.
K. Describe the current state of the country in writing. Include your suggestions and expected reforms in the write-up; or preach hope to a hopeless Nigerian.

NOTE: All members of the RA beyond the age 24 may enroll in the Baptist Men's Fellowship where the experience of their Royal Ambassadors years and their continued interest/voluntary services become harnessed to further the work of missions. Only people who have gone through the RA up to this stage/age are allowed to serve in the volunteer capacity of a counselor.`,
  },
  {
    id: "induction",
    title: "Induction of New Members",
    group: "main",
    content: `INDUCTION OF NEW MEMBERS

COMMENCEMENT: Candidate is blindfolded, right shoe and coat removed and left sleeve rolled up slightly.

No. 2: Leads candidate by left arm to door and knocks twice, sharply.
No. 1: Knocks once from within.
No. 2: Opens door and shouts "Who comes here?" and raps candidate on left shoulders.
No. 1: Mr. (candidate's name), a weary traveller along life's highway, seeking entrance and companionship along his journey up the straight and narrow path.
No. 2: Mr. (candidate's name), is it of your free will and desire that you be allowed to enter into our midst?
No. 1: (Responds along with the candidate) Yes, it is.
No. 2: Have you the key with which to enter in?
No. 1: He has it not, but I give it for him (steps forward and clasps No. 2's hand and says in a low voice), "Share the light of the world."
No. 2: Wait until I return; I shall inform our counsellor (if Junior, or President if Intermediate) of your wish. (He walks briskly to the front of the room and says:) There is a weary traveller outside our gate, seeking entrance.
No. 2: He has it now. There is one of us who gave it to him.
No. 2: (Returns to the door.) You have permission to enter in.
No. 1: (Leads candidate in and around the room three times slowly, Counsellor or President raps or strikes bell once as candidate approaches each post.)
No. 3: (Reads Romans 12:1 as he passes. Counsellor or President reads Romans 12:2 as he passes.)
No. 4: (Reads Matthew 10:39 as he passes.)
No. 2: (Reads Luke 14:23 as he passes the first, second and third times around the room.)

No. 4: (Raps candidate twice on left shoulder and at the same time asks) Who comes here?
No. 1: Mr. (candidate's name), is this your desire? Candidate: It is.
No. 4: The Royal Ambassadors' motto states the basic principle of the Royal Ambassadors' programme. It calls on us to represent Christ in every area of our lives. It points out that we are to live for Christ and help share Him with the world. This is the foundation of world missions. God has no other means of telling the world about His Son except through us as we represent Christ. This motto helps all Royal Ambassadors to carry out the principles Christ has set for us.

The Royal Ambassadors' motto is, "We are Ambassadors for Christ." Mr. (candidate's name), will you be loyal to this motto?
Candidate: I will.

No. 3: Mr. (candidate's name), the motto, "Share the Light of the world," is taken from John 3:12 which says, "I am the light of the world: he that followed me shall not work in darkness, but shall have the light of life." As an ambassador, do you accept the responsibility of sharing the light with the world?
Candidate: Yes, I do.

Counsellor or President: "The Royal Ambassadors' Pledge emphasizes the basic purpose of the Royal Ambassadors' programme. If you agree to willingly subscribe to this pledge, please repeat it after me:

As a Royal Ambassador, I will do my best:
To become a well-informed, responsible follower of Christ;
To learn how the message of Christ is carried around the world;
To work with others in sharing Christ; and
To keep myself clean and healthy in mind and body."

(Candidate repeats after each phrase.)

Counsellor or President: (Faces the candidate) To seal this pledge you will place your right hand on the Bible.`,
  },
  {
    id: "uniforms",
    title: "Royal Ambassadors Uniforms",
    group: "main",
    content: `ROYAL AMBASSADORS UNIFORMS

Until 1977 when the department of Men's Missionary Union was established, there was no nation-wide accepted uniform for the Royal Ambassadors of Nigeria. Each chapter had its own design.

On inception, the first decision that the MMU Central Committee took was to produce the T-shirts used as the RA uniforms locally. This was used until 1978 when the first uniforms patterned after that of the Brotherhood Commission of America was adopted with all ranking badges locally designed.

There were three major reviews of the uniform that took place in 1985, 1991 and 1995.

1. PLAY UNIFORM
A. White T-shirts with the Royal Ambassadors emblem
B. Navy blue polyester trousers
C. Brown Sandals

2. DRESS UNIFORM
A. Navy blue polyester short sleeve shirt (sewn in police style). Convention officers could wear long sleeve shirts.
B. Navy blue polyester trousers
C. Black belt (with RA buckle)
D. Black shoes
E. White socks
F. RA cap (only leaders could use berets or baseball caps)
G. Gold neckerchief taped round with blue (only leaders could use ties)
H. The general badge is pasted on the left pocket

3. MINISTERS UNIFORM
Ministers could dress like the Royal Ambassadors leaders; or wear a plain blue suit over a white shirt and a golden Royal Ambassadors tie.

4. ADVANCEMENT BADGES

A. Junior Royal Ambassadors: (a shield at the background)
   i) Assistant Intern: A torch badge mounted on the left arm.
   ii) Intern: A torch badge with star, mounted on the left arm of the shirt.
   iii) Senior Intern: A torch badge with 2 stars, mounted on the left arm of the shirt.

B. Intermediate Royal Ambassadors: (a shield at the background)
   i) Envoy: A wheel badge mounted on the left arm of the shirt.
   ii) Special Envoy: A wheel badge with a star, mounted on the left arm of the shirt.
   iii) Senior Envoy: A wheel badge with 2 stars, mounted on the left arm of the shirt.
   iv) Dean: A white badge with 3 stars, mounted on the left arm of the shirt.

C. Senior Royal Ambassadors: (a shield at the background)
   i) Ambassador: A crown badge mounted on either (both) shoulders of the shirt.
   ii) Ambassador Extra-Ordinary: A crown badge with a star below it, mounted on either (both) shoulders of the shirt.
   iii) Ambassador Plenipotentiary: A crown badge with two stars below it, mounted on either (both) shoulders of the shirt.

5. RA LEADERS UNIFORM AND DECORATIONS

a. Counsellor: A counsellor uses a white whistle rope around his left arm. He wears the counsellor's chevron below the general badge, and also uses a blue beret cap.
b. Assistant Counsellor: He dresses like the Counsellor.
c. Church RA Director: He dresses like a counsellor and uses a blue staff taped white.
d. RA President: He dresses in his RA uniform using the yellow whistle rope, his current ranks on his shoulder and a blue staff taped white.
e. Chapter Commandant: He dresses in his chevron and beret. He wears his current ranks on his shoulder and carries a blue staff taped white.
f. Association Commandant: He dresses like the Counsellor using white whistle rope, chevron, and beret. He wears his current ranks on his shoulder.
g. The Associational RA Director: He dresses like the counsellor using a white staff taped gold.
h. The Conference Commandant: He dresses like the counsellor using white whistle rope, chevron, and beret. He wears his current ranks on his shoulder and carries a white staff taped gold.
i. RA Marshal: He dresses like the counsellor, using yellow whistle rope, chevron, and a beret. He wears a long elective bar and five Marshal's special ranks (4 gold stars with the Marshal's crossed swords) on his shoulders and carries a gold staff taped white.
s. Missionary Organizations Director: Wearing a ministers' dress, he uses long elective bar and 4 gold stars on each shoulder, carries gold stars on each shoulder, carries gold staff taped whitee and uses whistle rope, chevron, and a beret cap.
t. MMU National President: The National Ambassador-At-Large uses long elective bar and 4 white stripes on each shoulder. He holds gold staff taped white. He uses a white whistle rope, chevron and a beret cap.
u. President, NBC: The Ambassador-in-Chief wears a minister's uniform with 4 gold stripes on each shoulder; a long elective bar and gold staff taped white, he also uses a whistle rope chevron and a beret cap.`,
  },
  {
    id: "programmes",
    title: "Special Programme Suggestions for RA Activities",
    group: "main",
    content: `SPECIAL PROGRAMS SUGGESTIONS FOR ROYAL AMBASSADORS ACTIVITIES

A. Weekly Meetings

It is recommended that a chapter of the Royal Ambassadors meets weekly. The meeting should take place on a particular day and time of the week throughout the year (for at least an hour and a half). One hour dedicated for the programme of the day itself, and the remaining 30 minutes for recreation or sports, or any other activity of interest. This may be before or after the main meeting.

The programme for the first week of the month may be business meeting, efforts on ranks and insight to the month's study. The second meeting may be for a Bible study. The third meeting could be given to Christian service or to a study of stewardship. The fourth meeting may be used for studies about prayer/lessons on mission work. And when a month has five weeks, the fifth meeting may be used for some type of special programme or activity. (See column for "Special Programme" and Christ Ambassadors: Life & Work Series RA Yearbook for detailed annual programme.)

B. Fortnightly Meetings

Fortnight meetings are only encouraged if and when a chapter is completely unable for genuine reasons to hold weekly meetings. A fortnight meeting may be held twice a month. Chapters that meet fortnightly may wish to combine some of the programmes for weekly meetings. For example, the first meeting could be used for Bible study for one month and for mission study the second month etc. (See column for "Special Series RA Yearbook for detailed annual programme.)

C. New Chapter Inauguration/Launching

1. Statement of Launching for a new RA Chapter:
(Conference Director/Convention Officer shall say as follows:) In response to the command of Jesus: "Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, teaching them to observe all that I have commanded you and lo, I am with you always, to the close of the age." (Matthew 28:19-20), and since it is the wish of the Minister-In-Charge of this church, members of the Church Council, the Men's Missionary Union, and the entire members of the church, to launch the chapter of Royal Ambassadors of this church, with the activities and zeal displayed by the officers and members of the organization, we are convinced that you wish that this chapter be formally launched today.

We have carried out every examination necessary before any chapter could be launched, and we have seen clearly that it is necessary for the Royal Ambassadors of this church to be so formally organized with the……........... Association.

Therefore, with the power vested on me by the national body, Royal Ambassadors of Nigeria, the leadership of Men's Missionary Union and the Nigerian Baptist Convention, I hereby launch this organization in this church; in the name of God, the Father and the Son, and the Holy Spirit. (Amen)

Also, we authorize you to join other organizations in the ...............Baptist Association, ............... Conference, and in the Convention in general.

May God help you that you may shine brightly in the darkness of the world and be useful instruments of evangelization in this locality, throughout the length and breadth of Nigeria and in the entire world in the precious name of our Lord and Master, Jesus Christ. Amen.

…………………….                    …………………..
RA Secretary                          Counsellor

…………………..                       ……………………..
MMU President                         Minister-In-Charge

                    …………………………….
          Name/signature of the launching officer

                    …………………………….
                              Date

2. Order of Service for the Launching of a new RA Chapter

A. Preliminary: (Before the worship service, take a 10 minutes short RA ceremony around the national flag, Christian flag, and RA flag hosted outside the church. Also allow the organ prelude to go on).
1. Parade and march past of honour mounted by the RAs.
2. Inspection of guard of honour by the programme personnel.
3. The hearty cheers.
4. Dismissal.

B. Service Begins: Take a few minutes guard of honour mounted at the main entrance of the church and crossing of the swords. Commands must be non-verbal to avoid distraction of the service.

C. Processional: (With music/singing led by the church choir, the processional being led by celebrants and programme personnel).

D. Order of Worship Service:
1. A call to worship
2. Hymn: The King's Business / Onward Christian Soldiers
3. Invocation
4. Announcements / Introduction
5. Pastoral Prayer
6. Offertory / Choir special / Prayers
7. Hymn: I Surrender All
8. Scripture Reading
9. Challenge
10. Procedure for the Launching:
    a. History of RA work in the church
    b. Presentation of members and officers
    c. Demonstration of members' knowledge of RA work through some aspects of the manuals
    d. Motion for launching of the chapter
    e. Statement of launching
    f. Hand of fellowship by the association and conference
    g. Decorations
    h. Special prayer for the members
11. Closing Remarks
12. Prayer and Benediction
13. Recessional Hymn

D. Planning a Calendar Programme

It is the counsellor's responsibility to ensure that a suitable calendar of activity is planned for the year, following the Convention Activity Plan book for the year as a guide. The officers of the chapter should work hand in hand with him to plan the calendar.

Much prayer and planning should go into every chapter meeting to make it as meaningful, blessing and interesting as possible for members to be willing to take part in all the meetings. Although the counsellor will lead in planning the programme, it is not his duty to assign the programme. The boys are to be responsible to locate their programme with the counsellor's guidance. The counselor may however use any of the following outlines in planning and evaluating the chapter meetings.

E. Chapter Meeting

Date of meeting...............................

Time        Activity                    Person in Charge
30 mins     Recreation / Sport          Sports Committee
5 mins      Opening of Meeting          President
10 mins     Business                    President

F. A Suggested Proceeding (Activity) of Meetings

Arrangement of room: A small table may be placed at the front of the room where the Royal Ambassadors meet (for the President and the Recorder's use). The Vice President may sit near the door both to welcome the boys and also receive any visitor.

(The programme may follow this outline.)
1. President: (Give three taps of the gavel.) The ............... (Mentions the name of chapter) Chapter of Royal Ambassadors is come to order. Let us stand and repeat our Royal Ambassadors Motto.
2. All Boys: "We are ambassadors for Christ" (2 Corinthians 5:20.)
3. President: Let us sing the Royal Ambassadors Hymn while we are standing.
4. All Boys: (Sing together the Royal Ambassadors Hymn.)
5. President: Let us pray together while ................(mentions a name of a person) will lead us in prayer. (After the prayer, taps the gavel one time to symbolize that members should sit or says let us be seated. The Recorder will now call the roll.)
6. Recorder: (Calls the roll.)
7. Each Boy: (Each boy may answer by saying a Scripture memory verse, the name of a missionary, or by saying "here" or "present.")
8. President: May we listen to the Recorder as he reads the minutes of the last meeting.
9. Recorder: (Reads the minutes that he may have prepared with the counsellor's help.) In case of no addition or any correction from those present in the last meeting, I present these minutes for acceptance for discussions.
10. President: (Calls for amendments, and then thereafter, the approval and seconder for the minutes adoption.)
11. Vice-President: (Introduces visitors or new members.)
12. President: May all officers and committees please present the reports of their works. (This will be the time for reports or plans for future work or matters of business.)
13. President: It's time for the AOB. Is there any business?

Or if it is a Day of Programme (Not Meeting):
14. President: (He says) Let us be attentive as our programme for today is presented at this time. (He announces that all members should bring out their copy of Christ Ambassadors or as the case may be.)

After the programme of the day, the President continues to preside.
15. President: It is Counsellor's time. Let us all listen to what our counsellor has for us.
16. Counsellor: (He speaks for about 10 minutes on variety of things to be sure that the boys understood the programme and are getting along. He may encourage them in reading their Bibles, praying, giving, witnessing or by being faithful in church attendance, or about plans for future programmes or activities that he would encourage the boys to participate in, or explain how to become a Christian and how the person should live in union with Christ. He will want to plan his talk carefully in order to meet the needs of the boys.)
17. President: Let us form the Royal Ambassadors friendship circle as we take the closing prayer and benediction.
18. All Boys: (Form the friendship circle and place their hands on the shoulders of the boys on either side while they say the Royal Ambassadors pledge and have the closing prayer. They may also say the Lord's Prayer together or sing a hymn for the closing prayer as it may be suggested by the President.)

NOTE: After the meeting, the counsellor and officers may remain to evaluate the meeting and make plans for the next or future meetings. The room should be cleaned and re-arranged in order to be ready for use when it is needed.

G. Evaluating a Chapter's Meeting

Number of boys enrolled...............
Number Present.......................

1. Were plans for meetings made? Yes..... / No.....
2. Were plans for future meeting made? Yes..... / No.....
3. How do you grade the meeting? Excellent...... Good.... Fair.... Poor.....
4. How many prospects attended the meeting? ...........
5. What is the future prospect for your meetings? .........................................................
6. How much members' participation did you enjoy? .................................................
7. What could be done to improve the meeting? .....................................................

H. Other Suggested Programme for all levels of RA Bible Study

1. Bible Characters
a. Abraham: Father of the Faith. Genesis 12:1-19; Hebrews 11:8-10
b. Joseph: A Dreamer. Genesis 30:22-24; 37:1-35
c. Joseph: A Slave and a Prisoner. Genesis 37:36; 39:1-23
d. Joseph: A Leader of Men. Genesis 41:1-34; 45:1-10
e. Joseph: A Man of Forgiveness. Genesis 44:1-34; 45:1-10
f. A Shepherd Boy Becomes King. 1 Samuel 16:1-13
g. David: The Gifted Musician and Poet. 1 Samuel 16:14-23
h. David: The Giant Killer. 1 Samuel 17:17-51
i. Amos: A Shepherd and a Preacher. Amos 7:12-15; 5:12-12
j. The Boy Jesus in the Temple. Luke 2:41-52
k. Jesus: The Man who conquered the Devil. Matthew 4:1-11
l. Timothy: A young man who knows the Bible. 2 Timothy 3:14-17
m. He Brought his Brother to Jesus. John 1:35-42
n. A Boy and his Lunch. John 6:1-15
o. The Lost Son. Luke 15:11-24

2. Christian Living
a. Becoming a Christian. Romans 3:23; Acts 16:31; Revelation 3:20; Romans 10:9
b. Why be Baptised? Matthew 3:1-17; Romans 6:4
c. Witnessing to others. John 3:16; Romans 6:23; Luke 13:3; 1 John 1:9
d. Being a Good Neighbour. Luke 10:30-37
e. Faithfulness in Worship. Psalm 122:1; Joshua 24:15, 24; John 4:23-24
f. Be a Good Example. John 13:15; 1 Timothy 4:12; 1 Peter 2:21; Jude 7
g. Labourers Together with God. 1 Corinthians 3:4-9
h. Respect for Others. James 2:1-9; Romans 12:9-10
i. Serving God through Singing. Psalm 33:1-5; 95:1-2; 108:1-4
j. Making the Best Use of your Abilities. Matthew 25:14-30; Romans 12:6-8

3. Missions in the Bible
a. Watchmen for God. Ezekiel 33:1-9
b. An Absconding Missionary. Jonah 1:1-17; 2:1, 10; 3:1-5
c. The Good News is for Everyone. Acts 10:9-15, 34-35
d. Paul's First Missionary Journey. Acts 13-14
e. Paul's Second Missionary Journey. Acts 15:36-18:22
f. Paul's Third Missionary Journey. Acts 18:23-21:15
g. Luke: A Missionary Doctor. Luke 1:3; Acts 1:1; Colossians 4:14; 2 Timothy 4:11; Philemon 24
h. Philip: A Faithful Witness. Acts 8:35-39
i. Barnabas: A Missionary Helper and Child of Consolation. Acts 4:36-37; 9:26-27; 11:29-30; 13:15; Acts 4:9; 11; 13; 14
j. Silas: A Companion in Sorrow. Acts 15:22, 40; 16:16-34
k. A Young Christian Helper. 2 Timothy 1:5; 3:15; Acts 16:1-5
l. A Christian as a Missionary. Matthew 28:19-20; Mark 16:15; Romans 10:12-15

4. Mission Study
a. Home Missions (all RA must participate in the observance of Home Mission Week of Emphasis March.)
b. Foreign Missions (all RA must participate in the observance of International Missions Week of Emphasis in December.)
c. Study the lives of missionaries. (See books under Counsellor's Corner or meet the church pastor for help.)

5. Prayer
a. How to pray. 1 Thessalonians 5:17-18
b. The Model Prayer. Luke 11:1-13
c. Prayer in Secret. Matthew 6:5-13
d. When Should we Pray? Psalm 85:17; 26:41; Luke 18:1; James 5:13
e. Praying for Others. James 5:13-15; Acts 12:5; Luke 22:31-32

6. Service Programmes
a. Helping others. Matthew 5:14-16; 25:34-40; Luke 14:16-21; James 2:15-16
b. Visit the home of sick or invalid persons. Read the Bible, Sing hymns and Pray for the sick person.
c. Present an Easter play in the community and invite all the people to come.
d. Present a Christmas play or sing Christmas carols and invite people to come.
e. Help to clean up the church building or church grounds.
f. Help to clean up the community or neighbourhood.

7. Stewardship
a. Stewardship of Life: Genesis 2:7; Matthew 18:1-6; Luke 2:52
b. Purity of Life. Genesis 39:1-23; 1 Corinthians 6:19; Philippians 1:20
c. Stewardship of Service. Matthew 25:34-40; Luke 6:31
d. Stewardship of Time. Ephesians 5:16; James 4:14
e. How should a Christian give? Malachi 3:10; 1 Corinthians 4:2; Matthew 10:8
f. Treasures in Heaven. Matthew 6:19-20; Luke 12:13-31
g. Stewardship of Money. Leviticus 27:30-32; Deuteronomy 8:18; Psalm 24:1; Haggai 2:8

8. Special Programmes
a. Health lecture on First Aid by a doctor, nurse or other specialized health worker.
b. Hygiene seminar on the need of good health by a qualified person.
c. A lecture on the harmful effect of alcohol and tobacco on the body.
d. A discussion on the part a boy can play in making a Christian home.
e. Premarital seminar or discussion on the characteristics needed in choosing the right future partner for life.

Specials Activities

9. Games
a. Local Free-cells (Ayo)
b. Scrabble
c. Ludo
d. Chess
e. Whot
f. Checkers
g. Others

Collections and Nature Study
a. Collection of insects and butterflies
b. Collection of special leaves
c. Collection of rocks
d. Collection of small animals
e. Identification of animals
f. Identification of birds
g. Identification of snakes
h. Identification of trees

Hobbies
a. Carving of wood, calabash etc.
b. Collection of stamps
c. Crafts learning and practising. E.g. making of brooms, cage (animal trap), basket weaving etc.
d. Fishing
e. Hunting
f. Gardening
g. Music making
h. Painting and drawing
i. Photography
j. Reading
k. Story telling

10. Organized Games and Sports
a. Organized games: Dodge Ball, Snatch the Cloth, Hide and Seek etc.
b. Single Sports: Table tennis, Lawn tennis.
c. Team Sports: Soccer, Netball, Volleyball, Track and Field-meet

11. Some Suggestion for Games and Sports

Some of the games and sport suggested above may be played before and after chapter meeting. A special time may be set for a soccer, netball or volleyball match between different chapters of different churches. A "Sports Day" consisting of track and field events could be planned for the boys and girls of the church (including Girls Auxiliary, Lydia and Royal Ambassadors).

12. Instructions for Organized Games

a. Dodge Ball is played with a soft rubber ball. There are two throwers who stand about 30 feet facing each other. All of the other boys stand middle-way of the throwers. The boys throwing try to hit the ones in the middle with the ball; and when a boy is hit he will quit playing until everyone has been hit. Meanwhile, the boys in the middle continue to dodge the balls. The last two boys to be hit will then become throwers for the next time. The object of the game is to dodge the ball in order not to be hit.

b. Snatch the Cloth is played by dividing the boys into two even groups. The boys line up beside one another in two lines about 40 feet from one another and facing each other. The counsellor will count the boys and give them each a number. There will be a number 1 on each side, a number 2, and so on according to how many boys there are. The counsellor calls out one of the numbers. The boy from each side with that number runs to a point half-way between the two groups of boys where a cloth is lying on the ground. The boy who succeeds in getting the cloth and running back to his side without being touched by the other boy makes a point for his side. If a boy touches the other boy while he has the cloth, he makes a point for his side. The side having the most points within a period of time is declared the winner. The losing side should applaud in congratulating them.

c. Hide-and-Seek can be played with as few as three boys and as many boys who want to play. The boys will go to hide in different places around the building and one of them will hide his face and close his eyes. When the boys are all hiding, they will tell the boy to come seek for them. The boy will search until he finds all the boys. The last one found will then become the "seeker" in the next game.`,
  },
  {
    id: "sponsoring",
    title: "Royal Ambassadors Sponsoring Organization",
    group: "main",
    content: `ROYAL AMBASSADORS SPONSORING ORGANIZATION

The Baptist Men's Fellowship of a church is suggested to be the sponsoring organization of a Royal Ambassadors chapter. The Men would guide the Royal Ambassadors work through a Royal Ambassadors Committee. They (Baptist Men's Fellowship) would be financially responsible for the chapter.

THE ROYAL AMBASSADORS COMMITTEE

The Royal Ambassadors Committee will be composed of three or five men of the church who are interested in boys. They would help in enlisting and training Royal Ambassadors counsellors. They would also be the go-between for the Baptist Men's Fellowship and the Royal Ambassadors. They would help in presenting the material needs (books and others) of a chapter to the sponsoring organization.

If a church does not have a Baptist Men's Fellowship, one or more of the men's Sunday School classes could be the sponsor. Where this is not possible, the Women's Missionary Society may be willing to offer some guidance and assistance until a men's group would be able to do so.

If none of these organizations can sponsor the Royal Ambassadors and the church is able to do so, the church should appoint a Royal Ambassadors Committee to help give guidance to the work. They will assist the Royal Ambassadors in every way they can.`,
  },
  {
    id: "counselor",
    title: "The Counselor's Corner",
    group: "main",
    content: `THE COUNSELOR'S CORNER

Congratulations upon being chosen to work with Royal Ambassadors! Your church has shown their confidence in you by electing you for this service. Leading boys is an important task. It will involve many hours of planning, praying, and working. But to be able to see the boys become Christians under your guidance, and to see them grow in the Christian faith, will be worth every hour you will spend in this work!

YOUR PREPARATION AS A COUNSELLOR

The desire of a Royal Ambassadors counsellor is to be a good counsellor. This calls for much study and effort! You will want to read and understand the Royal Ambassadors Manual carefully and become familiar with it.

Be sure to study and observe the boys and young men as well as literature about them. You will want to know how they act and why they act that way. You will want to know how best to teach and work with boys and young men. Certainly you will want to ask for God's guidance as you do your work.

KNOW EACH BOY

In order to be your best in working as a RA counselor, you should work very closely with each boy in the chapter. Learn as much information as possible about the boys. Keep this information in a notebook you will use in working with boys.

Boy's Information to Record:
• Name of boy
• Age
• Address
• Class in School
• Father's Name and Religion
• Mother's Name and Religion
• Brothers' Names, Religions and Ages
• Sisters' Names, Religions and Ages
• Friends' Names, Religions and Ages

Boy's Church Life:
• Church attended
• Is he a member of Sunday School? Yes / No
• Rank in Royal Ambassador
• Is he a member of Church Training Programme? Yes / No
• Is he a member of the choir? Yes / No
• Is he a member of Boy Scouts or Boy's Brigade? Yes / No

Boy's Interests:
• Kinds of hobbies
• Favourite games
• Sports he enjoys
• Other interests

Boy's Needs:
• List areas where the boy needs help

USE OF MANUAL

The purpose of this manual is to serve as a guidebook to you as a counsellor, and to the boys. You may not have to use it as the law of Medes and Persia that cannot be changed; but they form suggestions on the various parts of Royal Ambassadors work. You are however saddled with the responsibility of drawing out the best from it for the best use of your chapter.

As a counsellor, you will need imagination and initiative in planning your work. You may want to experiment with programmes or activities in order to determine what is best for your own particular church or chapter situation.

Please consider the importance of your work as a counsellor, and give yourself to the work. You will find a deep sense of satisfaction in helping boys to become followers of Christ, mature and responsible men.

We welcome you to the group of men who are interested in, and who are working with, boys of Baptist churches in Nigeria. Helping boys to become "Ambassadors for Christ" is a privilege and an honour.

WORKING WITH THE ROYAL AMBASSADORS COMMITTEE

As a counsellor you should work closely with the Royal Ambassadors Committee of the sponsoring organization. You will inform them about the needs of the chapter. This committee will help in planning activities of the chapter such as camping, sporting events, and other special events. They will also help to secure the materials needed for the work of the chapter.`,
  },
  {
    id: "books",
    title: "Suggested Books for RA Leaders and Members",
    group: "main",
    content: `SOME SUGGESTED BOOKS FOR RA LEADERS AND MEMBERS

The counsellor and the entire members of the Royal Ambassadors (Junior, Intermediate and Senior) may find help in some of the following books. Some of the books are about mission work in Nigeria, other African countries, and other countries of the world.

Some of these books may be purchased from the Baptist Bookstore or other bookstores, or borrowed from a public/Christian library, from a lending library of a church/a pastor or missionary.

1. Anderson, Susan, May Perry of Africa (Nigeria). Nashville, Tennessee: Broadman Press, 1966.
2. Aworinde, Sola, Blest Be the Tie. Lagos: Charisma Creations, 1990.
3. Bagudu, Gideon Bala, Drawing Out the Anointing. Surulere, Lagos: The Agape Publications, 1998.
4. Baruch, Dorothy W., How to live with Your Teen-Ager. New York: McGraw Hill Book Company, Inc., 1953.
5. Beveridge, W. M., Child Study. Accra: Scottish Mission Book Depot, n.d.
6. Borthwick, Paul, Leading the Way: Leadership IS not just for Super Christians. Waynesboro, Atlanta: OM Literature, 2000.
7. Borthwick, Paul, Youth and Mission. Waynesboro, Atlanta: OM Literature, 2000.
8. Brown, Malcolm, A Helping Hand. Accra, Ghana: African Christian Press, 1969.
9. Carson, Ben, Think Big: Unleashing your Potential for Excellence. Grand Rapids, Michigan: Zondervan Pub., House, 1992.
10. Doggett, Charles and Frank Black, Royal Ambassador Campcraft. Memphis, Tennessee: Broadman Commission, 1975.
11. Evans, A. R., Mary Slessor: The White Queen of Calabar. London: Oliphants Ltd., 1956.
12. Fletcher, Jess C., Bill Wallace of China. Nashville, Tennessee: Broadman Press, 1963.
13. Getz, Gene A., The Measure of a Man. California: Regal Books, 1974.
14. Graham, Billy, The Jesus Generation. Minneapolis, Minnesota: World Wide Publications, 1971.
15. Maxwell, John C., Developing the Leader Within You. Argentina: EQUIP, 1993.
16. Northcutt, Cecil and Joyce Reason, Six Missionaries in Africa. London: Oxford University Press, 1960.
17. Olaniyan, Samson Ola, On Course for Missions: The Story of Baptist Men in Nigeria. Oyeku Printing Works, Ibadan, 2002.
18. Olatunji, Simon O., Destined and Daring Unto Greatness: Unleashing Your Potentialities for Greatness. Ibadan: Charisa Information Network, 2003.
19. Olatunji, Simon O., The Reaching Hands Missions Advancement Through Equipping Believers — RA Missions Action Workbook. Ibadan: Baptist, 2005.
20. Olatunji, Simon O., The Praying Hearts: Watchmen on the Walls of Israel — RA Prayer Workbook. Ibadan: Charisa Information Network, 2003.
21. Stanko, John W., So Many Leaders, So Little Leadership. Kaduna: Evangel Publication, 2000.
22. Stevenson, P. M., William Carey. London: Oliphants Ltd., 1956.`,
  },
];

export function searchManual(query: string): SearchResult[] {
  if (!query.trim()) return [];
  const lower = query.toLowerCase();
  const results: SearchResult[] = [];

  for (const section of MANUAL_SECTIONS) {
    const titleMatch = section.title.toLowerCase().includes(lower);
    const contentIdx = section.content.toLowerCase().indexOf(lower);
    if (!titleMatch && contentIdx === -1) continue;

    let snippet = "";
    let matchIndex = contentIdx;

    if (contentIdx !== -1) {
      const start = Math.max(0, contentIdx - 60);
      const end = Math.min(section.content.length, contentIdx + query.length + 80);
      const raw = section.content.slice(start, end).replace(/\n/g, " ");
      snippet = (start > 0 ? "..." : "") + raw + (end < section.content.length ? "..." : "");
    } else {
      snippet = section.content.slice(0, 120).replace(/\n/g, " ") + "...";
      matchIndex = 0;
    }

    results.push({ section, snippet, matchIndex });
  }

  return results;
}

export const TOC_SECTIONS = MANUAL_SECTIONS.filter((s) => s.group === "main");
export const FRONT_MATTER = MANUAL_SECTIONS.filter((s) => s.group === "front");
