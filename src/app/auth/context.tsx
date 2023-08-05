"use client";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { supabase } from "@db/client";
import { User } from "@supabase/supabase-js";
import { useRouter, useSearchParams } from "next/navigation";

interface AuthContextObject {
  user?: User | null;
  signOut?: () => void;
  loading?: boolean;
}

const AuthContext = createContext<AuthContextObject>({});

export const authBroadcast = new BroadcastChannel("authentication");

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const getSession = useCallback(async () => {
    setUser(null);
    setLoading(true);

    const { data, error } = await supabase.auth.getSession();

    console.log(data);

    if (error) {
      console.error(error);
    }

    if (data?.session?.user) {
      setUser(data.session.user);
    }

    setLoading(false);
  }, []);

  const router = useRouter();

  authBroadcast.addEventListener("message", (e: MessageEvent<string>) => {
    if (e.data === "reload-auth") {
      getSession();
      router.push("/");
    }
  });

  const searchParams = useSearchParams();
  const reloadSession = searchParams.get("reloadSession");

  useEffect(() => {
    getSession();
  }, [getSession, reloadSession]);

  const value = useMemo(() => {
    return {
      user,
      signOut: async () => await supabase.auth.signOut(),
      loading,
    };
  }, [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const { user, signOut, loading } = useContext(AuthContext);
  return { user, signOut, loading };
};
