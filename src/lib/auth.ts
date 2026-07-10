import { callApi } from "@/lib/api";
import Swal from "sweetalert2";

const TOKEN_KEY = "daf-token";
const USER_KEY = "daf-user";
const FCM_TOKEN_KEY = "fcm-token";

export function setToken(token: string) {
  if (typeof document === "undefined") return;
  const maxAge = 60 * 60 * 24 * 7;
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;
}

export function getToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${TOKEN_KEY}=([^;]+)`));
  return match ? match[2] : null;
}

export function getFcmToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(FCM_TOKEN_KEY);
}

export function removeFcmToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(FCM_TOKEN_KEY);
}

export function removeToken() {
  if (typeof document === "undefined") return;
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
}
export interface User {
  id: number | string;
  name: string;
  email: string;
  role?: {
    id: number | string;
    name: string;
  };
  tenant?: {
    id: number | string;
    name: string;
    code: string;
  };
  avatar?: string;
  [key: string]: any;
}

export interface Permission {
  code: string;
}

export function setUser(user: User) {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(USER_KEY);
  try {
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function removeUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_KEY);
  }
}

export async function logout() {
  try {
    // await unregisterFirebase();
  } catch (e) {
    console.warn("Failed to unregister FCM", e);
  }
  try {
    const fcmToken = getFcmToken();
    if (fcmToken) {
      await callApi("auth/logout", {
        method: "POST",
        body: {
          fcmToken: fcmToken,
        },
      });
    }
  } catch (error) {
    console.error("Logout API failed:", error);
  } finally {
    removeToken();
    removeUser();
    removeFcmToken();

    await Swal.fire({
      title: "Logged Out!",
      text: "Logged out and device removed",
      icon: "warning",
      confirmButtonText: "OK",
      confirmButtonColor: "#3085d6",
      allowOutsideClick: false,
    });

    window.location.href = "/login";
  }
}
let permissionCache: Permission[] | null = null;
let permissionLoaded = false;

export async function loadUserPermissions(): Promise<Permission[]> {
  try {
    const user = getUser();

    if (!user) return [];

    if (permissionCache != null) {
      return permissionCache;
    }

    const res = await callApi<{ permissions: Permission[] }>(
      "auth/me/permissions",
    );
    permissionCache = res.permissions ?? [];

    permissionLoaded = true;

    return permissionCache;
  } catch {
    return [];
  }
}

export function getPermissionUser(): Permission[] {
  return permissionCache ?? [];
}

export function checkPermission(code: string | string[]): boolean {
  if (typeof window === "undefined") return false;

  if (!permissionCache) {
    return true;
  }

  const codes = (Array.isArray(code) ? code : [code]).map((c) =>
    c.toUpperCase(),
  );
  return permissionCache.some((p) => {
    return codes.includes(p.code.toUpperCase());
  });
}
export function clearUserPermissions() {
  permissionCache = null;
  permissionLoaded = false;
}
