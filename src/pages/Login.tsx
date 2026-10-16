import styles from "../styles/pages/Login.module.css";

import GoogleSVG from "../assets/google.svg";
import GithubSVG from "../assets/github.svg";
import { Navigate } from "react-router-dom";
import { useAuth } from "../utils/hooks/useAuth";
import { categories, iconProps } from "../utils/categories";
import { Button } from "@/components/ui/button";
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
      return <Sandwich size={28} color={icon.color} />;
    } else if (icon.name === "Carrot") {
      return <Carrot size={28} color={icon.color} />;
    } else if (icon.name === "Beef") {
      return <Beef size={28} color={icon.color} />;
    } else if (icon.name === "Apple") {
      return <Apple size={28} color={icon.color} />;
    } else if (icon.name === "Milk") {
      return <Milk size={28} color={icon.color} />;
    } else if (icon.name === "ShoppingCart") {
      return <ShoppingCart size={28} color={icon.color} />;
    }

    return null;
  };

  const loginGoogle = async () => {
    await loginWithGoogle();
  };

  const loginGithub = async () => {
    await loginWithGithub();
  };

  if (signed) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className={styles.Container}>
      <section className={styles.Content} aria-labelledby="login-title">
        <header className={styles.brand}>
          <div className={styles.brandIcon}>
            <ShoppingCart size={23} strokeWidth={2.3} />
          </div>

          <span className={styles.brandName}>Lista de compras</span>
        </header>

        <div className={styles.introduction}>
          <span className={styles.eyebrow}>MAIS PRATICIDADE NO SEU DIA</span>

          <h1 id="login-title">
            Suas compras,
            <br />
            <span>em ordem.</span>
          </h1>

          <p className={styles.descriptionApp}>
            Organize sua lista, acompanhe seus produtos e tenha tudo o que
            precisa em um só lugar.
          </p>
        </div>

        <div
          className={styles.loginIconsApresentation}
          aria-label="Categorias de produtos"
        >
          {categories.map((category, index) => (
            <span
              key={category.icon.name ?? index}
              className={styles.categoryIcon}
              title={category.icon.name}
            >
              {handleIconViewer(category.icon)}
            </span>
          ))}
        </div>

        <div className={styles.loginOptions}>
          <div className={styles.loginOptionsHeader}>
            <h2>Vamos começar?</h2>
            <p>Escolha uma conta para entrar.</p>
          </div>

          <div className={styles.loginButtonContainer}>
            <Button
              type="button"
              variant="outline"
              className={styles.FormButtonProvider}
              onClick={loginGoogle}
            >
              <img src={GoogleSVG} alt="" aria-hidden="true" />
              <span>Continuar com Google</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              className={styles.FormButtonProvider}
              onClick={loginGithub}
            >
              <img src={GithubSVG} alt="" aria-hidden="true" />
              <span>Continuar com GitHub</span>
            </Button>
          </div>
        </div>

        <footer className={styles.footer}>
          <span className={styles.footerIcon}>
            <ShoppingCart size={15} />
          </span>

          <p>
            Menos preocupação na hora de comprar.
            <br />
            Mais organização no seu dia a dia.
          </p>
        </footer>
      </section>
    </main>
  );
}

export default Login;
