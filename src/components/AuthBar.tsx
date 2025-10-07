import { useState, useRef, useEffect } from "react";
import { useAuth } from "../pages/auth/AuthContext";
import { Link } from "react-router-dom";
import styles from "../styles/AuthBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

function AuthBar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const displayName = user?.displayName || user?.email;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) {
    return (
      <div className={styles.authButtons}>
        <Link to="/login" className={styles.loginLink}>
          Log In
        </Link>
        <Link to="/register" className={styles.signupLink}>
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.userMenu} ref={menuRef}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className={styles.userButton}
      >
        <img src="#" alt="userPhotoIcon" className={styles.userPhotoIcon} />
        {displayName}
        <span className={`${styles.arrow} ${menuOpen ? styles.open : ""}`}>
          <FontAwesomeIcon icon={faChevronDown} />
        </span>
      </button>

      {menuOpen && (
        <div className={styles.dropdown}>
          <Link to="/boards" className={styles.menuItem}>
            My Boards
          </Link>
          <button className={styles.menuItem}>Switch Theme</button>
          <hr className={styles.divider} />
          <button onClick={logout} className={styles.logout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default AuthBar;
