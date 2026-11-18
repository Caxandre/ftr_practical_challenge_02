import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useApolloClient, useLazyQuery, useMutation } from "@apollo/client";
import { ME_QUERY } from "../graphql/queries/auth";
import { SIGN_IN_MUTATION, SIGN_UP_MUTATION } from "../graphql/mutations/auth";
import { setUnauthenticatedHandler } from "../graphql/client";

export const TOKEN_STORAGE_KEY = "financy:token";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  createdAt: string;
}

interface SignInInput {
  email: string;
  password: string;
  remember?: boolean;
}

interface SignUpInput {
  name: string;
  email: string;
  password: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  signIn: (data: SignInInput) => Promise<void>;
  signUp: (data: SignUpInput) => Promise<void>;
  signOut: () => void;
  setUser: (user: AuthUser) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const apolloClient = useApolloClient();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [fetchMe] = useLazyQuery(ME_QUERY, { fetchPolicy: "network-only" });
  const [signInMutation] = useMutation(SIGN_IN_MUTATION);
  const [signUpMutation] = useMutation(SIGN_UP_MUTATION);

  const signOut = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
    apolloClient.clearStore().catch(() => {});
  }, [apolloClient]);

  useEffect(() => {
    setUnauthenticatedHandler(signOut);
  }, [signOut]);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY) ?? sessionStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }

    fetchMe()
      .then(({ data, error }) => {
        if (error || !data?.me) {
          signOut();
        } else {
          setUser(data.me);
        }
      })
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = useCallback(
    async (data: SignInInput) => {
      const { remember = false, ...credentials } = data;
      const result = await signInMutation({ variables: { data: credentials } });
      const payload = result.data?.signIn;
      if (!payload) throw new Error("Falha ao autenticar");

      const tokenStorage = remember ? localStorage : sessionStorage;
      const otherStorage = remember ? sessionStorage : localStorage;
      otherStorage.removeItem(TOKEN_STORAGE_KEY);
      tokenStorage.setItem(TOKEN_STORAGE_KEY, payload.token);
      setUser(payload.user);
    },
    [signInMutation]
  );

  const signUp = useCallback(
    async (data: SignUpInput) => {
      const result = await signUpMutation({ variables: { data } });
      const payload = result.data?.signUp;
      if (!payload) throw new Error("Falha ao cadastrar");
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.setItem(TOKEN_STORAGE_KEY, payload.token);
      setUser(payload.user);
    },
    [signUpMutation]
  );

  const value = useMemo(
    () => ({ user, isLoading, signIn, signUp, signOut, setUser }),
    [user, isLoading, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
