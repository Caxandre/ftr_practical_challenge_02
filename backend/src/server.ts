import "dotenv/config";
import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import { GraphQLError } from "graphql";
import { ZodError } from "zod";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import { createContext } from "./context";

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN ?? "http://localhost:5173";
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

async function main() {
  const app = express();

  app.use(
    cors({
      origin: FRONTEND_ORIGIN,
      credentials: true,
    })
  );
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    includeStacktraceInErrorResponses: false,
    formatError: (formattedError, error) => {
      const original = (error as GraphQLError)?.originalError ?? error;

      if (original instanceof ZodError) {
        const message = original.issues[0]?.message ?? "Dados inválidos";
        return {
          message,
          extensions: { code: "VALIDATION_ERROR" },
        };
      }

      // Nunca deixar vazar stack trace/mensagem crua de erros internos (ex.: Prisma).
      if (!formattedError.extensions?.code || formattedError.extensions.code === "INTERNAL_SERVER_ERROR") {
        return {
          message: "Erro interno do servidor",
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        };
      }

      const { stacktrace: _stacktrace, ...safeExtensions } = formattedError.extensions;
      return { ...formattedError, extensions: safeExtensions };
    },
  });

  await server.start();

  app.use("/graphql", expressMiddleware(server, { context: createContext }));

  app.listen(PORT, () => {
    console.log(`🚀 Financy API pronta em http://localhost:${PORT}/graphql`);
  });
}

main().catch((err) => {
  console.error("Falha ao iniciar o servidor:", err);
  process.exit(1);
});
