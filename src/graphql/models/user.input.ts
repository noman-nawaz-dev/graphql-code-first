import { Arg, ArgsType, Field } from "type-graphql";
import { IsEmail, Length } from "class-validator";

@ArgsType()
export class LoginArgs {
  @Field()
  @IsEmail({}, { message: "Invalid email format" })
  email: string;

  @Field()
  @Length(8, 20, {
    message: "Password must be between 8 and 20 characters",
  })
  password: string;
}

@ArgsType()
export class EmailInput {
  @Field()
  @IsEmail()
  email: string;
}
