import { IUser } from "@/types";

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("mpms_token");
};

export const getUser = (): IUser | null => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("mpms_user");
  try {
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
};

export const setAuth = (token: string, user: IUser) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("mpms_token", token);
  localStorage.setItem("mpms_user", JSON.stringify(user));
};

export const logout = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("mpms_token");
  localStorage.removeItem("mpms_user");
  window.location.href = "/login";
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const hasRole = (allowedRoles: ("Admin" | "Manager" | "Member")[]): boolean => {
  const user = getUser();
  if (!user) return false;
  return allowedRoles.includes(user.role);
};
