import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../styles/BoardViewDropdown.module.css";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const BoardViewDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { boardId } = useParams<{ boardId: string }>();

  const handleNavigate = (path: string) => {
    if (!boardId) return;
    navigate(`/boards/${boardId}${path}`);
    setIsOpen(false);
  };

  return (
    <div className={styles.dropdown}>
      <button
        className={styles.dropdownButton}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        View <FontAwesomeIcon icon={faChevronDown} />
      </button>

      {isOpen && (
        <ul className={styles.dropdownMenu}>
          <li
            className={styles.dropdownItem}
            onClick={() => handleNavigate("")}
          >
            Board View
          </li>
          <li
            className={styles.dropdownItem}
            onClick={() => handleNavigate("/calendar")}
          >
            Calendar View
          </li>
        </ul>
      )}
    </div>
  );
};

export default BoardViewDropdown;
