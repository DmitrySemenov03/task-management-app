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

function BoardPage() {
  const { boardId } = useParams<{ boardId: string }>();

  const [board, setBoard] = useState<IBoard | null>(null);
  const [columns, setColumns] = useState<IColumn[]>([]);

  const [loading, setLoading] = useState(true);

  const [isColumnOpen, setIsColumnOpen] = useState(false);

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
          const data = await getColumns(boardId);
          setColumns(data);
        } else {
          console.warn("Board not found");
        }
      } catch (err) {
        console.error("Error loading board:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [boardId]);

  async function handleCreateColumn(title: string) {
    if (!boardId) return;
    await createColumn(boardId, title);
    const data = await getColumns(boardId);
    setColumns(data);
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

      <div className={styles.columnsWrapper}>
        {columns.length > 0 ? (
          columns.map((col) => (
            <Column key={col.id} column={col} boardId={boardId} />
          ))
        ) : (
          <p>No columns yet</p>
        )}
        <button
          className={styles.createButton}
          onClick={() => setIsColumnOpen(true)}
        >
          <FontAwesomeIcon icon={faPlus} /> Add Column
        </button>
      </div>

      <CreateColumnModal
        isOpen={isColumnOpen}
        onClose={() => setIsColumnOpen(false)}
        onCreate={handleCreateColumn}
      />
    </div>
  );
}

export default BoardPage;
