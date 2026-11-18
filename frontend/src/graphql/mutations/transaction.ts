import { gql } from "@apollo/client";
import { TRANSACTION_FIELDS } from "../fragments";

export const CREATE_TRANSACTION_MUTATION = gql`
  mutation CreateTransaction($data: CreateTransactionInput!) {
    createTransaction(data: $data) {
      ...TransactionFields
    }
  }
  ${TRANSACTION_FIELDS}
`;

export const UPDATE_TRANSACTION_MUTATION = gql`
  mutation UpdateTransaction($id: ID!, $data: UpdateTransactionInput!) {
    updateTransaction(id: $id, data: $data) {
      ...TransactionFields
    }
  }
  ${TRANSACTION_FIELDS}
`;

export const DELETE_TRANSACTION_MUTATION = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`;
