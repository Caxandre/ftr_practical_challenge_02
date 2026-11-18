import { gql } from "@apollo/client";
import { TRANSACTION_FIELDS } from "../fragments";

export const TRANSACTIONS_QUERY = gql`
  query Transactions($page: Int, $perPage: Int, $categoryId: ID, $type: TransactionType) {
    transactions(page: $page, perPage: $perPage, categoryId: $categoryId, type: $type) {
      total
      page
      perPage
      items {
        ...TransactionFields
      }
    }
  }
  ${TRANSACTION_FIELDS}
`;
