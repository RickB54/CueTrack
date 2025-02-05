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
      {
        name: "Basic Straight Shot",
        level: "Beginner",
        description: "Practice straight shots from different distances",
        imageUrl: "https://images.unsplash.com/photo-1427097829427-56a905bf7004",
        instructions: "Place the cue ball and object ball in a straight line to any pocket. Practice hitting straight shots from varying distances.",
      },
      // Add more drill templates here
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