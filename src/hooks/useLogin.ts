"use client";
 
import { useState } from "react";
 
export type LoginFields = {
  email: string;
  password: string;
  rememberMe: boolean;
};
 
export function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  const toggleShowPassword = () => setShowPassword((v) => !v);
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // TODO: chamar API de login
      const fields: LoginFields = { email, password, rememberMe };
      console.log("Login:", fields);
    } catch (err) {
        console.error(err);
      setError("E-mail ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  };
 
  return {
    email, setEmail,
    password, setPassword,
    rememberMe, setRememberMe,
    showPassword, toggleShowPassword,
    loading,
    error,
    handleSubmit,
  };
}