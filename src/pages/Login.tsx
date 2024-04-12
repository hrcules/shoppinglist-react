import styles from "../styles/pages/Login.module.css";

import GoogleSVG from "../assets/google.svg";
import GithubSVG from "../assets/github.svg";
import { Navigate } from "react-router-dom";
import { useAuth } from "../utils/hooks/useAuth";
import { categories, iconProps } from "../utils/categories";
import {
  Apple,
  Beef,
  Carrot,
  Milk,
  Sandwich,
  ShoppingCart,
} from "lucide-react";

function Login() {
  const { loginWithGoogle, loginWithGithub, signed } = useAuth();

  const handleIconViewer = (icon: iconProps) => {
    if (icon.name === "Sandwich") {
      return <Sandwich size={32} color={icon.color} />;
    } else if (icon.name === "Carrot") {
      return <Carrot size={32} color={icon.color} />;
    } else if (icon.name === "Beef") {
      return <Beef size={32} color={icon.color} />;
    } else if (icon.name === "Apple") {
      return <Apple size={32} color={icon.color} />;
    } else if (icon.name === "Milk") {
      return <Milk size={32} color={icon.color} />;
    } else if (icon.name === "ShoppingCart") {
      return <ShoppingCart size={32} color={icon.color} />;
    }
  };

  const loginGoogle = async () => {
    await loginWithGoogle();
  };
  const loginGithub = async () => {
    await loginWithGithub();
  };

  if (!signed) {
    return (
      <div className={styles.Container}>
        <div className={styles.Content}>
          <h1>Login</h1>
          <p className={styles.descriptionApp}>
            Faça suas compras de <br /> forma <span>prática</span> e{" "}
            <span>organizada</span> !
          </p>

          <div className={styles.loginIconsApresentation}>
            {categories.map((category, key) => (
              <span key={key}>{handleIconViewer(category.icon)}</span>
            ))}
          </div>

          <div className={styles.loginButtonContainer}>
            <button
              type="button"
              className={styles.FormButtonProvider}
              onClick={() => loginGoogle()}
            >
              {" "}
              <img src={GoogleSVG} /> Faça login com o Google
            </button>
            <button
              type="button"
              className={styles.FormButtonProvider}
              onClick={() => loginGithub()}
            >
              {" "}
              <img src={GithubSVG} /> Faça login com o Github
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return <Navigate to={"/"} />;
  }
}

export default Login;
