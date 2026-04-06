import Link from "next/link";
import styles from "./Header.module.css";

type NavLink = {
  label: string;
  href: string;
};

type HeaderProps = {
  title: string;
  showBack?: boolean;
  backHref?: string;
  navLinks?: NavLink[];
};

export function Header({ title, showBack, backHref = "/", navLinks }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>

        {navLinks && navLinks.length > 0 && (
          <nav className={styles.nav}>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={styles.navLink}>
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        {showBack && (
          <Link href={backHref} className={styles.backButton}>
            Voltar
          </Link>
        )}
      </div>
    </header>
  );
}