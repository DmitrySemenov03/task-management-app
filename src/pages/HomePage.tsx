import React from "react";
import styles from "../styles/HomePage.module.css";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className={styles.home}>
      {/* Hero section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Organize Your Work with Kanban Boards</h1>
          <p>
            Manage tasks, track progress, and collaborate with your team in one
            simple and powerful tool.
          </p>
          <Link to="/signup" className={styles.ctaButton}>
            Get Started for Free
          </Link>
        </div>
      </section>

      {/* Features section */}
      <section className={styles.features}>
        <h2>Why choose our Task Manager?</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <h3>📋 Simple Kanban</h3>
            <p>Visualize your workflow with drag-and-drop boards.</p>
          </div>
          <div className={styles.featureCard}>
            <h3>🤝 Team Collaboration</h3>
            <p>Share boards with teammates and track progress together.</p>
          </div>
          <div className={styles.featureCard}>
            <h3>📊 Productivity Insights</h3>
            <p>See detailed stats and improve your workflow efficiency.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
