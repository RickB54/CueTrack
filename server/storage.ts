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
    const drillTemplates = [
      // Beginner Drills
      {
        name: "Basic Straight Shot",
        level: "Beginner",
        description: "Master the fundamentals of straight shots from various distances",
        imageUrl: "https://images.unsplash.com/photo-1427097829427-56a905bf7004",
        instructions: "1. Place the cue ball 6 inches from the head rail\n2. Place an object ball in the center of the table\n3. Aim for a straight shot to any pocket\n4. Practice from different distances and angles\n5. Focus on maintaining a level cue and follow-through",
      },
      {
        name: "Stop Shot Practice",
        level: "Beginner",
        description: "Learn to control the cue ball by making it stop after contact",
        imageUrl: "https://images.unsplash.com/photo-1506359585186-16ff29581308",
        instructions: "1. Place the cue ball and object ball 12 inches apart\n2. Hit the center of the cue ball\n3. Strike with medium speed\n4. The cue ball should stop upon contact\n5. Practice until you can consistently stop the cue ball",
      },
      {
        name: "Center Table Pocketing",
        level: "Beginner",
        description: "Perfect your accuracy with shots from the center of the table",
        imageUrl: "https://images.unsplash.com/photo-1470376619031-a6791e534bf0",
        instructions: "1. Position object ball in the center of the table\n2. Place cue ball at various positions\n3. Practice pocketing to all six pockets\n4. Maintain consistent stroke speed\n5. Track your success rate",
      },
      // Add more beginner drills...

      // Intermediate Drills
      {
        name: "Draw Shot Control",
        level: "Intermediate",
        description: "Master drawing the cue ball back after contact",
        imageUrl: "https://images.unsplash.com/photo-1491510736257-3ad769ff47b6",
        instructions: "1. Place object ball near center spot\n2. Position cue ball 12-18 inches away\n3. Strike below center with follow through\n4. Practice different distances of draw\n5. Note the spin and speed relationship",
      },
      {
        name: "Rail Cut Shots",
        level: "Intermediate",
        description: "Improve your rail cut shot accuracy and position play",
        imageUrl: "https://images.unsplash.com/photo-1484791984053-c4abb3fd681b",
        instructions: "1. Place object ball near the rail\n2. Position cue ball for 30-45 degree cut\n3. Focus on hitting the rail first\n4. Control speed for position\n5. Vary cut angles and distances",
      },
      // Add more intermediate drills...

      // Advanced Drills
      {
        name: "Multi-Rail Position",
        level: "Advanced",
        description: "Advanced position play using multiple rails",
        imageUrl: "https://images.unsplash.com/photo-1495548054858-0e78bb72869e",
        instructions: "1. Set up a 3-ball pattern\n2. Plan multi-rail paths\n3. Execute with precise speed control\n4. Track cue ball path\n5. Adjust spin and speed as needed",
      },
      {
        name: "Jump Shot Mastery",
        level: "Advanced",
        description: "Perfect your jump shots for tournament play",
        imageUrl: "https://images.unsplash.com/photo-1600965962361-9035dbfd1c50",
        instructions: "1. Place blocker ball 6 inches from target\n2. Elevate cue 45-60 degrees\n3. Strike down sharply\n4. Practice legal jump technique\n5. Vary distances and angles",
      },
      // Add more advanced drills...
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