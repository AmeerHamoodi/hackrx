import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { IUser } from "../types/models";

const AUTH_ROUTES = ["/signup", "/login"];

interface IAuthProviderProps {
  children: ReactNode;
}

function useInternalUseAuth() {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<null | undefined | string>(undefined);
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    if (!isAuth && token !== undefined && !AUTH_ROUTES.includes(router.pathname)) {
      router.push("/login?ss");
    }
  }, [isAuth, router, token]);

  useEffect(() => {
    if (localStorage.getItem(process.env.AUTH_HEADER ?? "")) {
      setToken(localStorage.getItem(process.env.AUTH_HEADER ?? ""));
      setUser(JSON.parse(localStorage.getItem("user") as string));
      setIsAuth(true);
    } else if (!AUTH_ROUTES.includes(router.pathname)) {
      setToken(null);
      setIsAuth(false);
      router.push("/login?sss");
    }
  }, []);

  function updateToken(token: string) {
    localStorage.setItem(process.env.AUTH_HEADER as string, token);
    setToken(token);
  }

  function updateUser(user: IUser) {
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  }

  return {
    token,
    updateToken,
    isAuth,
    setIsAuth,
    user,
    updateUser,
  };
}

const authContext = createContext<ReturnType<typeof useInternalUseAuth> | null>(null);

export function AuthProvider({ children }: IAuthProviderProps) {
  const hook = useInternalUseAuth();

  return <authContext.Provider value={hook}>{children}</authContext.Provider>;
}

export default function useAuth(): ReturnType<typeof useInternalUseAuth> {
  return useContext(authContext) as ReturnType<typeof useInternalUseAuth>;
}
