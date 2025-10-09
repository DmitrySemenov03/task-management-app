import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { FormEvent, useState } from "react";
import { auth } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/LogIn.module.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const navigate = useNavigate();

  async function login(e: FormEvent) {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
      setError("");
      navigate("/boards");
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/invalid-credential") {
        setError("Incorrect email or password.");
      } else if (err.code === "auth/user-not-found") {
        setError("Account not found.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email above first.");
      return;
    }

    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent. Check your inbox!");
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else if (err.code === "auth/user-not-found") {
        setError("No user found with this email.");
      } else {
        setError("Failed to send reset email. Try again later.");
      }
    } finally {
      setResetLoading(false);
    }
  }

  return (
    <div className={styles.login}>
      <form onSubmit={login} className={styles.form}>
        <input
          className={styles.loginInput}
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />

        <input
          className={styles.loginInput}
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
        />

        <button className={styles.btn} disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </button>

        <button
          type="button"
          className={styles.forgotBtn}
          onClick={handleForgotPassword}
          disabled={resetLoading}
        >
          {resetLoading ? "Sending..." : "Forgot password?"}
        </button>

        {error && <p className={styles.errorMsg}>{error}</p>}
        {message && <p className={styles.successMsg}>{message}</p>}
        
        <div className={styles.altSection}>
          <p className={styles.loginAsk}>Don’t have an account?</p>
          <Link to="/register" className={styles.alternativeLink}>
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
