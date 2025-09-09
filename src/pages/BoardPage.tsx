import React, { useState } from "react";
import styles from '../styles/BoardPage.module.css'


type TTask = {
  id: number;
  title: string;
};

type TColumn = {
  id: number;
  title: string;
  tasks: TTask[];
};

const mockData = [
  {
    id: 1,
    title: "To Do",
    tasks: [{ id: 1, title: "Сделать лендинг" }],
  },
  {
    id: 2,
    title: "In Progress",
    tasks: [{ id: 2, title: "Изучить Redux Toolkit" }],
  },
  {
    id: 3,
    title: "Done",
    tasks: [],
  },
];

function BoardPage() {
  const [columns, setColumns] = useState<TColumn[]>(mockData);

  return (
    <div className={styles.board}>
      {columns.map((column) => (
        <div key={column.id} className={styles.column}>
          <h2 className={styles.columnTitle}>{column.title}</h2>
          {column.tasks.map((task) => (
            <div key={task.id} className={styles.task}>{task.title}</div>
          ))}
          <button className={styles.addTaskBtn}>+ добавить задачу</button>
        </div>
      ))}
    </div>
  );
}

export default BoardPage;
