"use client";

import { useState, useCallback } from "react";
import { registerCustomer } from "@/services/customerService";
import { RegisterPayload } from "@/types/customer";

// Ids usados no <select> do formulário:
// "1" = Masculino, "2" = Feminino, "3" = Outro, "4" = Prefiro não informar
export type Genero = "1" | "2" | "3" | "4" | "";

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

function maskCpf(value: string): string {
  const digits = onlyDigits(value).slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

const initialState = {
  nome: "",
  cpf: "",
  genero: "" as Genero,
  dataNascimento: "",
  email: "",
  password: "",
};

type UseRegisterOptions = {
  onSuccess?: () => void;
  /** tempo em ms antes de chamar onSuccess, pra dar tempo de ler a mensagem */
  successDelay?: number;
};

export function useRegister(options?: UseRegisterOptions) {
  const { onSuccess, successDelay = 1800 } = options ?? {};

  const [nome, setNome] = useState(initialState.nome);
  const [cpf, setCpf] = useState(initialState.cpf);
  const [genero, setGenero] = useState<Genero>(initialState.genero);
  const [dataNascimento, setDataNascimento] = useState(initialState.dataNascimento);
  const [email, setEmail] = useState(initialState.email);
  const [password, setPassword] = useState(initialState.password);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleCpfChange = useCallback((value: string) => {
    setCpf(maskCpf(value));
  }, []);

  const toggleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const resetFields = useCallback(() => {
    setNome(initialState.nome);
    setCpf(initialState.cpf);
    setGenero(initialState.genero);
    setDataNascimento(initialState.dataNascimento);
    setEmail(initialState.email);
    setPassword(initialState.password);
    setShowPassword(false);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);
      setSuccess(false);

      if (!nome || !cpf || !genero || !dataNascimento || !email || !password) {
        setError("Preencha todos os campos obrigatórios.");
        return;
      }

      const payload: RegisterPayload = {
        name: nome,
        email,
        password,
        cpf: onlyDigits(cpf),
        birthday: dataNascimento,
        ...(genero !== "4" && { genderId: genero }),
      };

      setLoading(true);
      try {
        await registerCustomer(payload);
        setSuccess(true);
        resetFields();

        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, successDelay);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Não foi possível criar a conta. Tente novamente."
        );
      } finally {
        setLoading(false);
      }
    },
    [nome, cpf, genero, dataNascimento, email, password, onSuccess, successDelay, resetFields]
  );

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
    success,
    handleSubmit,
  };
}