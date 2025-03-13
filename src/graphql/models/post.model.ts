import { ObjectType, ID, Field } from "type-graphql";
import { User } from "./user.model";

@ObjectType()
export class Post {
  @Field((type) => ID)
  _id: string;

  @Field()
  title: string;

  @Field()
  category: string;

  @Field()
  description: string;

  @Field((type) => User)
  user: User;
}
