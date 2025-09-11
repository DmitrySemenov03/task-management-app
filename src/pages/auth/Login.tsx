import { signInWithEmailAndPassword } from "firebase/auth";
import { FormEvent, useState } from "react";
import { auth } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/LogIn.module.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  function login(e: FormEvent) {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((user) => {
        navigate("/boards");
        setEmail("");
        setPassword("");
        setError("");
      })
      .catch((error) => {
        console.log(error);
        setError("Couldn`t find the account!");
      });
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
        />
        <input
          className={styles.loginInput}
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />

        <button className={styles.btn}>Log In</button>
        {error && <p className={styles.errorMsg}>{error}</p>}
        <div>
          <p className={styles.loginAsk}>Don`t have an account?</p>
          <Link to="/register" className={styles.alternativeLink}>
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
