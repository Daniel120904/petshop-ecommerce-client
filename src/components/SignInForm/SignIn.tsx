"use client";

import { useState, useCallback } from "react";
import styles from "./SignIn.module.css";
import { useRegister, Genero } from "@/hooks/useRegister";
import { validateField } from "@/validators/sign";

type FieldErrors = Partial<Record<string, string | null>>;
type Touched = Partial<Record<string, boolean>>;

const schemaKey: Record<string, Parameters<typeof validateField>[0]> = {
  nome: "name",
  cpf: "cpf",
  email: "email",
  password: "password",
  dataNascimento: "birthday",
  genero: "genderId",
};

type SignFormProps = {
  onSuccess?: () => void;
};

export function SignForm({ onSuccess }: SignFormProps) {
  const {
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
  } = useRegister({ onSuccess });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Touched>({});

  const handleBlur = useCallback((field: string, value: unknown) => {
    setTouched((t) => ({ ...t, [field]: true }));
    const key = schemaKey[field];
    if (!key) return;
    const err = validateField(key, value);
    setFieldErrors((e) => ({ ...e, [field]: err }));
  }, []);

  const passwordRules = [
    { label: "Mínimo 6 caracteres", ok: password.length >= 6 },
    { label: "Letra maiúscula", ok: /[A-Z]/.test(password) },
    { label: "Letra minúscula", ok: /[a-z]/.test(password) },
    { label: "Número", ok: /[0-9]/.test(password) },
    { label: "Caractere especial", ok: /[^A-Za-z0-9]/.test(password) },
  ];

  const cx = (field: string) =>
    [
      styles.input,
      touched[field] && fieldErrors[field] ? styles.inputError : "",
      touched[field] && !fieldErrors[field] ? styles.inputOk : "",
    ]
      .filter(Boolean)
      .join(" ");

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {error && <div className={styles.errorBanner}>{error}</div>}
      {success && (
        <div className={styles.successBanner}>
          Conta criada com sucesso! Redirecionando para o login...
        </div>
      )}

      {/* Nome */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="cad-nome">Nome completo</label>
        <input
          id="cad-nome"
          type="text"
          className={cx("nome")}
          placeholder="João da Silva"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          onBlur={() => handleBlur("nome", nome)}
          autoComplete="name"
          disabled={loading || success}
        />
        {touched.nome && fieldErrors.nome && (
          <span className={styles.fieldError}>{fieldErrors.nome}</span>
        )}
      </div>

      {/* CPF + Data */}
      <div className={styles.row2}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="cad-cpf">CPF</label>
          <input
            id="cad-cpf"
            type="text"
            className={cx("cpf")}
            placeholder="000.000.000-00"
            value={cpf}
            onChange={(e) => handleCpfChange(e.target.value)}
            onBlur={() => handleBlur("cpf", cpf)}
            inputMode="numeric"
            disabled={loading || success}
          />
          {touched.cpf && fieldErrors.cpf && (
            <span className={styles.fieldError}>{fieldErrors.cpf}</span>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="cad-nascimento">Data de nascimento</label>
          <input
            id="cad-nascimento"
            type="date"
            className={cx("dataNascimento")}
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
            onBlur={() => handleBlur("dataNascimento", dataNascimento)}
            disabled={loading || success}
          />
          {touched.dataNascimento && fieldErrors.dataNascimento && (
            <span className={styles.fieldError}>{fieldErrors.dataNascimento}</span>
          )}
        </div>
      </div>

      {/* Gênero */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="cad-genero">Gênero</label>
        <select
          id="cad-genero"
          className={cx("genero")}
          value={genero}
          onChange={(e) => setGenero(e.target.value as Genero)}
          onBlur={() => handleBlur("genero", genero)}
          disabled={loading || success}
        >
          <option value="" disabled>Selecione</option>
          <option value="1">Masculino</option>
          <option value="2">Feminino</option>
          <option value="3">Outro</option>
          <option value="4">Prefiro não informar</option>
        </select>
        {touched.genero && fieldErrors.genero && (
          <span className={styles.fieldError}>{fieldErrors.genero}</span>
        )}
      </div>

      {/* E-mail */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="cad-email">E-mail</label>
        <input
          id="cad-email"
          type="email"
          className={cx("email")}
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => handleBlur("email", email)}
          autoComplete="email"
          disabled={loading || success}
        />
        {touched.email && fieldErrors.email && (
          <span className={styles.fieldError}>{fieldErrors.email}</span>
        )}
      </div>

      {/* Senha */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="cad-password">Senha</label>
        <div className={styles.inputWrapper}>
          <input
            id="cad-password"
            type={showPassword ? "text" : "password"}
            className={cx("password")}
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => handleBlur("password", password)}
            autoComplete="new-password"
            disabled={loading || success}
          />
          <button
            type="button"
            className={styles.eyeBtn}
            onClick={toggleShowPassword}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            disabled={loading || success}
          >
            {showPassword ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>

        {password.length > 0 && (
          <ul className={styles.passwordRules}>
            {passwordRules.map((rule) => (
              <li key={rule.label} className={rule.ok ? styles.ruleOk : styles.ruleError}>
                <span className={styles.ruleDot} />
                {rule.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button type="submit" className={styles.submitBtn} disabled={loading || success}>
        {loading ? "Criando conta..." : success ? "Conta criada!" : "Criar conta"}
      </button>
    </form>
  );
}