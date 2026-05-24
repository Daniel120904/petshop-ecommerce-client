"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { loginService } from "@/services/authService";


const REDIRECT_MAP: Record<string, string> = {
  MASTER: "/admin",
  ADMIN:  "/admin",
  USER:   "/dashboard",
};

export function useLogin() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);

  const toggleShowPassword = () => setShowPassword((p) => !p);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await loginService(email, password);

      login(data.accessToken, data.refreshToken, data.user, rememberMe);

      const redirect = REDIRECT_MAP[data.user.permission] ?? "/dashboard";
      router.push(redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  };

  return {
    email, setEmail,
    password, setPassword,
    rememberMe, setRememberMe,
    showPassword, toggleShowPassword,
    loading, error,
    handleSubmit,
  };
}