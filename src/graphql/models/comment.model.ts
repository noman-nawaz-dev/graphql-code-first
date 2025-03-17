import { ObjectType, Field, ID } from "type-graphql";
import { Post } from "./post.model";
import { User } from "./user.model";
import { trusted } from "mongoose";

@ObjectType()
export class Comment {
  @Field((type) => ID)
  _id: string;

  @Field()
  description: string;

  @Field((type) => Post, { nullable: true })
  post?: Post;

  @Field((type) => User)
  user: User;

  @Field((type) => Date)
  createdAt: Date;
}
