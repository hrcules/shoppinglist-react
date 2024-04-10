import styles from "../styles/pages/Register.module.css";

import GoogleSVG from "../assets/google.svg";
import GithubSVG from "../assets/github.svg";
import { Link } from "react-router-dom";

function Register() {
  return (
    <div className={styles.Container}>
      <div className={styles.Content}>
        <h1>Criar conta</h1>
        <p className={styles.descriptionApp}>
          Comece agora mesmo a organizar suas compras com facilidade!
        </p>

        <form>
          <div className={styles.inputContainer}>
            <label htmlFor="username">Nome de usuário:</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="ex: Pedro Silva"
            />
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="example@exemple.com"
            />
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="password">Senha:</label>
            <input
              type="text"
              id="password"
              name="password"
              placeholder="no mínimo 8 digitos"
            />
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="password_confirm">Confirmar Senha:</label>
            <input
              type="text"
              id="password_confirm"
              name="password_confirm"
              placeholder="no mínimo 8 digitos"
            />
          </div>
          <button type="button" className={styles.FormButton}>
            Cadastrar
          </button>
          <button type="button" className={styles.FormButtonProvider}>
            {" "}
            <img src={GoogleSVG} /> Criar conta com o Google
          </button>
          <button type="button" className={styles.FormButtonProvider}>
            {" "}
            <img src={GithubSVG} /> Criar conta com o Github
          </button>
        </form>

        <p className={styles.notAccount}>
          Já tem conta?{" "}
          <span>
            <Link to="/login">Clique aqui</Link>
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
