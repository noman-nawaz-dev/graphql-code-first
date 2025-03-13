import { ObjectType, Field, ID, registerEnumType } from "type-graphql";
import { UserRole } from "../enums/user-role.enum";

// @ObjectType("SuperUser") Rename object type User to SuperUser for external use
@ObjectType()
export class User {
  @Field((type) => ID)
  _id: string;

  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field({ nullable: true })
  bio?: string;

  @Field((type) => UserRole)
  role: UserRole;
}
