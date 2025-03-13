import { Query, Resolver, Mutation } from "type-graphql";
import { User } from "../models/user.model";
import { UserService } from "../../services/user.service";

@Resolver(() => User)
export class UserResolver {
  @Query((returns) => [User])
  async users() {
    return await UserService.getUsers();
  }
}
