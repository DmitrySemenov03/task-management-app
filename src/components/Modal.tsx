import { FC, ReactNode } from "react";
import styles from "../styles/Modal.module.css";

interface ModalProps {
  isOpen: boolean;
  onCLose: () => void;
  children: ReactNode;
}

const Modal: FC<ModalProps> = ({ isOpen, onCLose, children }) => {
  if (!isOpen) return null;

  return (
    <div onClick={onCLose} className={styles.backdrop}>
      <div onClick={(e) => e.stopPropagation()} className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
