import { useState } from "react";
import { IColumn } from "../services/ColumnsService";
import CreateTaskModal from "./CreateTaskModal";
import TaskList from "./TaskList";
import { createTask } from "../services/TasksService";
import styles from "../styles/Column.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

interface ColumnProps {
  column: IColumn;
  boardId: string;
}

export default function Column({ column, boardId }: ColumnProps) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  async function handleCreateTask(title: string, description: string) {
    await createTask(boardId, column.id, title, description);
  }

  return (
    <div className={styles.column}>
      <h3 className={styles.columnTitle}>{column.title}</h3>

      <TaskList boardId={boardId} columnId={column.id} />

      <button
        className={styles.addTaskButton}
        onClick={() => setIsTaskModalOpen(true)}
      >
        <FontAwesomeIcon icon={faPlus} /> Add new Task
      </button>

      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onCreate={handleCreateTask}
      />
    </div>
  );
}
