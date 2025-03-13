import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user.resolver";
import { PostResolver } from "./resolvers/post.resolver";
import { ApolloServer, BaseContext } from "@apollo/server";
import { registerEnumType } from "type-graphql";
import { UserRole } from "./enums/user-role.enum";
import path from "path";

function registerAllEnums() {
  registerEnumType(UserRole, {
    name: "UserRole",
  });
}

async function bootstrapSchema() {
  registerAllEnums();
  const schema = await buildSchema({
    resolvers: [UserResolver, PostResolver],
    emitSchemaFile: {
      path: path.resolve(__dirname, "../../schema.graphql"),
      sortedSchema: true,
    },
  });

  return schema;
}

export async function connectToGraphQL() {
  const server = new ApolloServer<BaseContext>({
    schema: await bootstrapSchema(),
  });
  await server.start();
  return server;
}
