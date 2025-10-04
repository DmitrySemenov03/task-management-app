import { FC, useState } from "react";
import styles from "../styles/Column.module.css";
import TaskList from "./TaskList";
import CreateTaskModal from "./CreateTaskModal";
import { ITask } from "../services/TasksService";
import { IColumn } from "../services/ColumnsService";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripLines, faPlus } from "@fortawesome/free-solid-svg-icons";

interface ColumnProps {
  column: IColumn;
  boardId: string;
  tasks: ITask[];
  onCreateTask: (title: string, description?: string) => Promise<void>;
  onUpdateTask: (taskId: string, updates: Partial<ITask>) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
}

const Column: FC<ColumnProps> = ({
  column,
  tasks,
  boardId,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
}) => {
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

  async function handleCreate(title: string, description?: string) {
    await onCreateTask(title, description);
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

      <TaskList
        tasks={tasks}
        boardId={boardId}
        columnId={column.id}
        onUpdateTask={onUpdateTask}
        onDeleteTask={onDeleteTask}
      />

      <button
        className={styles.addTaskButton}
        onClick={() => setIsTaskModalOpen(true)}
      >
        <FontAwesomeIcon icon={faPlus} /> Add new Task
      </button>

      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
};

export default Column;
