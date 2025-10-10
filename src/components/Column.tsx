import { FC, useState } from "react";
import styles from "../styles/Column.module.css";
import TaskList from "./TaskList";
import CreateTaskModal from "./CreateTaskModal";
import { IColumn } from "../services/ColumnsService";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripLines, faPenToSquare, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { createTask } from "../store/slices/tasksSlice";
import { deleteColumn, updateColumn } from "../store/slices/ColumnsSlice";

interface ColumnProps {
  column: IColumn;
  boardId: string;
}

const Column: FC<ColumnProps> = ({ column, boardId }) => {
  const dispatch = useAppDispatch();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(column.title);

  const tasks = useAppSelector(
    (state) => state.tasks.byColumn[column.id] || []
  );
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `column-${column.id}`,
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 999 : undefined,
  };

  async function handleCreateTask(title: string, description?: string) {
    await dispatch(
      createTask({ boardId, columnId: column.id, title, description })
    );
    setIsTaskModalOpen(false);
  }

  async function handleUpdate() {
    if (!newTitle.trim()) return;
    await dispatch(
      updateColumn({
        boardId,
        columnId: column.id,
        updates: { title: newTitle },
      })
    );
    setIsEditing(false);
  }

  async function handleDelete() {
    await dispatch(deleteColumn({ boardId, columnId: column.id }));
  }

  return (
    <div ref={setNodeRef} className={styles.column} style={style}>
      <div className={styles.columnHeader}>
        <div
          className={styles.colHandle}
          {...attributes}
          {...listeners}
          title="Drag list"
        >
          <FontAwesomeIcon icon={faGripLines} />
        </div>
        {isEditing ? (
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={handleUpdate}
            onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
            className={styles.editInput}
            autoFocus
          />
        ) : (
          <h3 className={styles.columnTitle}>{column.title}</h3>
        )}
        <div className={styles.actions}>
          <button onClick={() => setIsEditing(true)} className={styles.editBtn}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
          <button onClick={handleDelete} className={styles.deleteBtn}>
            <FontAwesomeIcon icon={faTrashCan} />
          </button>
        </div>
      </div>

      <TaskList tasks={tasks} boardId={boardId} columnId={column.id} />

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
};

export default Column;
