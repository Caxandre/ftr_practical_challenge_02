export const categoryTypeDefs = `#graphql
  enum CategoryColor {
    GRAY
    BLUE
    PURPLE
    PINK
    RED
    ORANGE
    YELLOW
    GREEN
  }

  type Category {
    id: ID!
    name: String!
    description: String
    color: CategoryColor!
    icon: String!
    transactionsCount: Int!
    totalAmount: Int!
    createdAt: DateTime!
  }

  input CreateCategoryInput {
    name: String!
    description: String
    color: CategoryColor!
    icon: String!
  }

  input UpdateCategoryInput {
    name: String
    description: String
    color: CategoryColor
    icon: String
  }

  extend type Query {
    categories: [Category!]!
    category(id: ID!): Category!
  }

  extend type Mutation {
    createCategory(data: CreateCategoryInput!): Category!
    updateCategory(id: ID!, data: UpdateCategoryInput!): Category!
    deleteCategory(id: ID!): Boolean!
  }
`;
