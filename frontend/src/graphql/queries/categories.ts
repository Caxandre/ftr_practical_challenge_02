import { gql } from "@apollo/client";
import { CATEGORY_FIELDS } from "../fragments";

export const CATEGORIES_QUERY = gql`
  query Categories {
    categories {
      ...CategoryFields
    }
  }
  ${CATEGORY_FIELDS}
`;
