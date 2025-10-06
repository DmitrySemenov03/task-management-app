import { FC, useState } from "react";
import styles from "../styles/Column.module.css";
import TaskList from "./TaskList";
import CreateTaskModal from "./CreateTaskModal";
import { IColumn } from "../services/ColumnsService";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripLines, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { createTask } from "../store/slices/tasksSlice";

interface ColumnProps {
  column: IColumn;
  boardId: string;
}

const Column: FC<ColumnProps> = ({ column, boardId }) => {
  const dispatch = useAppDispatch();

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

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  async function handleCreateTask(title: string, description?: string) {
    await dispatch(
      createTask({ boardId, columnId: column.id, title, description })
    );
    setIsTaskModalOpen(false);
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
        <h3 className={styles.columnTitle}>{column.title}</h3>
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
