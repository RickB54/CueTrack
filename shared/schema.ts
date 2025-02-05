import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const drills = pgTable("drills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  level: text("level").notNull(), // Beginner, Intermediate, Advanced
  description: text("description").notNull(),
  imageUrl: text("imageUrl").notNull(),
  instructions: text("instructions").notNull(),
});

export const practiceSession = pgTable("practice_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  drillId: integer("drill_id").references(() => drills.id),
  duration: integer("duration").notNull(), // in seconds
  successfulShots: integer("successful_shots").notNull(),
  missedShots: integer("missed_shots").notNull(),
  date: timestamp("date").notNull(),
});

export const playlists = pgTable("playlists", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  drills: json("drills").notNull().$type<number[]>(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  type: text("type").notNull(),
  earnedDate: timestamp("earned_date").notNull(),
});

export const journalEntries = pgTable("journal_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  content: text("content").notNull(),
  date: timestamp("date").notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users);
export const insertDrillSchema = createInsertSchema(drills);
export const insertPracticeSessionSchema = createInsertSchema(practiceSession);
export const insertPlaylistSchema = createInsertSchema(playlists);
export const insertAchievementSchema = createInsertSchema(achievements);
export const insertJournalEntrySchema = createInsertSchema(journalEntries);

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Drill = typeof drills.$inferSelect;
export type InsertDrill = z.infer<typeof insertDrillSchema>;
export type PracticeSession = typeof practiceSession.$inferSelect;
export type InsertPracticeSession = z.infer<typeof insertPracticeSessionSchema>;
export type Playlist = typeof playlists.$inferSelect;
export type InsertPlaylist = z.infer<typeof insertPlaylistSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;
