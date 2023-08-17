import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User } from "lucia";
import { validateClientSession } from "@/utils/validateClientSession";

interface AuthContextObject {
  user?: User | null;
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

    const session = await validateClientSession();

    if (session) {
      setUser(session.user);
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

  useEffect(() => {
    getSession();
  }, [getSession]);

  const value = useMemo(() => {
    return {
      user,
      loading,
    };
  }, [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const { user, loading } = useContext(AuthContext);
  return { user, loading };
};
