import { useEffect, useState } from "react";
import CreateBoardModal from "../components/CreateBoardModal";
import styles from "../styles/BoardsListPage.module.css";
import { useAuth } from "./auth/AuthContext";
import { createBoard, getBoards, IBoard } from "../services/BoardsService";

function BoardsListPage() {
  const { user } = useAuth();
  const userId = user?.uid;

  const [isModalOpen, setModalOpen] = useState(false);
  const [boards, setBoards] = useState<IBoard[] | null>([]);

  async function handleCreateBoard(boardTitle: string) {
    if (!userId) return;
    await createBoard(userId, boardTitle);
    const data = await getBoards(userId);
    setBoards(data);
  }

  useEffect(() => {
    async function loadBoards() {
      if (!userId) return;
      const data = await getBoards(userId);
      setBoards(data);
    }
    loadBoards();
  }, [userId]);

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.createButton}
        onClick={() => setModalOpen(true)}
      >
        Add new Board
      </button>

      <ul className={styles.list}>
        {boards && boards.map((board) => (
          <li key={board.id} className={styles.listItem}>
            {board.title}
          </li>
        ))}
      </ul>

      <CreateBoardModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateBoard}
      />
    </div>
  );
}

export default BoardsListPage;
