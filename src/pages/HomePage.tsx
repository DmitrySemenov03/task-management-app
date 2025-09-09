import React from "react";
import styles from "../styles/HomePage.module.css";
import { Link } from "react-router-dom";
import Header from "../components/Header";

function HomePage() {
  return (
    <div className={styles.container}>
      <Header />
      <p className={styles.appDescription}>
        Организуй свои задачи и проекты легко!
      </p>
      <div className={styles.regBtn}>
        <Link to="/register" className={styles.registerLink}>
          Get started!
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
