import mongoose from "mongoose";

export class DatabaseManager {
  private static instance: DatabaseManager;
  public isConnected: boolean = false;

  private constructor() {}

  static getInstance() {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  async connect(mongoURI: string) {
    if (this.isConnected) return;

    try {
      await mongoose.connect(mongoURI, {
        maxPoolSize: 50,
        retryWrites: true,
      });
      this.isConnected = true;
      console.log("Database Connected Successfully");
    } catch (error) {
      console.error("Error connecting to database:", error);
      this.isConnected = false;
      throw error;
    }
  }

  getConnection() {
    if (!this.isConnected) {
      throw new Error("Database not connected. Call connect() first.");
    }
    return mongoose.connection.db;
  }
}
