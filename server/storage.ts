import {
  type User,
  type InsertUser,
  type Drill,
  type InsertDrill,
  type PracticeSession,
  type InsertPracticeSession,
  type Playlist,
  type InsertPlaylist,
  type Achievement,
  type InsertAchievement,
  type JournalEntry,
  type InsertJournalEntry,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Drills
  getDrills(): Promise<Drill[]>;
  getDrillsByLevel(level: string): Promise<Drill[]>;
  getDrill(id: number): Promise<Drill | undefined>;
  createDrill(drill: InsertDrill): Promise<Drill>;

  // Practice Sessions
  createPracticeSession(session: InsertPracticeSession): Promise<PracticeSession>;
  getPracticeSessions(userId: number): Promise<PracticeSession[]>;

  // Playlists
  getPlaylists(userId: number): Promise<Playlist[]>;
  createPlaylist(playlist: InsertPlaylist): Promise<Playlist>;

  // Achievements
  getAchievements(userId: number): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;

  // Journal
  getJournalEntries(userId: number): Promise<JournalEntry[]>;
  createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private drills: Map<number, Drill>;
  private practiceSessions: Map<number, PracticeSession>;
  private playlists: Map<number, Playlist>;
  private achievements: Map<number, Achievement>;
  private journalEntries: Map<number, JournalEntry>;
  private currentIds: {
    users: number;
    drills: number;
    sessions: number;
    playlists: number;
    achievements: number;
    journal: number;
  };

  constructor() {
    this.users = new Map();
    this.drills = new Map();
    this.practiceSessions = new Map();
    this.playlists = new Map();
    this.achievements = new Map();
    this.journalEntries = new Map();
    this.currentIds = {
      users: 1,
      drills: 1,
      sessions: 1,
      playlists: 1,
      achievements: 1,
      journal: 1,
    };

    // Initialize with some drills
    this.initializeDrills();
  }

  private initializeDrills() {
    // Get the pool table images to cycle through
    const POOL_TABLE_IMAGES = [
      "https://images.unsplash.com/photo-1427097829427-56a905bf7004",
      "https://images.unsplash.com/photo-1506359585186-16ff29581308",
      "https://images.unsplash.com/photo-1470376619031-a6791e534bf0",
      "https://images.unsplash.com/photo-1491510736257-3ad769ff47b6",
      "https://images.unsplash.com/photo-1484791984053-c4abb3fd681b",
      "https://images.unsplash.com/photo-1495548054858-0e78bb72869e",
      "https://images.unsplash.com/photo-1600965962361-9035dbfd1c50",
      "https://images.unsplash.com/photo-1603589138334-be34651248b0",
    ];

    const drillTemplates = [
      // Beginner Drills
      {
        name: "Straight Stroke Drill",
        level: "Beginner",
        description: "Set up a cue ball and object ball in a straight line along the table. Aim to pocket the ball into a corner pocket while making sure the cue ball travels in a straight line.",
        imageUrl: POOL_TABLE_IMAGES[0],
        instructions: "1. Set up a cue ball and object ball in a straight line along the table\n2. Aim to pocket the ball into a corner pocket\n3. Make sure the cue ball travels in a straight line\n4. Focus on cue ball control and stroke accuracy\n5. Practice from different distances",
      },
      {
        name: "Stop Shot Drill",
        level: "Beginner",
        description: "Set the cue ball and object ball near each other. The goal is to make the object ball and stop the cue ball in its tracks after impact, with no follow or draw.",
        imageUrl: POOL_TABLE_IMAGES[1],
        instructions: "1. Set the cue ball and object ball near each other\n2. Hit the object ball with center cue ball contact\n3. The goal is to make the object ball stop immediately after impact\n4. Practice with no follow or draw\n5. Focus on cue ball control and accuracy",
      },
      {
        name: "Cut Shot Drill",
        level: "Beginner",
        description: "Position the object ball at an angle to a pocket and practice hitting it with a cut shot to make it into the pocket.",
        imageUrl: POOL_TABLE_IMAGES[2],
        instructions: "1. Position the object ball at an angle to a pocket\n2. Practice hitting it with a cut shot\n3. Make it into the pocket\n4. Focus on aiming and cutting accuracy\n5. Vary the angles to increase difficulty",
      },
      {
        name: "One-Cushion Bank Shot",
        level: "Beginner",
        description: "Place the object ball near a rail and aim to bank it off the cushion into a pocket.",
        imageUrl: POOL_TABLE_IMAGES[3],
        instructions: "1. Place the object ball near a rail\n2. Aim to bank it off the cushion into a pocket\n3. Focus on rail shots and angle calculation\n4. Practice different angles\n5. Maintain consistent power",
      },
      {
        name: "Cue Ball Follow Drill",
        level: "Beginner",
        description: "Set up an object ball and cue ball. Practice using the follow shot technique to follow the object ball into the pocket.",
        imageUrl: POOL_TABLE_IMAGES[4],
        instructions: "1. Set up an object ball and cue ball\n2. Use the follow shot technique (hitting with top spin)\n3. Follow the object ball into the pocket\n4. Focus on cue ball movement\n5. Practice controlling follow distance",
      },
      {
        name: "Straight Line Drill",
        level: "Beginner",
        description: "Set up a straight line of balls and pocket them in sequence while keeping the cue ball in a straight line.",
        imageUrl: POOL_TABLE_IMAGES[5],
        instructions: "1. Set up several object balls in a straight line\n2. Pocket them in sequence\n3. Keep the cue ball traveling straight\n4. Focus on consistency\n5. Master cue ball positioning",
      },
      {
        name: "Ball in Hand Drill",
        level: "Beginner",
        description: "After every shot, place the cue ball anywhere on the table and practice pocketing balls while setting up for perfect positioning.",
        imageUrl: POOL_TABLE_IMAGES[6],
        instructions: "1. Place cue ball anywhere on the table\n2. Practice pocketing balls\n3. Focus on positioning for next shot\n4. Learn basic position play\n5. Practice shot selection",
      },
      {
        name: "Billiard Drill",
        level: "Beginner",
        description: "Practice making the cue ball hit multiple object balls in sequence for precise control.",
        imageUrl: POOL_TABLE_IMAGES[7],
        instructions: "1. Set up multiple object balls\n2. Hit first object ball\n3. Make it contact second ball\n4. Return to hit first ball\n5. Focus on ball-to-ball control",
      },
      {
        name: "Bridge Practice Drill",
        level: "Beginner",
        description: "Set up shots requiring different bridge types and practice using them effectively.",
        imageUrl: POOL_TABLE_IMAGES[0],
        instructions: "1. Place cue ball in different positions\n2. Practice open bridge\n3. Practice closed bridge\n4. Use mechanical bridge when needed\n5. Focus on stability and control",
      },
      {
        name: "The Two-Pocket Drill",
        level: "Beginner",
        description: "Practice making shots into alternating pockets to improve versatility.",
        imageUrl: POOL_TABLE_IMAGES[1],
        instructions: "1. Set up object ball near pocket\n2. Make it into one pocket\n3. Repeat to another pocket\n4. Practice until fluid\n5. Focus on consistency",
      },
      {
        name: "Basic Positioning Drill",
        level: "Beginner",
        description: "Practice pocketing balls while leaving the cue ball in favorable positions for the next shot.",
        imageUrl: POOL_TABLE_IMAGES[2],
        instructions: "1. Set up a sequence of object balls\n2. Plan your position for next shot\n3. Execute the shot\n4. Evaluate position success\n5. Adjust and repeat",
      },
      {
        name: "Speed Control Drill",
        level: "Beginner",
        description: "Focus on controlling shot speed to manage cue ball movement effectively.",
        imageUrl: POOL_TABLE_IMAGES[3],
        instructions: "1. Set up near-pocket shots\n2. Practice different speeds\n3. Observe cue ball movement\n4. Master soft touches\n5. Progress to harder shots",
      },
      {
        name: "Pyramid Shot Drill",
        level: "Beginner",
        description: "Practice pocketing balls from a pyramid formation with position control.",
        imageUrl: POOL_TABLE_IMAGES[4],
        instructions: "1. Set up pyramid formation\n2. Plan shot sequence\n3. Focus on position\n4. Maintain control\n5. Run the pyramid",
      },
      {
        name: "Open Table Drill",
        level: "Beginner",
        description: "Practice running an open table while maintaining position control.",
        imageUrl: POOL_TABLE_IMAGES[5],
        instructions: "1. Spread balls on table\n2. Plan your sequence\n3. Execute shots\n4. Maintain position\n5. Clear the table",
      },
      {
        name: "Aim for a Specific Spot",
        level: "Beginner",
        description: "Practice precise aiming at specific points on the object ball.",
        imageUrl: POOL_TABLE_IMAGES[6],
        instructions: "1. Choose target spot\n2. Focus on contact point\n3. Execute shot\n4. Verify accuracy\n5. Adjust as needed",
      },
      {
        name: "Line of Balls Drill",
        level: "Beginner",
        description: "Set up a straight line of object balls and practice pocketing them sequentially.",
        imageUrl: POOL_TABLE_IMAGES[7],
        instructions: "1. Arrange balls in line\n2. Start from one end\n3. Maintain straight path\n4. Control speed\n5. Complete sequence",
      },
      {
        name: "Cue Ball Control with Follow",
        level: "Beginner",
        description: "Practice controlling the cue ball's forward movement after contact.",
        imageUrl: POOL_TABLE_IMAGES[0],
        instructions: "1. Set up basic shot\n2. Apply top spin\n3. Control distance\n4. Observe path\n5. Adjust power",
      },
      {
        name: "Basic Position Play",
        level: "Beginner",
        description: "Focus on controlling the cue ball for position on the next shot.",
        imageUrl: POOL_TABLE_IMAGES[1],
        instructions: "1. Plan two shots ahead\n2. Execute first shot\n3. Control cue ball\n4. Evaluate position\n5. Adjust technique",
      },
      {
        name: "Object Ball to Pocket",
        level: "Beginner",
        description: "Practice precise object ball control with minimal force.",
        imageUrl: POOL_TABLE_IMAGES[2],
        instructions: "1. Set up close shots\n2. Use soft touch\n3. Control speed\n4. Maintain accuracy\n5. Progress to longer shots",
      },
      {
        name: "Shot Angle Practice",
        level: "Beginner",
        description: "Work on various angled shots to improve directional control.",
        imageUrl: POOL_TABLE_IMAGES[3],
        instructions: "1. Set up different angles\n2. Study cut required\n3. Execute shot\n4. Monitor results\n5. Increase difficulty",
      },

      // Intermediate Drills
      {
        name: "Bank Shot Drill",
        level: "Intermediate",
        description: "Practice banking balls off rails with precise angle calculation.",
        imageUrl: POOL_TABLE_IMAGES[4],
        instructions: "1. Set up bank shots\n2. Calculate angles\n3. Execute shots\n4. Vary distances\n5. Master multiple angles",
      },
      {
        name: "Ghost Ball Drill",
        level: "Intermediate",
        description: "Practice visualizing the ghost ball position for precise hits.",
        imageUrl: POOL_TABLE_IMAGES[5],
        instructions: "1. Visualize ghost ball\n2. Align shot\n3. Execute precisely\n4. Verify contact\n5. Repeat process",
      },
      {
        name: "Draw Shot Drill",
        level: "Intermediate",
        description: "Practice drawing the cue ball backward after object ball contact.",
        imageUrl: POOL_TABLE_IMAGES[6],
        instructions: "1. Set up draw shot\n2. Apply back spin\n3. Control distance\n4. Vary power\n5. Master technique",
      },
      {
        name: "Positioning Drill",
        level: "Intermediate",
        description: "Practice complex position play for sequential shots.",
        imageUrl: POOL_TABLE_IMAGES[7],
        instructions: "1. Plan multiple shots\n2. Execute sequence\n3. Control position\n4. Maintain accuracy\n5. Run patterns",
      },
      {
        name: "Speed Control Drill",
        level: "Intermediate",
        description: "Advanced speed control for precise cue ball positioning.",
        imageUrl: POOL_TABLE_IMAGES[0],
        instructions: "1. Vary shot power\n2. Control position\n3. Practice finesse\n4. Master speed\n5. Perfect control",
      },
      {
        name: "One-Cushion Bank Shot",
        level: "Intermediate",
        description: "Master one-cushion bank shots from various angles.",
        imageUrl: POOL_TABLE_IMAGES[1],
        instructions: "1. Set up banks\n2. Study angles\n3. Execute shots\n4. Control speed\n5. Perfect technique",
      },
      {
        name: "Cue Ball Control Drill",
        level: "Intermediate",
        description: "Advanced cue ball control for precise positioning.",
        imageUrl: POOL_TABLE_IMAGES[2],
        instructions: "1. Plan position\n2. Execute shot\n3. Control spin\n4. Master placement\n5. Increase difficulty",
      },
      {
        name: "Follow Shot Drill",
        level: "Intermediate",
        description: "Practice advanced follow shots with distance control.",
        imageUrl: POOL_TABLE_IMAGES[3],
        instructions: "1. Apply top spin\n2. Control distance\n3. Vary power\n4. Master technique\n5. Perfect control",
      },
      {
        name: "Cut Shot Drill",
        level: "Intermediate",
        description: "Practice challenging cut shots with position play.",
        imageUrl: POOL_TABLE_IMAGES[4],
        instructions: "1. Set up cuts\n2. Execute shots\n3. Control position\n4. Increase difficulty\n5. Master accuracy",
      },
      {
        name: "Killer Draw Drill",
        level: "Intermediate",
        description: "Advanced draw shots with precise position control.",
        imageUrl: POOL_TABLE_IMAGES[5],
        instructions: "1. Set up draw\n2. Execute shot\n3. Control distance\n4. Vary spin\n5. Perfect technique",
      },
      {
        name: "Two-Cushion Bank Shot",
        level: "Intermediate",
        description: "Practice complex two-cushion bank shots.",
        imageUrl: POOL_TABLE_IMAGES[6],
        instructions: "1. Plan path\n2. Calculate angles\n3. Execute shot\n4. Control speed\n5. Master angles",
      },
      {
        name: "Three-Ball Combination",
        level: "Intermediate",
        description: "Practice three-ball combination shots.",
        imageUrl: POOL_TABLE_IMAGES[7],
        instructions: "1. Set up combo\n2. Plan contact\n3. Execute shot\n4. Control speed\n5. Perfect accuracy",
      },
      {
        name: "Cue Ball Placement",
        level: "Intermediate",
        description: "Focus on precise cue ball placement after shots.",
        imageUrl: POOL_TABLE_IMAGES[0],
        instructions: "1. Plan position\n2. Execute shot\n3. Evaluate result\n4. Adjust technique\n5. Master control",
      },
      {
        name: "Position Play Drill",
        level: "Intermediate",
        description: "Practice position play for complex patterns.",
        imageUrl: POOL_TABLE_IMAGES[1],
        instructions: "1. Plan pattern\n2. Execute shots\n3. Control position\n4. Maintain sequence\n5. Run pattern",
      },
      {
        name: "Straight-Line Drill",
        level: "Intermediate",
        description: "Advanced straight-line control exercises.",
        imageUrl: POOL_TABLE_IMAGES[2],
        instructions: "1. Set up line\n2. Execute shots\n3. Maintain path\n4. Control speed\n5. Perfect technique",
      },
      {
        name: "Eight-Ball Pattern Play",
        level: "Intermediate",
        description: "Practice running eight-ball patterns effectively.",
        imageUrl: POOL_TABLE_IMAGES[3],
        instructions: "1. Plan sequence\n2. Execute pattern\n3. Control position\n4. Maintain control\n5. Clear table",
      },
      {
        name: "Multiple Object Balls",
        level: "Intermediate",
        description: "Practice position play with multiple object balls.",
        imageUrl: POOL_TABLE_IMAGES[4],
        instructions: "1. Set up pattern\n2. Plan sequence\n3. Execute shots\n4. Control position\n5. Complete pattern",
      },
      {
        name: "Long Shot Drill",
        level: "Intermediate",
        description: "Practice long-distance shots with position control.",
        imageUrl: POOL_TABLE_IMAGES[5],
        instructions: "1. Set up long shots\n2. Maintain accuracy\n3. Control position\n4. Perfect technique\n5. Master distance",
      },
      {
        name: "Safety Shot Drill",
        level: "Intermediate",
        description: "Practice defensive safety shots.",
        imageUrl: POOL_TABLE_IMAGES[6],
        instructions: "1. Plan safety\n2. Execute shot\n3. Control position\n4. Hide cue ball\n5. Master defense",
      },
      {
        name: "Break and Run Drill",
        level: "Intermediate",
        description: "Practice breaking and running the table.",
        imageUrl: POOL_TABLE_IMAGES[7],
        instructions: "1. Break rack\n2. Plan pattern\n3. Execute shots\n4. Maintain control\n5. Clear table",
      },

      // Advanced Drills
      {
        name: "The Perfect Break",
        level: "Advanced",
        description: "Master the break shot for tournament-level play.",
        imageUrl: POOL_TABLE_IMAGES[0],
        instructions: "1. Position break shot\n2. Execute power break\n3. Control spread\n4. Avoid scratch\n5. Master consistency",
      },
      {
        name: "Advanced Bank Shots",
        level: "Advanced",
        description: "Complex bank shots using multiple rails.",
        imageUrl: POOL_TABLE_IMAGES[1],
        instructions: "1. Plan bank path\n2. Calculate angles\n3. Execute shot\n4. Control speed\n5. Master precision",
      },
      {
        name: "Draw and Follow Shot",
        level: "Advanced",
        description: "Combine draw and follow shots in complex patterns.",
        imageUrl: POOL_TABLE_IMAGES[2],
        instructions: "1. Set up pattern\n2. Execute combo\n3. Control position\n4. Master technique\n5. Perfect control",
      },
      {
        name: "Advanced Cue Ball Control",
        level: "Advanced",
        description: "Master complex cue ball control scenarios.",
        imageUrl: POOL_TABLE_IMAGES[3],
        instructions: "1. Plan position\n2. Execute shot\n3. Control spin\n4. Perfect placement\n5. Master control",
      },
      {
        name: "One Rail, Two Rail, Three Rail",
        level: "Advanced",
        description: "Practice shots using multiple rail contacts.",
        imageUrl: POOL_TABLE_IMAGES[4],
        instructions: "1. Plan path\n2. Calculate angles\n3. Execute shot\n4. Control speed\n5. Master precision",
      },
      {
        name: "Position Play with Multiple Balls",
        level: "Advanced",
        description: "Complex position play with multiple ball patterns.",
        imageUrl: POOL_TABLE_IMAGES[5],
        instructions: "1. Plan sequence\n2. Execute pattern\n3. Control position\n4. Maintain accuracy\n5. Complete run",
      },
      {
        name: "Jump Shot Drill",
        level: "Advanced",
        description: "Master tournament-legal jump shots.",
        imageUrl: POOL_TABLE_IMAGES[6],
        instructions: "1. Set up jump\n2. Position cue\n3. Execute shot\n4. Control landing\n5. Perfect technique",
      },
      {
        name: "Combination Shot Drill",
        level: "Advanced",
        description: "Practice complex combination shots.",
        imageUrl: POOL_TABLE_IMAGES[7],
        instructions: "1. Plan combo\n2. Execute shot\n3. Control speed\n4. Master accuracy\n5. Perfect timing",
      },
      {
        name: "Advanced Safety Play",
        level: "Advanced",
        description: "Master defensive safety play techniques.",
        imageUrl: POOL_TABLE_IMAGES[0],
        instructions: "1. Plan safety\n2. Execute shot\n3. Hide cue ball\n4. Control distance\n5. Perfect defense",
      },
      {
        name: "Cluster Shot Drill",
        level: "Advanced",
        description: "Practice breaking out clustered balls effectively.",
        imageUrl: POOL_TABLE_IMAGES[1],
        instructions: "1. Analyze cluster\n2. Plan break out\n3. Execute shot\n4. Control spread\n5. Maintain position",
      },
      {
        name: "Two-Ball Position",
        level: "Advanced",
        description: "Advanced position play between distant balls.",
        imageUrl: POOL_TABLE_IMAGES[2],
        instructions: "1. Set up shots\n2. Plan position\n3. Execute shot\n4. Control distance\n5. Perfect placement",
      },
      {
        name: "Long Pot Drill",
        level: "Advanced",
        description: "Master long-distance pot shots.",
        imageUrl: POOL_TABLE_IMAGES[3],
        instructions: "1. Set up long shots\n2. Maintain accuracy\n3. Execute shot\n4. Control speed\n5. Perfect technique",
      },
      {
        name: "Advanced Break-and-Run",
        level: "Advanced",
        description: "Practice tournament-level break and run patterns.",
        imageUrl: POOL_TABLE_IMAGES[4],
        instructions: "1. Execute break\n2. Plan pattern\n3. Control position\n4. Maintain run\n5. Clear table",
      },
      {
        name: "Table Mapping",
        level: "Advanced",
        description: "Practice planning and executing complex patterns.",
        imageUrl: POOL_TABLE_IMAGES[5],
        instructions: "1. Analyze layout\n2. Plan pattern\n3. Execute shots\n4. Control position\n5. Complete pattern",
      },
      {
        name: "One-Pocket Practice",
        level: "Advanced",
        description: "Master one-pocket game strategies.",
        imageUrl: POOL_TABLE_IMAGES[6],
        instructions: "1. Control table\n2. Plan strategy\n3. Execute shots\n4. Maintain defense\n5. Win position",
      },
      {
        name: "Speed and Power Control",
        level: "Advanced",
        description: "Master precise speed and power control.",
        imageUrl: POOL_TABLE_IMAGES[7],
        instructions: "1. Vary power\n2. Control speed\n3. Execute shots\n4. Perfect touch\n5. Master control",
      },
      {
        name: "Tough Cut Shots",
        level: "Advanced",
        description: "Practice difficult cut shots at various angles.",
        imageUrl: POOL_TABLE_IMAGES[0],
        instructions: "1. Set up cuts\n2. Execute shots\n3. Control position\n4. Master angles\n5. Perfect technique",
      },
      {
        name: "Rail First Shot",
        level: "Advanced",
        description: "Practice shots where the cue ball hits the rail first.",
        imageUrl: POOL_TABLE_IMAGES[1],
        instructions: "1. Plan path\n2. Hit rail first\n3. Execute shot\n4. Control speed\n5. Master accuracy",
      },
      {
        name: "Safety and Counter Safety",
        level: "Advanced",
        description: "Practice advanced defensive strategies.",
        imageUrl: POOL_TABLE_IMAGES[2],
        instructions: "1. Plan safety\n2. Execute defense\n3. Counter safety\n4. Control position\n5. Master strategy",
      },
      {
        name: "Full Table Run-Out",
        level: "Advanced",
        description: "Practice complete table clearance patterns.",
        imageUrl: POOL_TABLE_IMAGES[3],
        instructions: "1. Plan pattern\n2. Execute shots\n3. Maintain position\n4. Control speed\n5. Clear table",
      },
    ];

    drillTemplates.forEach(drill => {
      this.createDrill(drill);
    });
  }

  // Users
  async getUser(id: number) {
    return this.users.get(id);
  }

  async createUser(user: InsertUser) {
    const id = this.currentIds.users++;
    const newUser = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }

  // Drills
  async getDrills() {
    return Array.from(this.drills.values());
  }

  async getDrillsByLevel(level: string) {
    return Array.from(this.drills.values()).filter(drill => drill.level === level);
  }

  async getDrill(id: number) {
    return this.drills.get(id);
  }

  async createDrill(drill: InsertDrill) {
    const id = this.currentIds.drills++;
    const newDrill = { ...drill, id };
    this.drills.set(id, newDrill);
    return newDrill;
  }

  // Practice Sessions
  async createPracticeSession(session: InsertPracticeSession) {
    const id = this.currentIds.sessions++;
    const newSession: PracticeSession = {
      ...session,
      id,
      userId: session.userId ?? null,
      drillId: session.drillId ?? null,
    };
    this.practiceSessions.set(id, newSession);
    return newSession;
  }

  async getPracticeSessions(userId: number) {
    return Array.from(this.practiceSessions.values()).filter(
      session => session.userId === userId
    );
  }

  // Playlists
  async getPlaylists(userId: number) {
    return Array.from(this.playlists.values()).filter(
      playlist => playlist.userId === userId
    );
  }

  async createPlaylist(playlist: InsertPlaylist) {
    const id = this.currentIds.playlists++;
    const newPlaylist: Playlist = {
      ...playlist,
      id,
      userId: playlist.userId ?? null,
      drills: Array.isArray(playlist.drills) ? playlist.drills : [],
    };
    this.playlists.set(id, newPlaylist);
    return newPlaylist;
  }

  // Achievements
  async getAchievements(userId: number) {
    return Array.from(this.achievements.values()).filter(
      achievement => achievement.userId === userId
    );
  }

  async createAchievement(achievement: InsertAchievement) {
    const id = this.currentIds.achievements++;
    const newAchievement: Achievement = {
      ...achievement,
      id,
      userId: achievement.userId ?? null,
    };
    this.achievements.set(id, newAchievement);
    return newAchievement;
  }

  // Journal
  async getJournalEntries(userId: number) {
    return Array.from(this.journalEntries.values()).filter(
      entry => entry.userId === userId
    );
  }

  async createJournalEntry(entry: InsertJournalEntry) {
    const id = this.currentIds.journal++;
    const newEntry: JournalEntry = {
      ...entry,
      id,
      userId: entry.userId ?? null,
    };
    this.journalEntries.set(id, newEntry);
    return newEntry;
  }
}

export const storage = new MemStorage();