import React from "react";
import { useAuth } from "../pages/auth/AuthContext";
import { Link } from "react-router-dom";
import styles from "../styles/AuthBar.module.css";

function AuthBar() {
  const { user, logout } = useAuth();

  return (
    <div className={styles.authButtons}>
      {user ? (
        <>
          <span className={styles.userEmail}>{user.email}</span>
          <button onClick={logout} className={styles.logoutButton}>
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login" className={styles.loginLink}>
            Log In
          </Link>
          <Link to="/register" className={styles.signupLink}>
            Sign Up
          </Link>
        </>
      )}
    </div>
  );
}

export default AuthBar;
