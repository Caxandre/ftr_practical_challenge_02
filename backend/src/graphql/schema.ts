import { authTypeDefs } from "./typeDefs/auth.graphql";
import { categoryTypeDefs } from "./typeDefs/category.graphql";
import { transactionTypeDefs } from "./typeDefs/transaction.graphql";

const baseTypeDefs = `#graphql
  scalar DateTime

  type Query {
    _empty: Boolean
  }

  type Mutation {
    _empty: Boolean
  }
`;

export const typeDefs = [baseTypeDefs, authTypeDefs, categoryTypeDefs, transactionTypeDefs];
