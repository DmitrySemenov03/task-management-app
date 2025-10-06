import { FC } from "react";
import Task from "./Task";
import styles from "../styles/TaskList.module.css";
import { ITask } from "../services/TasksService";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface TaskListProps {
  tasks: ITask[];
  boardId: string;
  columnId: string;
}

const TaskList: FC<TaskListProps> = ({ tasks, boardId, columnId }) => {
  return (
    <SortableContext
      items={tasks.map((t) => `task-${t.id}`)}
      strategy={verticalListSortingStrategy}
    >
      <div className={styles.taskList}>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <Task
              key={`task-${task.id}`}
              task={task}
              boardId={boardId}
              columnId={columnId}
            />
          ))
        ) : (
          <p className={styles.empty}>No tasks yet</p>
        )}
      </div>
    </SortableContext>
  );
};

export default TaskList;
