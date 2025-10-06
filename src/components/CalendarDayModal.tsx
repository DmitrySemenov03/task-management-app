import styles from "../styles/CalendarDayModal.module.css";
import React from "react";
import { ITask } from "../services/TasksService";
import { format } from "date-fns";

interface Props {
  date: Date;
  tasks: ITask[];
  onClose: () => void;
}

const CalendarDayModal: React.FC<Props> = ({ date, tasks, onClose }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Tasks for {format(date, "d MMMM yyyy")}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>
        <ul>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <li key={task.id} className={styles.taskItem}>
                <strong>{task.title}</strong>
                {task.description && <p className={styles.taskDescription}>{task.description}</p>}
              </li>
            ))
          ) : (
            <p className={styles.empty}>No tasks</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CalendarDayModal;
