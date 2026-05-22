"use client";

import styles from "./LoginForm.module.css";
import { useLogin } from "@/hooks/useLogin";

export function LoginForm() {
  const {
    email, setEmail,
    password, setPassword,
    rememberMe, setRememberMe,
    showPassword, toggleShowPassword,
    loading,
    error,
    handleSubmit,
  } = useLogin();

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <div className={styles.errorBanner}>{error}</div>}

      <div className={styles.field}>
        <label className={styles.label} htmlFor="login-email">
          E-mail
        </label>
        <input
          id="login-email"
          type="email"
          className={styles.input}
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="login-password">
          Senha
        </label>
        <div className={styles.inputWrapper}>
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            className={styles.input}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            className={styles.eyeBtn}
            onClick={toggleShowPassword}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
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
      </div>

      <div className={styles.rememberRow}>
        <label className={styles.checkLabel}>
          <input
            type="checkbox"
            className={styles.checkbox}
            id="remember-toggle"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <span className={styles.toggle} />
          <span className={styles.toggleText}>Lembrar de mim</span>
        </label>
      </div>

      <button type="submit" className={styles.submitBtn} disabled={loading}>
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}