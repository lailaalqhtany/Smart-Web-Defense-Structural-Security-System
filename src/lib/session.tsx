import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const KEY = "haseen.session";

type SessionCtx = {
  ready: boolean;
  authed: boolean;
  email: string | null;
  signIn: (email: string) => void;
  signOut: () => void;
};

const Ctx = createContext<SessionCtx>({
  ready: false,
  authed: false,
  email: null,
  signIn: () => {},
  signOut: () => {},
});

export function SessionProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(KEY);
      if (raw) setEmail(JSON.parse(raw).email ?? null);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const signIn = useCallback((value: string) => {
    setEmail(value);
    try {
      window.sessionStorage.setItem(KEY, JSON.stringify({ email: value }));
    } catch {
      /* ignore */
    }
  }, []);

  const signOut = useCallback(() => {
    setEmail(null);
    try {
      window.sessionStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <Ctx.Provider value={{ ready, authed: !!email, email, signIn, signOut }}>
      {children}
    </Ctx.Provider>
  );
}

export const useSession = () => useContext(Ctx);
