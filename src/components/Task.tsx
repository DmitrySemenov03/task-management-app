import { ITask } from "../services/TasksService";
import styles from "../styles/Task.module.css";

interface ITaskProps {
  task: ITask;
}

export default function Task({ task }: ITaskProps) {
  return (
    <div className={styles.task}>
      <h4>{task.title}</h4>
      <p className={styles.createdDate}>{task.createdAt}</p>
    </div>
  );
}
