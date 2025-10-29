// Storage is not used in this application since we fetch data directly from JSONPlaceholder API
// This file is kept for potential future use if local storage is needed

export interface IStorage {
  // Add storage methods here if needed
}

export class MemStorage implements IStorage {
  constructor() {
    // Initialize storage if needed
  }
}

export const storage = new MemStorage();
