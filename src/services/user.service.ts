import { User } from "../database/schema";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Service } from "typedi";

@Service()
export class UserService {
  async getUsers() {
    return await User.find({});
  }

  async getUserById(id: string) {
    const user = await User.findById(id);
    return user;
  }

  async getUserByEmail(email: string) {
    return await User.findOne({ email });
  }

  async getUserToken(email: string, password: string) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new Error("User with this email not found");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }
    return jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
  }
}
