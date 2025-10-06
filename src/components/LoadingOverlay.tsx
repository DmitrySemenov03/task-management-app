import React from "react";
import styles from "../styles/LoadingOverlay.module.css";

interface LoadingOverlayProps {
  text?: string;
  fullscreen?: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  text = "Loading...",
  fullscreen = true,
}) => {
  return (
    <div className={`${styles.overlay} ${fullscreen ? styles.fullscreen : ""}`}>
      <div className={styles.spinner}></div>
      <p className={styles.text}>{text}</p>
    </div>
  );
};

export default LoadingOverlay;
