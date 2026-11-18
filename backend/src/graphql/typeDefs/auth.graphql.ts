export const authTypeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
    avatarUrl: String
    createdAt: DateTime!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input SignUpInput {
    name: String!
    email: String!
    password: String!
  }

  input SignInInput {
    email: String!
    password: String!
  }

  input UpdateProfileInput {
    name: String
    email: String
    password: String
  }

  extend type Query {
    me: User!
  }

  extend type Mutation {
    signUp(data: SignUpInput!): AuthPayload!
    signIn(data: SignInInput!): AuthPayload!
    updateProfile(data: UpdateProfileInput!): User!
  }
`;
