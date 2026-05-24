import { api } from "@/lib/api";
import { AuthUser } from "@/lib/auth";

type LoginResponse = {
  data: {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
  };
};

export async function loginService(email: string, password: string) {
  const res = await api<LoginResponse>("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  return res.data;
}