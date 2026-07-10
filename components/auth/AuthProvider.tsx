"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, getUser, removeUser, removeToken } from "@/lib/auth";
import { useRouter, usePathname } from "next/navigation";
import Swal from "sweetalert2";
import * as auth from "@/lib/auth";
import { callApi } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = getUser();
    if (storedUser) setUserState(storedUser);
  }, []);

  const logout = async () => {
    await auth.logout();
  };

  useEffect(() => {
    if (!user) return;

    const isPublic = user?.role?.name === "public";
    const needsUpdate = user?.needsPasswordUpdate === true;

    const allowedPaths = ["/force-change-password", "/login"];
    const isAccessingRestricted = !allowedPaths.includes(pathname);

    if (isPublic && isAccessingRestricted) {
      Swal.fire({
        title: "Session Expired",
        text: "Your session has expired. Please log in again..",
        icon: "warning",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      }).then(() => {
        logout();
      });
      return;
    }

    if (needsUpdate && pathname !== "/force-change-password") {
      router.replace("/force-change-password");
    }

    auth.loadUserPermissions();

  }, [user, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, setUser: setUserState, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
