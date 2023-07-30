"use client";
import { useAuthContext } from "@/app/auth/context";

interface AuthComponentProps {
  loading: JSX.Element;
  authenticated: JSX.Element;
  unauthenticated: JSX.Element;
}

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
