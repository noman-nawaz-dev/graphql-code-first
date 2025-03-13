import { DatabaseManager } from "../config/database";

export class DatabaseService {
  protected static get db() {
    return DatabaseManager.getInstance().getConnection();
  }
}
