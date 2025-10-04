import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import styles from "../styles/BoardPage.module.css";
import { IBoard } from "../services/BoardsService";
import { createColumn, getColumns, IColumn } from "../services/ColumnsService";
import Column from "../components/Column";
import CreateColumnModal from "../components/CreateColumnModal";
import BoardViewDropdown from "../components/BoardViewDropdown";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import {
  createTask,
  deleteTask,
  getTasks,
  ITask,
  updateTask,
} from "../services/TasksService";

type TasksByColumn = {
  [columnId: string]: ITask[];
};

function BoardPage() {
  const { boardId } = useParams<{ boardId: string }>();

  const [board, setBoard] = useState<IBoard | null>(null);
  const [columns, setColumns] = useState<IColumn[]>([]);
  const [tasksByColumn, setTasksByColumn] = useState<TasksByColumn>({});

  const [loading, setLoading] = useState(true);

  const [isColumnOpen, setIsColumnOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  useEffect(() => {
    async function loadData() {
      if (!boardId) return;

      try {
        // Load the board
        const boardRef = doc(db, "boards", boardId);
        const snapshot = await getDoc(boardRef);

        if (snapshot.exists()) {
          setBoard({
            id: snapshot.id,
            ...(snapshot.data() as Omit<IBoard, "id">),
          });

          // Load columns of the board
          const columnsData = await getColumns(boardId);
          console.log("loading columns");
          setColumns(columnsData);

          // Load tasks for each column
          const tasksObj: TasksByColumn = {};
          await Promise.all(
            columnsData.map(async (c) => {
              const tasks = await getTasks(boardId, c.id);
              tasksObj[c.id] = tasks;
            })
          );
          setTasksByColumn(tasksObj);
        }
      } catch (err) {
        console.error("Error loading board:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [boardId]);

  async function handleCreateTask(
    columnId: string,
    title: string,
    description?: string
  ) {
    if (!boardId) return;

    const taskId = await createTask(boardId, columnId, title, description);
    if (!taskId) return;

    const newTask: ITask = {
      id: taskId,
      title,
      description: description || "",
      isCompleted: false,
      createdAt: Date.now(),
    };

    setTasksByColumn((prev) => ({
      ...prev,
      [columnId]: [...(prev[columnId] || []), newTask],
    }));
  }

  async function handleUpdateTask(
    columnId: string,
    taskId: string,
    updates: Partial<ITask>
  ) {
    if (!boardId) return;
    await updateTask(boardId, columnId, taskId, updates);

    setTasksByColumn((prev) => {
      const colTasks = prev[columnId] || [];
      return {
        ...prev,
        [columnId]: colTasks.map((t) =>
          t.id === taskId ? { ...t, ...updates } : t
        ),
      };
    });
  }

  async function handleDeleteTask(columnId: string, taskId: string) {
    if (!boardId) return;
    await deleteTask(boardId, columnId, taskId);

    setTasksByColumn((prev) => {
      const colTasks = prev[columnId] || [];
      return {
        ...prev,
        [columnId]: colTasks.filter((t) => t.id !== taskId),
      };
    });
  }

  async function handleCreateColumn(title: string) {
    if (!boardId) return;
    await createColumn(boardId, title);
    const data = await getColumns(boardId);
    setColumns(data);
  }

  // ---- DnD handler (central) ----
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeIdStr = String(active.id);
    const overIdStr = String(over.id);

    // --- 1) Drag columns ---
    if (activeIdStr.startsWith("column-") && overIdStr.startsWith("column-")) {
      const oldIndex = columns.findIndex(
        (c) => `column-${c.id}` === activeIdStr
      );
      const newIndex = columns.findIndex((c) => `column-${c.id}` === overIdStr);
      if (oldIndex === -1 || newIndex === -1) return;
      if (oldIndex !== newIndex) {
        setColumns((prev) => arrayMove(prev, oldIndex, newIndex));
      }
      return;
    }

    // --- 2) Drag tasks ---
    if (activeIdStr.startsWith("task-")) {
      const activeTaskId = activeIdStr.replace(/^task-/, "");

      // find source column id
      const sourceColId = Object.keys(tasksByColumn).find((colId) =>
        (tasksByColumn[colId] || []).some((t) => t.id === activeTaskId)
      );
      if (!sourceColId) return;

      // determine destination column id and index
      let destColId: string | null = null;
      let destIndex = -1;

      if (overIdStr.startsWith("task-")) {
        const overTaskId = overIdStr.replace(/^task-/, "");
        destColId =
          Object.keys(tasksByColumn).find((colId) =>
            (tasksByColumn[colId] || []).some((t) => t.id === overTaskId)
          ) || null;
        if (!destColId) return;

        const overTasks = tasksByColumn[destColId] || [];
        destIndex = overTasks.findIndex((t) => t.id === overTaskId);
        if (destIndex === -1) return;
      } else if (overIdStr.startsWith("column-")) {
        destColId = overIdStr.replace(/^column-/, "");
        // append to end of column
        destIndex = (tasksByColumn[destColId] || []).length;
      } else {
        return;
      }

      setTasksByColumn((prev) => {
        const next = { ...prev };

        const sourceArr = [...(next[sourceColId] || [])];
        const destArr = [...(next[destColId!] || [])];

        const sourceIndex = sourceArr.findIndex((t) => t.id === activeTaskId);
        if (sourceIndex === -1) return prev;

        const [moved] = sourceArr.splice(sourceIndex, 1);
        if (!moved) return prev;

        let insertIndex = destIndex;
        if (sourceColId === destColId && sourceIndex < destIndex) {
          insertIndex = destIndex - 1;
        }

        destArr.splice(insertIndex, 0, moved);

        next[sourceColId] = sourceArr;
        next[destColId!] = destArr;

        return next;
      });
    }
  }

  if (loading) return <div className={styles.loading}>Loading board...</div>;
  if (!board) return <div className={styles.notFound}>Board not found</div>;
  if (!boardId) return null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.boardSettings}>
        <h1 className={styles.title}>{board.title}</h1>
        <BoardViewDropdown />
      </div>

      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <SortableContext
          items={columns.map((column) => `column-${column.id}`)}
          strategy={horizontalListSortingStrategy}
        >
          <div className={styles.columnsWrapper}>
            {columns.length > 0 ? (
              columns.map((col) => (
                <Column
                  key={col.id}
                  column={col}
                  boardId={boardId}
                  tasks={tasksByColumn[col.id] || []}
                  onCreateTask={async (title, desc) =>
                    handleCreateTask(col.id, title, desc)
                  }
                  onUpdateTask={async (taskId, updates) =>
                    handleUpdateTask(col.id, taskId, updates)
                  }
                  onDeleteTask={async (taskId) =>
                    handleDeleteTask(col.id, taskId)
                  }
                />
              ))
            ) : (
              <p>No lists yet</p>
            )}
            <button
              className={styles.createButton}
              onClick={() => setIsColumnOpen(true)}
            >
              <FontAwesomeIcon icon={faPlus} /> Add List
            </button>
          </div>
        </SortableContext>
      </DndContext>

      <CreateColumnModal
        isOpen={isColumnOpen}
        onClose={() => setIsColumnOpen(false)}
        onCreate={handleCreateColumn}
      />
    </div>
  );
}

export default BoardPage;
