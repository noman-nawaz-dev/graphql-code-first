import { Arg, ArgsType, Field } from "type-graphql";
import { IsEmail, Length } from "class-validator";

@ArgsType()
export class LoginArgs {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @Length(8, 20)
  password: string;
}

@ArgsType()
export class EmailInput {
  @Field()
  @IsEmail()
  email: string;
}
