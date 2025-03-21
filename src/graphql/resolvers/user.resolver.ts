import {
  Query,
  Resolver,
  Mutation,
  Arg,
  Args,
  UseMiddleware,
} from "type-graphql";
import { User } from "../models/user.model";
import { UserService } from "../../services/user.service";
import { Service } from "typedi";
import { EmailInput, LoginArgs } from "../models/user.input";
import {
  ErrorInterceptor,
  LogAccess,
  ResolveTime,
} from "../middleware/middleware";
import { rootSelectedFields } from "../decorators/customDecorators";

@Service()
@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}
  @UseMiddleware(ResolveTime, LogAccess, ErrorInterceptor)
  @Query((returns) => [User])
  async users(@rootSelectedFields() fields: Record<string, 1>) {
    return await this.userService.getUsers(fields);
  }

  @UseMiddleware(ResolveTime, LogAccess, ErrorInterceptor)
  @Query((returns) => String)
  async getUserToken(@Args() { email, password }: LoginArgs) {
    return await this.userService.getUserToken(email, password);
  }
  @UseMiddleware(ResolveTime, LogAccess, ErrorInterceptor)
  @Query((returns) => User)
  async getUserByEmail(
    @Args() { email }: EmailInput,
    @rootSelectedFields() fields: Record<string, 1>
  ) {
    return await this.userService.getUserByEmail(email, fields);
  }
}
