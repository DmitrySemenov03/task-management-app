import { FC, useState } from "react";
import styles from "../styles/Task.module.css";
import { ITask } from "../services/TasksService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TaskProps {
  task: ITask;
  boardId: string;
  columnId: string;
  onUpdateTask: (taskId: string, updates: Partial<ITask>) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
}

const Task: FC<TaskProps> = ({ task, onUpdateTask, onDeleteTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `task-${task.id}`,
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 999 : undefined,
  };

  async function handleDelete() {
    await onDeleteTask(task.id);
  }

  async function handleUpdate() {
    if (!newTitle.trim()) return;
    await onUpdateTask(task.id, { title: newTitle });
    setIsEditing(false);
  }

  async function toggleComplete() {
    await onUpdateTask(task.id, { isCompleted: !task.isCompleted });
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.task} ${isDragging ? styles.dragging : ""}`}
      {...attributes}
      {...listeners}
    >
      <input
        type="checkbox"
        checked={task.isCompleted || false}
        onChange={toggleComplete}
        className={styles.checkbox}
        // onPointerDown={(e) => e.stopPropagation()}
      />

      {isEditing ? (
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onBlur={handleUpdate}
          onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
          className={styles.editInput}
          autoFocus
          onPointerDown={(e) => e.stopPropagation()}
        />
      ) : (
        <span className={task.isCompleted ? styles.completed : ""}>
          {task.title}
        </span>
      )}

      <div
        className={styles.actions}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <button onClick={() => setIsEditing(true)} className={styles.editBtn}>
          <FontAwesomeIcon icon={faPenToSquare} />
        </button>
        <button onClick={handleDelete} className={styles.deleteBtn}>
          <FontAwesomeIcon icon={faTrashCan} />
        </button>
      </div>
    </div>
  );
};

export default Task;
