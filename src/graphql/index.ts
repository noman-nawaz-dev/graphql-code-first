import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user.resolver";
import { PostResolver } from "./resolvers/post.resolver";
import { CommentResolver } from "./resolvers/comment.resolver";
import { ApolloServer, BaseContext } from "@apollo/server";
import { registerEnumType } from "type-graphql";
import { UserRole } from "./enums/user-role.enum";
import { Context } from "./interfaces/context.interface";
import { CustomAuthChecker } from "../auth/customAuthChecker";
import { LogAccess, ResolveTime } from "./middleware/middleware";
import jwt, { JwtPayload } from "jsonwebtoken";
import Container from "typedi";
import path from "path";

function registerAllEnums() {
  registerEnumType(UserRole, {
    name: "UserRole",
  });
}

async function bootstrapSchema() {
  registerAllEnums();
  const schema = await buildSchema({
    resolvers: [UserResolver, PostResolver, CommentResolver],
    container: Container,
    authChecker: CustomAuthChecker,
    // globalMiddlewares: [LogAccess, ResolveTime],
    validate: true,
    emitSchemaFile: {
      path: path.resolve(__dirname, "../../schema.graphql"),
      sortedSchema: true,
    },
  });

  return schema;
}

export async function connectToGraphQL() {
  const server = new ApolloServer<Context>({
    schema: await bootstrapSchema(),
  });
  await server.start();
  return server;
}

export const graphQLContext = async ({ req }: { req: any }) => {
  const token = req.headers.authorization;
  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    if (!decoded.userId) throw new Error("Invalid token");
    // Return an object with userId property
    return { userId: decoded.userId };
  }
  // Return an object with undefined userId
  return { userId: undefined };
};
