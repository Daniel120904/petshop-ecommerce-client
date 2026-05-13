import { Button } from "../buttons";
import styles from './LoginForm.module.css'

export function LoginForm() {
  return (
    <div className={styles.container}>
        <text>Login</text>
        <div className={styles.inputContent}>
            <text className={styles.description}>E-mail:</text>
            <textarea
                className={styles.input}
                /* value={props.value}
                onChange={(e) => props.onChange(e.target.value)}
                rows={props.rows ?? 3}
                placeholder={props.placeholder} */
            />
        </div>
        <div className={styles.inputContent}>
            <text className={styles.description}>Senha:</text>
            <textarea
                className={styles.input}
                /* value={props.value}
                onChange={(e) => props.onChange(e.target.value)}
                rows={props.rows ?? 3}
                placeholder={props.placeholder} */
            />
        </div>
        <Button
            //onClick={}
        >Login</Button>
        <Button
            //onClick={}
            variant="success"
        >Cadastrar</Button>
    </div>
  );
}