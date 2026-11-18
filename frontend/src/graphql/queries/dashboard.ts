import { gql } from "@apollo/client";
import { TRANSACTION_FIELDS } from "../fragments";

export const DASHBOARD_QUERY = gql`
  query Dashboard {
    dashboard {
      totalBalance
      monthlyIncome
      monthlyExpense
      recentTransactions {
        ...TransactionFields
      }
    }
  }
  ${TRANSACTION_FIELDS}
`;
