import { ApolloClient, HttpLink, InMemoryCache, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { TOKEN_STORAGE_KEY } from "../contexts/AuthContext";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

const httpLink = new HttpLink({ uri: BACKEND_URL });

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY) ?? sessionStorage.getItem(TOKEN_STORAGE_KEY);
  return {
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});

/** Notificado por AuthProvider; limpa a sessão em erros UNAUTHENTICATED. */
let onUnauthenticated: (() => void) | null = null;
export function setUnauthenticatedHandler(handler: () => void) {
  onUnauthenticated = handler;
}

const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors?.some((err) => err.extensions?.code === "UNAUTHENTICATED")) {
    onUnauthenticated?.();
  }
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});
