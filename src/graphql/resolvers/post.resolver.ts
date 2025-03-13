import { Resolver, FieldResolver, Query, Root } from "type-graphql";
import { Post } from "../models/post.model";
import { PostService } from "../../services/post.service";
import { UserService } from "../../services/user.service";
import { User } from "../models/user.model";

interface PostDocument {
  _id: string;
  title: string;
  category: string;
  description: string;
  user: string;
}

@Resolver(() => Post)
export class PostResolver {
  @Query((returns) => [Post])
  async posts() {
    return await PostService.getPosts();
  }

  @FieldResolver((type) => User)
  async user(@Root() post: PostDocument) {
    return await UserService.getUserById(post.user);
  }
}
