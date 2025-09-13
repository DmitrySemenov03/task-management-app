import React, { FC, useState } from "react";
import Modal from "./Modal";
import styles from '../styles/CreateBoardModal.module.css'

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string) => void;
}

const CreateBoardModal: FC<CreateBoardModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onCreate(title);
      setTitle("");
      onClose();
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onCLose={onClose}>
        <h4 className={styles.title}>Create your Board</h4>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Enter Board title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.input}
          />
          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancel}>
              Cancel
            </button>
            <button type="submit" className={styles.create}>
              Create
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default CreateBoardModal;
