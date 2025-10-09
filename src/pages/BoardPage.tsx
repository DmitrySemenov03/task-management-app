import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import styles from "../styles/BoardPage.module.css";
import { IBoard } from "../services/BoardsService";
import Column from "../components/Column";
import CreateColumnModal from "../components/CreateColumnModal";
import BoardViewDropdown from "../components/BoardViewDropdown";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { ITask } from "../services/TasksService";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  createColumn,
  fetchColumns,
  persistColumnsOrder,
  reorderLocally,
} from "../store/slices/ColumnsSlice";
import {
  fetchTasksForColumn,
  moveTaskBetweenColumns,
  reorderTasksLocally,
} from "../store/slices/tasksSlice";
import LoadingOverlay from "../components/LoadingOverlay";

function BoardPage() {
  const { boardId } = useParams<{ boardId: string }>();
  const dispatch = useAppDispatch();

  const [board, setBoard] = useState<IBoard | null>(null);
  const [loading, setLoading] = useState(true);
  const [isColumnOpen, setIsColumnOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<ITask | null>(null);

  const columns = useAppSelector((state) => state.columns.items);
  const columnsLoading = useAppSelector((state) => state.columns.loading);
  const tasksByColumn = useAppSelector((state) => state.tasks.byColumn);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  useEffect(() => {
    async function loadBoard() {
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

          // Load columns of the board from Redux
          const resultAction = await dispatch(fetchColumns(boardId));
          const cols = resultAction.payload;

          // Load tasks for each column
          if (Array.isArray(cols)) {
            cols.forEach((col) =>
              dispatch(fetchTasksForColumn({ boardId, columnId: col.id }))
            );
          }
        }
      } catch (err) {
        console.error("Error loading board:", err);
      } finally {
        setLoading(false);
      }
    }

    loadBoard();
  }, [boardId, dispatch]);

  async function handleCreateColumn(title: string) {
    if (!boardId) return;
    await dispatch(createColumn({ boardId, title, order: columns.length }));
  }

  // DnD logic
  function findColumnIdForTask(taskId: string): string | undefined {
    return Object.keys(tasksByColumn).find((colId) =>
      (tasksByColumn[colId] || []).some((t) => t.id === taskId)
    );
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeIdStr = String(active.id);
    const overIdStr = String(over.id);

    // Drag columns
    if (activeIdStr.startsWith("column-") && overIdStr.startsWith("column-")) {
      const oldIndex = columns.findIndex(
        (c) => `column-${c.id}` === activeIdStr
      );
      const newIndex = columns.findIndex((c) => `column-${c.id}` === overIdStr);
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;
      dispatch(reorderLocally({ from: oldIndex, to: newIndex }));

      const reordered = [...columns];
      const [moved] = reordered.splice(oldIndex, 1);
      reordered.splice(newIndex, 0, moved);

      await dispatch(
        persistColumnsOrder({
          boardId: boardId!,
          ordered: reordered.map((c, i) => ({ id: c.id, order: i })),
        })
      );
      return;
    }

    // Drag tasks
    if (activeIdStr.startsWith("task-")) {
      const activeTaskId = activeIdStr.replace(/^task-/, "");

      const sourceColId = findColumnIdForTask(activeTaskId);
      if (!sourceColId) return;

      let destColId: string | null = null;
      let destIndex = -1;

      if (overIdStr.startsWith("task-")) {
        const overTaskId = overIdStr.replace(/^task-/, "");
        destColId = findColumnIdForTask(overTaskId) ?? null;
        if (!destColId) return;
        const overTasks = tasksByColumn[destColId] || [];
        destIndex = overTasks.findIndex((t) => t.id === overTaskId);
      } else if (overIdStr.startsWith("column-")) {
        destColId = overIdStr.replace(/^column-/, "");
        destIndex = (tasksByColumn[destColId] || []).length;
      } else {
        return;
      }

      if (!destColId || destIndex === -1) return;

      if (sourceColId === destColId) {
        const arr = tasksByColumn[sourceColId] || [];
        const fromIndex = arr.findIndex((t) => t.id === activeTaskId);
        if (fromIndex === -1) return;

        dispatch(
          reorderTasksLocally({
            columnId: sourceColId,
            from: fromIndex,
            to: destIndex,
          })
        );
        return;
      }

      await dispatch(
        moveTaskBetweenColumns({
          boardId: boardId!,
          fromColumnId: sourceColId,
          toColumnId: destColId,
          taskId: activeTaskId,
          destIndex,
        })
      );
    }
  }

  if (loading || columnsLoading)
    return <LoadingOverlay text="Loading boards..." fullscreen={true} />;
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
        onDragStart={(event) => {
          const id = String(event.active.id);
          if (id.startsWith("task-")) {
            const taskId = id.replace(/^task-/, "");
            const found = Object.values(tasksByColumn)
              .flat()
              .find((t) => t.id === taskId);
            if (found) setActiveTask(found);
          } else {
            setActiveTask(null);
          }
        }}
        onDragCancel={() => setActiveTask(null)}
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
                <Column key={col.id} column={col} boardId={boardId} />
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
        <DragOverlay dropAnimation={null}>
          {activeTask ? (
            <div
              style={{
                transform: "rotate(1deg)",
                cursor: "grabbing",
                width: "230px",
              }}
            >
              <div
                style={{
                  background: "var(--color-accent-bright)",
                  color: "#fff",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 10px var(--shadow-medium)",
                  fontSize: "16px",
                }}
              >
                {activeTask.title}
              </div>
            </div>
          ) : null}
        </DragOverlay>
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
