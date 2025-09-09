import React from "react";
import styles from "../styles/Header.module.css";
import { Link } from "react-router-dom";
import logo from "../assets/appLogo.png";

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.name}>
        <img src={logo} alt="logo" className={styles.logoImage} />
        <h2>Daily`s</h2>
      </div>
      <div className={styles.regLinks}>
        <Link to="/login" className={styles.loginLink}>
          Войти
        </Link>
        <Link to="/register" className={styles.registerLink}>
          Регистрация
        </Link>
      </div>
    </header>
  );
}

export default Header;
