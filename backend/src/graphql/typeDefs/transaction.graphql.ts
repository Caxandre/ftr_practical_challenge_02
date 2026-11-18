export const transactionTypeDefs = `#graphql
  enum TransactionType {
    INCOME
    EXPENSE
  }

  type Transaction {
    id: ID!
    description: String!
    amount: Int!
    type: TransactionType!
    date: DateTime!
    category: Category!
    createdAt: DateTime!
  }

  type TransactionPage {
    items: [Transaction!]!
    total: Int!
    page: Int!
    perPage: Int!
  }

  type DashboardSummary {
    totalBalance: Int!
    monthlyIncome: Int!
    monthlyExpense: Int!
    recentTransactions: [Transaction!]!
  }

  input CreateTransactionInput {
    description: String!
    amount: Int!
    type: TransactionType!
    date: DateTime!
    categoryId: ID!
  }

  input UpdateTransactionInput {
    description: String
    amount: Int
    type: TransactionType
    date: DateTime
    categoryId: ID
  }

  extend type Query {
    transactions(page: Int = 1, perPage: Int = 10, categoryId: ID, type: TransactionType): TransactionPage!
    transaction(id: ID!): Transaction!
    dashboard: DashboardSummary!
  }

  extend type Mutation {
    createTransaction(data: CreateTransactionInput!): Transaction!
    updateTransaction(id: ID!, data: UpdateTransactionInput!): Transaction!
    deleteTransaction(id: ID!): Boolean!
  }
`;
