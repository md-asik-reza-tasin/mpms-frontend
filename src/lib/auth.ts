import { IUser } from "@/types";

const validRoles: IUser["role"][] = ["Admin", "Member"];
type AuthUserResponse = Partial<IUser> & { id?: string };

const normalizeUser = (value: unknown): IUser | null => {
  if (!value || typeof value !== "object") return null;

  const user = value as AuthUserResponse;
  const id = user._id || user.id;

  if (!id || typeof user.email !== "string" || !validRoles.includes(user.role as IUser["role"])) {
    return null;
  }

  return {
    ...user,
    _id: id,
    name: user.name || user.email,
    role: user.role as IUser["role"],
    email: user.email,
    createdAt: user.createdAt || "",
    updatedAt: user.updatedAt || "",
  };
};

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("mpms_token");
};

export const getUser = (): IUser | null => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("mpms_user");
  try {
    const parsedUser = normalizeUser(user ? JSON.parse(user) : null);
    if (!parsedUser) {
      localStorage.removeItem("mpms_token");
      localStorage.removeItem("mpms_user");
      return null;
    }

    return parsedUser;
  } catch (e) {
    localStorage.removeItem("mpms_token");
    localStorage.removeItem("mpms_user");
    return null;
  }
};

export const setAuth = (token: string, user: IUser) => {
  if (typeof window === "undefined") return;
  const normalizedUser = normalizeUser(user);
  if (!normalizedUser) return;

  localStorage.setItem("mpms_token", token);
  localStorage.setItem("mpms_user", JSON.stringify(normalizedUser));
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

export const hasRole = (allowedRoles: ("Admin" | "Member")[]): boolean => {
  const user = getUser();
  if (!user) return false;
  return allowedRoles.includes(user.role);
};
