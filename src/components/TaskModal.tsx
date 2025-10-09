import { FC, useEffect, useState } from "react";
import Modal from "./Modal";
import { ITask } from "../services/TasksService";
import styles from "../styles/TaskModal.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrashCan,
  faX,
} from "@fortawesome/free-solid-svg-icons";

interface TaskModalProps {
  task: ITask;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (taskId: string) => void;
  onUpdate: (taskId: string, updates: Partial<ITask>) => void;
}

const TaskModal: FC<TaskModalProps> = ({
  task,
  isOpen,
  onClose,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);

  useEffect(() => {
    setNewTitle(task.title);
  }, [task.title]);

  const handleUpdate = () => {
    if (!newTitle.trim()) return;
    onUpdate(task.id, { title: newTitle });
    setIsEditing(false);
  };

  return (
    <Modal isOpen={isOpen} onCLose={onClose}>
      <div className={styles.modalContent}>
        <button className={styles.closeBtn} onClick={onClose}>
          <FontAwesomeIcon icon={faX} />
        </button>

        <div className={styles.modalHeader}>
          {isEditing ? (
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={handleUpdate}
              onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
              className={styles.editInput}
              autoFocus
            />
          ) : (
            <h2>{newTitle}</h2>
          )}

          <div className={styles.actions}>
            <button
              onClick={() => setIsEditing(true)}
              className={styles.editBtn}
            >
              <FontAwesomeIcon icon={faPenToSquare} />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className={styles.deleteBtn}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </div>

        <p className={styles.createdAt}>
          Created: {new Date(task.createdAt).toLocaleString()}
        </p>

        <hr className={styles.line} />

        <div className={styles.description}>
          {task.description || <em>No description</em>}
        </div>
      </div>
    </Modal>
  );
};

export default TaskModal;
