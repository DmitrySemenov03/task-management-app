import { useEffect, useState } from "react";
import CreateBoardModal from "../components/CreateBoardModal";
import styles from "../styles/BoardsListPage.module.css";
import { useAuth } from "./auth/AuthContext";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchBoards,
  createBoard,
  updateBoard,
  deleteBoard,
} from "../store/slices/boardSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";

function BoardsListPage() {
  const { user } = useAuth();

  const dispatch = useAppDispatch();
  const boards = useAppSelector((state) => state.board.items);
  const loading = useAppSelector((state) => state.board.loading);

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchBoards(user.uid));
    }
  }, [user, dispatch]);

  const handleCreateBoard = async (boardTitle: string) => {
    if (!user?.uid) return;
    await dispatch(createBoard({ userId: user.uid, title: boardTitle }));
    setModalOpen(false);
  };

  const handleStartEdit = (boardId: string, title: string) => {
    setEditingBoardId(boardId);
    setEditingTitle(title);
  };

  const handleSaveEdit = async () => {
    if (!editingBoardId || !editingTitle.trim()) return;
    await dispatch(
      updateBoard({ boardId: editingBoardId, updates: { title: editingTitle } })
    );
    setEditingBoardId(null);
    setEditingTitle("");
  };

  const handleDelete = async (boardId: string) => {
    await dispatch(deleteBoard(boardId));
  };

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.containerTitle}>Your workspaces</h3>

      <div className={styles.boardsContainer}>
        {loading && <p className={styles.loadingText}>Loading...</p>}

        <ul className={styles.list}>
          {boards.map((board) => (
            <li key={board.id} className={styles.card}>
              {editingBoardId === board.id ? (
                <div className={styles.editForm}>
                  <input
                    type="text"
                    className={styles.editInput}
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                  />
                  <button onClick={handleSaveEdit} className={styles.saveBtn}>
                    Save
                  </button>
                  <button
                    onClick={() => setEditingBoardId(null)}
                    className={styles.cancelBtn}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <Link to={`/boards/${board.id}`} className={styles.listItem}>
                    {board.title}
                  </Link>
                  <div className={styles.actions}>
                    <button
                      onClick={() => handleStartEdit(board.id, board.title)}
                      className={styles.editBtn}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                    <button
                      onClick={() => handleDelete(board.id)}
                      className={styles.deleteBtn}
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}

          <button
            className={styles.createButton}
            onClick={() => setModalOpen(true)}
          >
            + Create new board
          </button>
        </ul>
      </div>

      <CreateBoardModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateBoard}
      />
    </div>
  );
}

export default BoardsListPage;
