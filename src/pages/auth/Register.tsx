import { createUserWithEmailAndPassword } from "firebase/auth";
import { FormEvent, useState } from "react";
import { auth } from "../../firebase";
import { Link } from "react-router-dom";
import styles from "../../styles/Register.module.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [copyPassword, setCopyPassword] = useState("");
  const [error, setError] = useState("");

  function register(e: FormEvent) {
    e.preventDefault();
    if (password !== copyPassword) {
      setError("Passwords didn`t match!");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((user) => {
        console.log(user);
        setEmail("");
        setPassword("");
        setCopyPassword("");
        setError("");
      })
      .catch((error) => console.log(error));
  }

  return (
    <div className={styles.signup}>
      <form onSubmit={register} className={styles.form}>
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
          placeholder="Enter your password again"
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
