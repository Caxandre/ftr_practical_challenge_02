import { gql } from "@apollo/client";
import { CATEGORY_FIELDS } from "../fragments";

export const CREATE_CATEGORY_MUTATION = gql`
  mutation CreateCategory($data: CreateCategoryInput!) {
    createCategory(data: $data) {
      ...CategoryFields
    }
  }
  ${CATEGORY_FIELDS}
`;

export const UPDATE_CATEGORY_MUTATION = gql`
  mutation UpdateCategory($id: ID!, $data: UpdateCategoryInput!) {
    updateCategory(id: $id, data: $data) {
      ...CategoryFields
    }
  }
  ${CATEGORY_FIELDS}
`;

export const DELETE_CATEGORY_MUTATION = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`;
