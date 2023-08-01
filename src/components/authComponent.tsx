"use client";
import { useAuthContext } from "@/app/auth/context";

interface AuthComponentProps {
  loading: JSX.Element;
  authenticated: JSX.Element;
  unauthenticated: JSX.Element;
}

// use this component if you need a loading state, an authenticated state, and an unauthenticated state.
// Do not use this component for protected routes (that is taken care of by middleware)
export const AuthComponent = (props: AuthComponentProps): JSX.Element => {
  const { loading, user } = useAuthContext();

  if (loading) {
    return props.loading;
  }

  if (user) {
    return props.authenticated;
  } else {
    return props.unauthenticated;
  }
};
