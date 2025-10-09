import { FC, useState } from "react";
import Task from "./Task";
import TaskModal from "./TaskModal";
import styles from "../styles/TaskList.module.css";
import { ITask } from "../services/TasksService";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useAppDispatch } from "../store/hooks";
import { deleteTask, updateTask } from "../store/slices/tasksSlice";

interface TaskListProps {
  tasks: ITask[];
  boardId: string;
  columnId: string;
}

const TaskList: FC<TaskListProps> = ({ tasks, boardId, columnId }) => {
  const dispatch = useAppDispatch();

  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);

  const openTaskModal = (task: ITask) => setSelectedTask(task);

  const closeTaskModal = () => setSelectedTask(null);

  const handleUpdateTask = async (taskId: string, updates: Partial<ITask>) => {
    await dispatch(updateTask({ boardId, columnId, taskId, updates }));
  };

  const handleDeleteTask = async (taskId: string) => {
    await dispatch(deleteTask({ boardId, columnId, taskId }));
    closeTaskModal();
  };

  return (
    <>
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
                openTaskModal={openTaskModal}
              />
            ))
          ) : (
            <p className={styles.empty}>No tasks yet</p>
          )}
        </div>
      </SortableContext>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={closeTaskModal}
          onDelete={handleDeleteTask}
          onUpdate={handleUpdateTask}
        />
      )}
    </>
  );
};

export default TaskList;
