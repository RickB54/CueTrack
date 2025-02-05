import { Router, type Request, type Response } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertDrillSchema, insertPracticeSessionSchema, insertPlaylistSchema, insertJournalEntrySchema } from "@shared/schema";

export function registerRoutes(app: Router) {
  // Drills
  app.get("/drills", async (req: Request, res: Response) => {
    const level = req.query.level as string | undefined;
    const drills = level ? 
      await storage.getDrillsByLevel(level) :
      await storage.getDrills();
    res.json(drills);
  });

  app.get("/drills/:id", async (req: Request, res: Response) => {
    const drill = await storage.getDrill(parseInt(req.params.id));
    if (!drill) {
      res.status(404).json({ message: "Drill not found" });
      return;
    }
    res.json(drill);
  });

  // Practice Sessions
  app.post("/practice-sessions", async (req: Request, res: Response) => {
    const parsed = insertPracticeSessionSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Invalid practice session data" });
      return;
    }
    const session = await storage.createPracticeSession(parsed.data);
    res.json(session);
  });

  app.get("/practice-sessions", async (req: Request, res: Response) => {
    const userId = parseInt(req.query.userId as string);
    const sessions = await storage.getPracticeSessions(userId);
    res.json(sessions);
  });

  // Playlists
  app.get("/playlists", async (req: Request, res: Response) => {
    const userId = parseInt(req.query.userId as string);
    const playlists = await storage.getPlaylists(userId);
    res.json(playlists);
  });

  app.post("/playlists", async (req: Request, res: Response) => {
    const parsed = insertPlaylistSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Invalid playlist data" });
      return;
    }
    const playlist = await storage.createPlaylist(parsed.data);
    res.json(playlist);
  });

  // Achievements
  app.get("/achievements", async (req: Request, res: Response) => {
    const userId = parseInt(req.query.userId as string);
    const achievements = await storage.getAchievements(userId);
    res.json(achievements);
  });

  // Journal
  app.get("/journal", async (req: Request, res: Response) => {
    const userId = parseInt(req.query.userId as string);
    const entries = await storage.getJournalEntries(userId);
    res.json(entries);
  });

  app.post("/journal", async (req: Request, res: Response) => {
    try {
      const parsed = insertJournalEntrySchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ 
          message: "Invalid journal entry data",
          errors: parsed.error.errors 
        });
        return;
      }
      const entry = await storage.createJournalEntry(parsed.data);
      res.json(entry);
    } catch (error) {
      console.error("Error creating journal entry:", error);
      res.status(500).json({ message: "Failed to create journal entry" });
    }
  });

  return app;
}