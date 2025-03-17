import { Field, InputType } from "type-graphql";

@InputType()
export class CreateCommentInput {
  @Field((type) => String)
  description: string;

  @Field((type) => String)
  post: string;
}
