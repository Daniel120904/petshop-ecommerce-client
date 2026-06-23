"use client";

import { useState, useRef, useEffect } from "react";
import { LoginForm } from "@/components/LoginForm/LoginForm";
import styles from "./page.module.css";
import { SignForm } from "@/components/SignInForm/SignIn";

type Tab = "login" | "cadastro";

export default function LoginPage() {
  const [active, setActive] = useState<Tab>("login");
  const loginRef = useRef<HTMLDivElement>(null);
  const cadastroRef = useRef<HTMLDivElement>(null);
  const [sliderHeight, setSliderHeight] = useState<number | undefined>(
    undefined,
  );

  // Mede a altura do painel ativo sempre que ele mudar de tamanho
  // (troca de aba OU conteúdo interno crescendo/diminuindo, como a checklist de senha)
  useEffect(() => {
    const el = active === "login" ? loginRef.current : cadastroRef.current;
    if (!el) return;

    // mede imediatamente
    setSliderHeight(el.offsetHeight);

    // e continua observando mudanças de tamanho do painel ativo
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setSliderHeight(entry.target.scrollHeight);
      }
    });
    observer.observe(el);

    return () => observer.disconnect();
  }, [active]);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${active === "login" ? styles.tabActive : ""}`}
            onClick={() => setActive("login")}
            type="button"
          >
            Entrar
          </button>
          <button
            className={`${styles.tab} ${active === "cadastro" ? styles.tabActive : ""}`}
            onClick={() => setActive("cadastro")}
            type="button"
          >
            Criar conta
          </button>
          <span
            className={styles.tabIndicator}
            style={{
              transform:
                active === "cadastro" ? "translateX(100%)" : "translateX(0)",
            }}
          />
        </div>

        <div
          className={styles.slider}
          style={{
            height: sliderHeight,
            transition: "height 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <div
            className={styles.track}
            style={{
              transform:
                active === "cadastro" ? "translateX(-50%)" : "translateX(0)",
            }}
          >
            <div className={styles.panel} ref={loginRef}>
              <div className={styles.panelHeader}>
                <h1 className={styles.title}>Bem-vindo de volta</h1>
                <p className={styles.subtitle}>
                  Entre na sua conta para continuar
                </p>
              </div>
              <LoginForm />
            </div>

            <div className={styles.panel} ref={cadastroRef}>
              <div className={styles.panelHeader}>
                <h1 className={styles.title}>Criar conta</h1>
                <p className={styles.subtitle}>
                  Preencha os dados para se cadastrar
                </p>
              </div>
              <SignForm onSuccess={() => setActive("login")} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
