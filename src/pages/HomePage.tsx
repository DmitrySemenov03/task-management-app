import styles from "../styles/HomePage.module.css";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Plan. Track. Create.</h1>
          <p>
            Streamline your projects and stay focused. Create boards, organize
            tasks, and turn ideas into results — all in one place.
          </p>
          <Link to="/register" className={styles.ctaButton}>
            Start Now
          </Link>
        </div>
      </section>

      <section className={styles.features}>
        <h2>Everything you need to stay organized</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <h3>Flexible Boards</h3>
            <p>
              Build workflows that fit your process. Drag, drop, and reorder
              tasks effortlessly.
            </p>
          </div>
          <div className={styles.featureCard}>
            <h3>Team Collaboration</h3>
            <p>
              Keep your team aligned with shared boards and real-time updates.
            </p>
          </div>
          <div className={styles.featureCard}>
            <h3>Performance Overview</h3>
            <p>
              Track progress and discover bottlenecks with clear visual
              insights.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <h2>Ready to boost your productivity?</h2>
        <p>Join now and experience a smoother way to manage your projects.</p>
        <Link to="/register" className={styles.ctaButtonAlt}>
          Get Started
        </Link>
      </section>
    </div>
  );
}
