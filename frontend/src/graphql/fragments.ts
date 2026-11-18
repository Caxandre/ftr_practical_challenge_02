import { gql } from "@apollo/client";

export const CATEGORY_FIELDS = gql`
  fragment CategoryFields on Category {
    id
    name
    description
    color
    icon
    transactionsCount
    totalAmount
    createdAt
  }
`;

export const TRANSACTION_FIELDS = gql`
  fragment TransactionFields on Transaction {
    id
    description
    amount
    type
    date
    createdAt
    category {
      ...CategoryFields
    }
  }
  ${CATEGORY_FIELDS}
`;
