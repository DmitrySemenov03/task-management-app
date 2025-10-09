import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchTasksForColumn } from "../store/slices/tasksSlice";
import CalendarDayModal from "../components/CalendarDayModal";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameDay,
} from "date-fns";
import styles from "../styles/CalendarPage.module.css";
import { fetchColumns } from "../store/slices/ColumnsSlice";

interface ICalendarDay {
  date: Date;
  tasks: any[];
}

const CalendarPage: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();

  const dispatch = useAppDispatch();

  const columns = useAppSelector((state) => state.columns.items);
  const tasksByColumn = useAppSelector((state) => state.tasks.byColumn);

  const [calendarDays, setCalendarDays] = useState<ICalendarDay[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (!boardId) return;
    dispatch(fetchColumns(boardId));
  }, [boardId, dispatch]);

  useEffect(() => {
    if (!boardId) return;

    columns.forEach((col) => {
      dispatch(fetchTasksForColumn({ boardId, columnId: col.id }));
    });
  }, [boardId, columns, dispatch]);

  useEffect(() => {
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
    const allTasks = Object.values(tasksByColumn).flat();

    const days = eachDayOfInterval({ start, end }).map((date: Date) => ({
      date,
      tasks: allTasks.filter((task) =>
        isSameDay(new Date(task.createdAt), date)
      ),
    }));

    setCalendarDays(days);
  }, [tasksByColumn]);

  const handleDayClick = (date: Date) => setSelectedDate(date);
  const closeModal = () => setSelectedDate(null);

  return (
    <>
      <div className={styles.calendarPage}>
        <div className={styles.headerTop}>
          <h2>{format(new Date(), "MMMM yyyy")}</h2>
          <Link to={`/boards/${boardId}`} className={styles.backLink}>
            ← Back to Board
          </Link>
        </div>
        <div className={styles.calendarGrid}>
          {calendarDays.map((day) => (
            <div
              key={day.date.toISOString()}
              className={styles.calendarDay}
              onClick={() => handleDayClick(day.date)}
            >
              <div className={styles.date}>{format(day.date, "d MMM")}</div>
              <div className={styles.tasksPreview}>
                {day.tasks.slice(0, 3).map((task) => (
                  <div key={task.id} className={styles.task}>
                    {task.title}
                  </div>
                ))}
                {day.tasks.length > 3 && (
                  <div className={styles.task}>
                    +{day.tasks.length - 3} задач
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedDate && (
        <CalendarDayModal
          date={selectedDate}
          tasks={Object.values(tasksByColumn)
            .flat()
            .filter((task) =>
              isSameDay(new Date(task.createdAt), selectedDate)
            )}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default CalendarPage;
