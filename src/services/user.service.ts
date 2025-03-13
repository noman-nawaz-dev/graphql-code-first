import { DatabaseService } from "./DatabaseService";
import { User } from "../database/schema";

export class UserService {
  static async getUsers() {
    return User.find({});
  }

  static async getUserById(id: string) {
    return User.findById(id);
  }
}
