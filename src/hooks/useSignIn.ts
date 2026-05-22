"use client";

import { useState } from "react";

export type Genero = "masculino" | "feminino" | "outro" | "prefiro_nao_informar";

export type CadastroFields = {
  nome: string;
  cpf: string;
  genero: Genero;
  dataNascimento: string;
  email: string;
  password: string;
};

function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function useCadastro() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [genero, setGenero] = useState<Genero | "">("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleShowPassword = () => setShowPassword((v) => !v);

  const handleCpfChange = (value: string) => setCpf(formatCPF(value));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genero) {
      setError("Selecione um gênero.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      // TODO: chamar API de cadastro
      const fields: CadastroFields = {
        nome, cpf, genero, dataNascimento, email, password,
      };
      console.log("Cadastro:", fields);
    } catch (err) {
        console.error(err);
      setError("Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return {
    nome, setNome,
    cpf, handleCpfChange,
    genero, setGenero,
    dataNascimento, setDataNascimento,
    email, setEmail,
    password, setPassword,
    showPassword, toggleShowPassword,
    loading,
    error,
    handleSubmit,
  };
}