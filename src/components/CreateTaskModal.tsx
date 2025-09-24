import React, { FC, useState } from "react";
import Modal from "./Modal";
import styles from "../styles/CreateBoardModal.module.css";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string, description: string) => void;
}

const CreateTaskModal: FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onCreate(title, description);
      setTitle("");
      setDescription("");
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onCLose={onClose}>
      <h4 className={styles.title}>Create Task</h4>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
        />
        <textarea
          placeholder="Enter task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
  );
};

export default CreateTaskModal;
