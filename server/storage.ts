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
        description: "Set the cue ball and object ball near each other. The goal is to make the object ball and stop the cue ball in its tracks after impact.",
        imageUrl: POOL_TABLE_IMAGES[1],
        instructions: "1. Set the cue ball and object ball near each other\n2. Hit the object ball with center cue ball contact\n3. The goal is to make the object ball stop immediately after impact\n4. Practice with no follow or draw\n5. Focus on cue ball control and accuracy",
      },
      {
        name: "Cut Shot Drill",
        level: "Beginner",
        description: "Position the object ball at an angle to a pocket and practice hitting it with a cut shot.",
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
        description: "Practice using the follow shot technique to follow the object ball after contact.",
        imageUrl: POOL_TABLE_IMAGES[4],
        instructions: "1. Set up an object ball and cue ball\n2. Hit above center on the cue ball\n3. Make the cue ball follow the object ball\n4. Focus on top spin control\n5. Practice different follow distances",
      },
      {
        name: "Straight Line Drill",
        level: "Beginner",
        description: "Practice pocketing balls in a straight line while maintaining cue ball control.",
        imageUrl: POOL_TABLE_IMAGES[5],
        instructions: "1. Set up several object balls in a straight line\n2. Pocket them in sequence\n3. Keep the cue ball traveling straight\n4. Focus on consistency\n5. Master cue ball positioning",
      },
      {
        name: "Ball in Hand Drill",
        level: "Beginner",
        description: "Practice position play by placing the cue ball anywhere on the table.",
        imageUrl: POOL_TABLE_IMAGES[6],
        instructions: "1. Place cue ball anywhere on the table\n2. Practice pocketing balls\n3. Focus on positioning for next shot\n4. Learn basic position play\n5. Practice shot selection",
      },
      {
        name: "Billiard Drill",
        level: "Beginner",
        description: "Practice making the cue ball hit multiple object balls in sequence.",
        imageUrl: POOL_TABLE_IMAGES[7],
        instructions: "1. Set up multiple object balls\n2. Hit first object ball\n3. Make it contact second ball\n4. Return to hit first ball\n5. Focus on ball-to-ball control",
      },
      {
        name: "Bridge Practice Drill",
        level: "Beginner",
        description: "Practice different bridge techniques for various shot positions.",
        imageUrl: POOL_TABLE_IMAGES[0],
        instructions: "1. Place cue ball in different positions\n2. Practice open bridge\n3. Practice closed bridge\n4. Use mechanical bridge when needed\n5. Focus on stability and control",
      },
      {
        name: "Two-Pocket Drill",
        level: "Beginner",
        description: "Practice making shots into alternating pockets to improve versatility.",
        imageUrl: POOL_TABLE_IMAGES[1],
        instructions: "1. Set up object ball near pocket\n2. Make it into one pocket\n3. Repeat to another pocket\n4. Practice until fluid\n5. Focus on consistency",
      },
      // ... Continue with remaining beginner drills

      // Intermediate Drills
      {
        name: "Bank Shot Drill",
        level: "Intermediate",
        description: "Practice banking balls off rails with precise angle calculation.",
        imageUrl: POOL_TABLE_IMAGES[2],
        instructions: "1. Set up object ball near rail\n2. Calculate banking angle\n3. Execute bank shot\n4. Practice various angles\n5. Master rail shots",
      },
      {
        name: "Ghost Ball Drill",
        level: "Intermediate",
        description: "Practice visualizing the ghost ball position for precise hits.",
        imageUrl: POOL_TABLE_IMAGES[3],
        instructions: "1. Visualize ghost ball position\n2. Align shot properly\n3. Execute with precision\n4. Verify contact point\n5. Improve visualization skills",
      },
      // ... Continue with remaining intermediate drills

      // Advanced Drills
      {
        name: "Perfect Break Drill",
        level: "Advanced",
        description: "Master the break shot for consistent ball spread and control.",
        imageUrl: POOL_TABLE_IMAGES[4],
        instructions: "1. Practice break from head spot\n2. Focus on ball spread\n3. Avoid scratching\n4. Control power\n5. Achieve consistency",
      },
      {
        name: "Advanced Bank Shots",
        level: "Advanced",
        description: "Execute complex bank shots using multiple rails.",
        imageUrl: POOL_TABLE_IMAGES[5],
        instructions: "1. Set up challenging bank shots\n2. Use multiple rails\n3. Calculate precise angles\n4. Control speed\n5. Master position play",
      },
      // ... Continue with remaining advanced drills
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