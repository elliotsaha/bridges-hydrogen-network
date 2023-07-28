"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@db/client";
import { User } from "@supabase/supabase-js";

interface AuthContextObject {
  user?: User;
  signOut?: () => void;
  loading?: boolean;
}

const AuthContext = createContext<AuthContextObject>({});

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);

  const getSession = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser(user);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getSession();
  }, []);

  const value = useMemo(() => {
    return {
      user,
      signOut: () => supabase.auth.signOut(),
      loading,
    };
  }, [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const { user, signOut, loading } = useContext(AuthContext);
  return { user, signOut, loading };
};
