import { DateTimeResolver } from "graphql-scalars";
import { authResolvers } from "./auth.resolver";
import { categoryResolvers } from "./category.resolver";
import { transactionResolvers } from "./transaction.resolver";

export const resolvers = {
  DateTime: DateTimeResolver,
  Query: {
    ...authResolvers.Query,
    ...categoryResolvers.Query,
    ...transactionResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...categoryResolvers.Mutation,
    ...transactionResolvers.Mutation,
  },
  Category: {
    ...transactionResolvers.Category,
  },
};
