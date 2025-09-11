import { useAuth } from "../pages/auth/AuthContext";
import styles from "../styles/Header.module.css";
import { Link } from "react-router-dom";
import logoImage from "../assets/appLogo.png";
import AuthBar from "./AuthBar";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link to="/" className={styles.logoLink}>
          <img src={logoImage} alt="logotype" />
          Daily`s
        </Link>
      </div>

      <nav className={styles.nav}>
        {user && <Link to="/boards">Boards</Link>}
      </nav>
      <AuthBar />
    </header>
  );
}
