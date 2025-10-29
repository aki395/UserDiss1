import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/users", async (req, res) => {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/users");
      
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }
      
      const users = await response.json();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users from JSONPlaceholder:", error);
      res.status(500).json({ 
        error: "Failed to fetch users",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
