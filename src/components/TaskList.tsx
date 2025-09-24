// src/components/TaskList.tsx
import React, { FC, useEffect, useState } from "react";
import Task from "./Task";
import styles from "../styles/TaskList.module.css";
import { getTasks, ITask } from "../services/TasksService";

interface TaskListProps {
  boardId: string;
  columnId: string;
}

const TaskList: FC<TaskListProps> = ({ boardId, columnId }) => {
  const [tasks, setTasks] = useState<ITask[]>([]);

  useEffect(() => {
    async function loadTasks() {
      const data = await getTasks(boardId, columnId);
      setTasks(data);
    }
    loadTasks();
  }, [boardId, columnId]);

  return (
    <div className={styles.taskList}>
      {tasks.length > 0 ? (
        tasks.map((task) => <Task key={task.id} task={task} />)
      ) : (
        <p className={styles.empty}>No tasks yet</p>
      )}
    </div>
  );
};

export default TaskList;
