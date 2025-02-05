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
        description: "Focus on cue ball control and stroke accuracy",
        imageUrl: POOL_TABLE_IMAGES[0],
        instructions: "1. Set up a cue ball and object ball in a straight line along the table\n2. Aim to pocket the ball into a corner pocket\n3. Make sure the cue ball travels in a straight line\n4. Repeat from different distances",
      },
      {
        name: "Stop Shot Drill",
        level: "Beginner",
        description: "Focus on cue ball control and accuracy",
        imageUrl: POOL_TABLE_IMAGES[1],
        instructions: "1. Set the cue ball and object ball near each other\n2. Hit the object ball to make it into the pocket\n3. Make the cue ball stop in its tracks after impact\n4. Practice with no follow or draw",
      },
      {
        name: "Cut Shot Drill",
        level: "Beginner",
        description: "Focus on aiming and cutting accuracy",
        imageUrl: POOL_TABLE_IMAGES[2],
        instructions: "1. Position the object ball at an angle to a pocket\n2. Practice hitting it with a cut shot\n3. Make the object ball into the pocket\n4. Vary the angles to increase difficulty",
      },
      {
        name: "One-Cushion Bank Shot",
        level: "Beginner",
        description: "Focus on rail shots and angle calculation",
        imageUrl: POOL_TABLE_IMAGES[3],
        instructions: "1. Place the object ball near a rail\n2. Aim to bank it off the cushion into a pocket\n3. Practice different angles\n4. Focus on consistent power",
      },
      {
        name: "Cue Ball Follow Drill",
        level: "Beginner",
        description: "Focus on cue ball movement and top spin control",
        imageUrl: POOL_TABLE_IMAGES[4],
        instructions: "1. Set up an object ball and cue ball\n2. Use the follow shot technique (hitting with top spin)\n3. Follow the object ball into the pocket\n4. Practice controlling follow distance",
      },
      // Add remaining 15 beginner drills...

      // Intermediate Drills
      {
        name: "Bank Shot Drill",
        level: "Intermediate",
        description: "Focus on angle calculation and rail shots",
        imageUrl: POOL_TABLE_IMAGES[5],
        instructions: "1. Set up an object ball near a rail\n2. Practice banking it into a pocket at various angles\n3. Focus on consistent power\n4. Master different banking angles",
      },
      {
        name: "Ghost Ball Drill",
        level: "Intermediate",
        description: "Focus on aiming and visualization",
        imageUrl: POOL_TABLE_IMAGES[6],
        instructions: "1. Visualize the 'ghost ball' position\n2. Align your shot to that imagined ball\n3. Practice hitting the exact contact point\n4. Verify accuracy of visualization",
      },
      {
        name: "Draw Shot Drill",
        level: "Intermediate",
        description: "Focus on cue ball spin and backspin control",
        imageUrl: POOL_TABLE_IMAGES[7],
        instructions: "1. Practice drawing the cue ball backward after hitting an object ball\n2. Start with simple shots\n3. Gradually increase difficulty\n4. Master different draw distances",
      },
      // Add remaining 17 intermediate drills...

      // Advanced Drills
      {
        name: "The Perfect Break Drill",
        level: "Advanced",
        description: "Focus on break shot technique and power control",
        imageUrl: POOL_TABLE_IMAGES[0],
        instructions: "1. Practice breaking the rack from the head spot\n2. Aim to spread the balls evenly\n3. Avoid scratches\n4. Focus on consistent power and accuracy",
      },
      {
        name: "Advanced Bank Shots",
        level: "Advanced",
        description: "Focus on rail control and angle calculation",
        imageUrl: POOL_TABLE_IMAGES[1],
        instructions: "1. Practice complex bank shots\n2. Make object ball bounce off multiple rails\n3. Pocket the ball\n4. Master various angles and speeds",
      },
      {
        name: "Draw and Follow Shot Drill",
        level: "Advanced",
        description: "Focus on advanced cue ball manipulation",
        imageUrl: POOL_TABLE_IMAGES[2],
        instructions: "1. Combine draw and follow shots\n2. Alternate between drawing back and following through\n3. Control positioning for next shot\n4. Practice different speeds and distances",
      },
      // Add remaining 17 advanced drills...
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