import { gql } from "@apollo/client";

const AUTH_PAYLOAD_FIELDS = gql`
  fragment AuthPayloadFields on AuthPayload {
    token
    user {
      id
      name
      email
      avatarUrl
      createdAt
    }
  }
`;

export const SIGN_UP_MUTATION = gql`
  mutation SignUp($data: SignUpInput!) {
    signUp(data: $data) {
      ...AuthPayloadFields
    }
  }
  ${AUTH_PAYLOAD_FIELDS}
`;

export const SIGN_IN_MUTATION = gql`
  mutation SignIn($data: SignInInput!) {
    signIn(data: $data) {
      ...AuthPayloadFields
    }
  }
  ${AUTH_PAYLOAD_FIELDS}
`;

export const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($data: UpdateProfileInput!) {
    updateProfile(data: $data) {
      id
      name
      email
      avatarUrl
      createdAt
    }
  }
`;
