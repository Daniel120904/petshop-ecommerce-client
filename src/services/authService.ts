import { api } from "@/lib/api";
import { AuthUser } from "@/lib/auth";

type LoginResponse = {
  data: {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
  };
};

type RefreshResponse = {
  data: {
    accessToken: string;
  };
};

export async function loginService(email: string, password: string) {
  const res = await api<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  return res.data;
}

export async function refreshService(refreshToken: string) {
  const res = await api<RefreshResponse>("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });

  return res.data;
}