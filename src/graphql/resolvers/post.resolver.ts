import { Resolver, FieldResolver, Query, Root } from "type-graphql";
import { Post } from "../models/post.model";
import { PostService } from "../../services/post.service";
import { UserService } from "../../services/user.service";
import { User } from "../models/user.model";
import { PostDocument } from "../interfaces/context.interface";
import { Service } from "typedi";

@Service()
@Resolver(() => Post)
export class PostResolver {
  constructor(
    private postService: PostService,
    private userService: UserService
  ) {}
  @Query((returns) => [Post])
  async posts() {
    return await this.postService.getPosts();
  }

  @FieldResolver((type) => User)
  async user(@Root() post: PostDocument) {
    return await this.userService.getUserById(post.user);
  }
}
