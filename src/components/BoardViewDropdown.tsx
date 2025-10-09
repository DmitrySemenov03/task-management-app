import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/BoardViewDropdown.module.css";

const BoardViewDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { boardId } = useParams<{ boardId: string }>();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleNavigate = (path: string) => {
    if (!boardId) return;
    navigate(`/boards/${boardId}${path}`);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <button
        className={`${styles.dropdownButton} ${isOpen ? styles.active : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        View
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`${styles.arrow} ${isOpen ? styles.open : ""}`}
        />
      </button>

      <ul className={`${styles.dropdownMenu} ${isOpen ? styles.show : ""}`}>
        <li className={styles.dropdownItem} onClick={() => handleNavigate("")}>
          Board View
        </li>
        <li
          className={styles.dropdownItem}
          onClick={() => handleNavigate("/calendar")}
        >
          Calendar View
        </li>
      </ul>
    </div>
  );
};

export default BoardViewDropdown;
