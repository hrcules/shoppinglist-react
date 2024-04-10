import styles from "../styles/pages/Login.module.css";

import GoogleSVG from "../assets/google.svg";
import GithubSVG from "../assets/github.svg";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../utils/hooks/useAuth";

function Login() {
  const { loginWithGoogle, signed } = useAuth();

  const loginGoogle = async () => {
    await loginWithGoogle();
  };

  if (!signed) {
    return (
      <div className={styles.Container}>
        <div className={styles.Content}>
          <h1>Login</h1>
          <p className={styles.descriptionApp}>
            Faça suas compras de <br /> forma prática e organizada!
          </p>

          <form>
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
            <button type="button" className={styles.FormButton}>
              Login
            </button>
            <button
              type="button"
              className={styles.FormButtonProvider}
              onClick={() => loginGoogle()}
            >
              {" "}
              <img src={GoogleSVG} /> Faça login com o Google
            </button>
            <button type="button" className={styles.FormButtonProvider}>
              {" "}
              <img src={GithubSVG} /> Faça login com o Github
            </button>
          </form>

          <p className={styles.notAccount}>
            Não tem conta?{" "}
            <span>
              <Link to="/register">Clique aqui</Link>
            </span>
          </p>
        </div>
      </div>
    );
  } else {
    return <Navigate to={"/"} />;
  }
}

export default Login;
