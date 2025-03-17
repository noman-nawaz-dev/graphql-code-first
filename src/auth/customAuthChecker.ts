import { AuthCheckerInterface, ResolverData } from "type-graphql";
import { Context } from "../graphql/interfaces/context.interface";
import { UserService } from "../services/user.service";
import { Service } from "typedi";

@Service()
export class CustomAuthChecker implements AuthCheckerInterface<Context> {
  constructor(private readonly userService: UserService) {}

  async check(
    { context }: ResolverData<Context>,
    roles: string[]
  ): Promise<boolean> {
    const { userId } = context;
    if (!userId) {
      return false;
    }

    const user = await this.userService.getUserById(userId);
    if (!user) {
      return false;
    }

    if (roles.length === 0) {
      return true;
    }

    if (roles.includes("ADMIN") && user.isAdmin) {
      return true;
    }

    return false;
  }
}
