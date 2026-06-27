export interface ManualSection {
  id: string;
  title: string;
  content: string;
}

export interface ManualChapter {
  id: string;
  title: string;
  description: string;
  iconName: string;
  sections: ManualSection[];
}

export const MANUAL_CHAPTERS: ManualChapter[] = [
  {
    id: "ch1",
    title: "The RA Pledge & Promise",
    description: "Learn the foundational commitments of every Royal Ambassador.",
    iconName: "shield-checkmark-outline",
    sections: [
      {
        id: "ch1s1",
        title: "The Royal Ambassador Promise",
        content:
          'As a Royal Ambassador, I will do my best to become a well-informed, responsible follower of Christ; to have a Christlike concern for all people; to learn how to carry the message of Christ around the world; to work with others in sharing Christ; and to give to missions.\n\nThis promise is the foundation of everything we do as Royal Ambassadors. It calls us to grow in knowledge, compassion, action, teamwork, and generosity for the sake of God\'s global mission.',
      },
      {
        id: "ch1s2",
        title: "The RA Pledge",
        content:
          '"I will walk worthy of the vocation wherewith I am called." — Ephesians 4:1\n\nThe RA Pledge reminds us that our calling as Christians demands a life of purpose and integrity. To walk worthy means to live in a way that reflects the character of Christ in everything we do — at home, at school, and in our communities.',
      },
      {
        id: "ch1s3",
        title: "Living Out the Promise",
        content:
          "Being a Royal Ambassador is not just about what we say — it is about how we live. Here are three ways to apply the RA Promise this week:\n\n1. Be informed: Read one Bible passage each day and reflect on its meaning.\n2. Show concern: Look for one person at school or home who needs encouragement.\n3. Give to missions: Bring an offering or contribute to your chapter's mission fund.",
      },
    ],
  },
  {
    id: "ch2",
    title: "God and His Word",
    description: "Discover the importance of the Bible as God's guide for life.",
    iconName: "book-outline",
    sections: [
      {
        id: "ch2s1",
        title: "What Is the Bible?",
        content:
          "The Bible is God's written message to humanity — 66 books, written by more than 40 authors over 1,500 years, all inspired by the Holy Spirit (2 Timothy 3:16). It tells the story of God's love and his plan to save the world through Jesus Christ.\n\nThe Bible is divided into two main parts:\n• The Old Testament: 39 books telling of creation, God's people Israel, and the promise of a Savior.\n• The New Testament: 27 books telling of Jesus' life, death, and resurrection, and the birth of the Church.",
      },
      {
        id: "ch2s2",
        title: "Reading God's Word Daily",
        content:
          "A consistent time with God's Word is one of the most powerful habits a follower of Christ can build. Here is a simple daily plan:\n\n1. Find a quiet place and eliminate distractions.\n2. Pray and ask God to speak to you through his Word.\n3. Read a short passage — start with the Gospel of Mark.\n4. Write one thing that stood out to you.\n5. Pray and ask God to help you live out what you read.\n\nEven 10-15 minutes a day can transform your understanding of who God is.",
      },
      {
        id: "ch2s3",
        title: "Memory Verse Challenge",
        content:
          '"Your word is a lamp for my feet, a light on my path." — Psalm 119:105\n\nMemorizing Scripture plants God\'s Word in your heart. When you face temptation, fear, or sadness, a memorized verse can come to mind exactly when you need it.\n\nTip: Write your verse on a card and put it somewhere you see every day — your mirror, your phone case, or your lunch bag. Read it three times in the morning and three times before bed for one week.',
      },
    ],
  },
  {
    id: "ch3",
    title: "Prayer and Devotion",
    description: "Learn how to build a meaningful and consistent prayer life.",
    iconName: "hand-right-outline",
    sections: [
      {
        id: "ch3s1",
        title: "What Is Prayer?",
        content:
          "Prayer is simply talking with God. It is a conversation between you and your Heavenly Father, who loves you and wants to hear from you. You do not need special words or a certain posture — God listens to the honest prayers of the heart.\n\nJesus taught his disciples to pray using what we call the Lord's Prayer (Matthew 6:9-13). This prayer has four key parts:\n1. Worship — honoring God for who he is.\n2. Surrender — asking for his will to be done.\n3. Request — bringing our needs to him.\n4. Forgiveness — confessing our sins and forgiving others.",
      },
      {
        id: "ch3s2",
        title: "The ACTS Prayer Method",
        content:
          "Use the ACTS method to structure your prayer time:\n\nA — Adoration: Begin by praising God. Tell him how great he is.\nC — Confession: Honestly tell God where you have fallen short.\nT — Thanksgiving: Thank God for his blessings in your life.\nS — Supplication: Bring your requests and needs to God.\n\nSet aside five minutes each morning using this method. You will be amazed how it grows over time.",
      },
      {
        id: "ch3s3",
        title: "Praying for the World",
        content:
          "Royal Ambassadors are called to have a global vision. One of the most powerful things you can do for missions is pray.\n\nThis week, pray for:\n• A missionary your church supports by name.\n• One nation where Christians face hardship.\n• Your friends and family to know Jesus.\n• Yourself — that God would use you for his glory.\n\nWhen we pray with a global heart, God expands our vision and compassion for the world he loves.",
      },
    ],
  },
  {
    id: "ch4",
    title: "Christian Living",
    description: "Discover what it means to follow Christ every day.",
    iconName: "walk-outline",
    sections: [
      {
        id: "ch4s1",
        title: "Following Christ Daily",
        content:
          "Following Christ means more than going to church or knowing Bible facts. It means letting Jesus shape the way you think, speak, and act every single day.\n\nJesus said, 'Whoever wants to be my disciple must deny themselves and take up their cross and follow me.' (Matthew 16:24)\n\nThis means:\n• Putting God's priorities above your own desires.\n• Choosing integrity even when it is difficult.\n• Loving others, even those who are hard to love.\n• Seeking to glorify God in your school, sports, and friendships.",
      },
      {
        id: "ch4s2",
        title: "Fruit of the Spirit",
        content:
          "Galatians 5:22-23 lists the fruit of the Spirit: love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, and self-control.\n\nThese are not things we produce on our own — they grow naturally when we walk closely with the Holy Spirit. Ask yourself this week:\n• Where do I see these qualities growing in my life?\n• Where do I need to ask God for more of his Spirit?\n\nChoose one fruit to focus on this month and ask a friend to hold you accountable.",
      },
      {
        id: "ch4s3",
        title: "Integrity and Character",
        content:
          "Character is who you are when no one is watching. A Royal Ambassador is known for telling the truth, keeping promises, and treating others with respect — not because he has to, but because he wants to honor Christ.\n\nPractical integrity challenges:\n1. Tell the truth even when it is awkward.\n2. Return something you borrowed promptly.\n3. Stand up for someone who is being mistreated.\n4. Do your best work even when no one is grading it.\n\nWhen others see your good character, it points them to Christ.",
      },
    ],
  },
  {
    id: "ch5",
    title: "Church and Missions",
    description: "Understand the role of the church in God's plan to reach the world.",
    iconName: "people-outline",
    sections: [
      {
        id: "ch5s1",
        title: "The Purpose of the Church",
        content:
          "The church is not a building — it is the community of believers who follow Jesus together. God designed the church to:\n• Worship him together.\n• Teach and grow in his Word.\n• Support and encourage one another.\n• Reach the community and the world with the Gospel.\n\nAs a Royal Ambassador, you are part of the church's mission. Your chapter, your family, and your congregation are all tools God uses to spread his love.",
      },
      {
        id: "ch5s2",
        title: "God's Heart for the World",
        content:
          "From Genesis to Revelation, the Bible tells one consistent story: God wants all people, from every nation, to know him and be saved.\n\nKey missions passages:\n• Matthew 28:19-20 — The Great Commission\n• Acts 1:8 — Witnesses in Jerusalem, Judea, Samaria, and to the ends of the earth\n• Revelation 7:9 — A great multitude from every nation, tribe, and language\n\nMissions is not just for grown-ups or pastors — it starts with you, right where you are.",
      },
      {
        id: "ch5s3",
        title: "Getting Involved in Missions",
        content:
          "You do not have to travel overseas to be a missionary. Here are practical ways to participate in missions right now:\n\n1. Give: Bring an offering for a mission fund your church supports.\n2. Pray: Keep a prayer card of a missionary by name.\n3. Go local: Help with a community outreach project in your neighborhood.\n4. Learn: Research one unreached people group and share what you discover with your RA chapter.\n\nEvery small act of faithfulness adds to God's great global mission.",
      },
    ],
  },
  {
    id: "ch6",
    title: "Community and Service",
    description: "Put your faith into action by serving others in Jesus' name.",
    iconName: "heart-outline",
    sections: [
      {
        id: "ch6s1",
        title: "Why We Serve",
        content:
          "Jesus said, 'The Son of Man came not to be served but to serve, and to give his life as a ransom for many.' (Matthew 20:28)\n\nService is not a requirement we check off a list — it is an overflow of gratitude for what Christ has done for us. When we serve others, we are reflecting the character of Jesus to a watching world.\n\nService also builds character: it teaches us humility, empathy, and what it means to put others first.",
      },
      {
        id: "ch6s2",
        title: "Finding Opportunities to Serve",
        content:
          "Look around you — opportunities to serve are everywhere:\n\n• At home: Help with chores without being asked. Be kind to siblings.\n• At school: Include someone who is left out. Help a classmate who is struggling.\n• At church: Volunteer for children's ministry, clean-up crew, or greeting team.\n• In the community: Volunteer at a food pantry, help an elderly neighbor, or join a neighborhood clean-up.\n\nStart small. One act of service a week adds up to 52 moments where God's love shines through you.",
      },
      {
        id: "ch6s3",
        title: "Service Project Planning",
        content:
          "Planning a group service project:\n\n1. Identify a need: Ask your pastor, parents, or community leaders where help is needed most.\n2. Set a goal: What will you accomplish? Who will benefit?\n3. Gather your team: Recruit fellow RAs, friends, or family.\n4. Gather supplies: Make a list of what you need and how to get it.\n5. Serve with excellence: Work hard, be cheerful, and let others know you are serving in Jesus' name.\n6. Reflect: After the project, discuss what you learned and how it changed you.\n\nDocument your service hours and share your experience with your RA chapter.",
      },
    ],
  },
];
