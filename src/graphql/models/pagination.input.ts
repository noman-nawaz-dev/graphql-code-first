import { ArgsType, Field, Int, InputType } from "type-graphql";

@ArgsType()
export class PaginationArgs {
  @Field((type) => Int, { nullable: true })
  skip?: number = 0;

  @Field((type) => Int, { nullable: true })
  take?: number;
}
