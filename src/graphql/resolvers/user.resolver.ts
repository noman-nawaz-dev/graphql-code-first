import { Query, Resolver, Mutation, Arg, Args } from "type-graphql";
import { User } from "../models/user.model";
import { UserService } from "../../services/user.service";
import { Service } from "typedi";
import { EmailInput, LoginArgs } from "../models/user.input";

@Service()
@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}
  @Query((returns) => [User])
  async users() {
    return await this.userService.getUsers();
  }

  @Query((returns) => String)
  async getUserToken(@Args() { email, password }: LoginArgs) {
    return await this.userService.getUserToken(email, password);
  }

  @Query((returns) => User)
  async getUserByEmail(@Args() { email }: EmailInput) {
    return await this.userService.getUserByEmail(email);
  }
}
