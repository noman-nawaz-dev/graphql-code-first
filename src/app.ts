import "reflect-metadata";
import express from "express";
import { config } from "dotenv";
import { connectToGraphQL } from "./graphql";
import { DatabaseManager } from "./config/database";
import cors from "cors";
import { expressMiddleware } from "@apollo/server/express4";
import { graphQLContext } from "./graphql";
config({ path: `.env.${process.env.NODE_ENV}` || ".env.dev" });

const PORT = process.env.PORT || 4000;
const app = express();

DatabaseManager.getInstance().connect(process.env.MONGO_URI!);

async function startServer() {
  const server = await connectToGraphQL();
  app.use(
    "/graphql",
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: graphQLContext,
    }) as any
  );
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/graphql`);
  });
}

startServer();
