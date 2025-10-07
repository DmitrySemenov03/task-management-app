import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { FormEvent, useState } from "react";
import { auth } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/Register.module.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [copyPassword, setCopyPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function register(e: FormEvent) {
    e.preventDefault();
    if (password !== copyPassword) {
      setError("Passwords didn`t match!");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: username,
        });
      }

      setUsername("");
      setEmail("");
      setPassword("");
      setCopyPassword("");
      setError("");
      navigate("/boards");
    } catch (error: any) {
      console.error(error);
      setError(error.message);
    }
  }

  return (
    <div className={styles.signup}>
      <form onSubmit={register} className={styles.form}>
        <input
          className={styles.loginInput}
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          required
        />
        <input
          className={styles.loginInput}
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
        <input
          className={styles.loginInput}
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />

        <input
          className={styles.loginInput}
          placeholder="Repeat your password"
          value={copyPassword}
          onChange={(e) => setCopyPassword(e.target.value)}
          type="password"
        />
        <button className={styles.btn}>Create account</button>
        {error && <p className={styles.errorMsg}>{error}</p>}
        <div>
          <p className={styles.loginAsk}>Already have an account?</p>
          <Link to="/login" className={styles.alternativeLink}>
            Log In
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
