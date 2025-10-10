import React, { useEffect, useMemo, useState } from "react";
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
  getDay,
  addMonths,
  subMonths,
  isToday,
} from "date-fns";
import { fetchColumns } from "../store/slices/ColumnsSlice";
import { ITask } from "../services/TasksService";
import styles from "../styles/CalendarPage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const CalendarPage: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const dispatch = useAppDispatch();

  const columns = useAppSelector((state) => state.columns.items);
  const tasksByColumn = useAppSelector((state) => state.tasks.byColumn);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<
    "left" | "right"
  >("left");

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

  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const allTasks = Object.values(tasksByColumn).flat() as ITask[];

    const firstDayIndex = (getDay(start) + 6) % 7;
    const emptyDays = Array(firstDayIndex).fill(null);

    const days = eachDayOfInterval({ start, end }).map((date) => ({
      date,
      tasks: allTasks.filter((task) =>
        isSameDay(new Date(task.createdAt), date)
      ),
    }));

    return [...emptyDays, ...days];
  }, [tasksByColumn, currentMonth]);

  const handleDayClick = (date: Date) => setSelectedDate(date);
  const closeModal = () => setSelectedDate(null);

  const changeMonth = (direction: "prev" | "next") => {
    setAnimationDirection(direction === "next" ? "right" : "left");
    setIsAnimating(true);

    setTimeout(() => {
      setCurrentMonth((prev) =>
        direction === "next" ? addMonths(prev, 1) : subMonths(prev, 1)
      );
      setIsAnimating(false);
    }, 250);
  };

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <>
      <div className={styles.calendarPage}>
        <div className={styles.headerTop}>
          <div className={styles.monthMoves}>
            <button
              className={styles.navBtn}
              onClick={() => changeMonth("prev")}
              aria-label="Previous month"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>

            <h2 className={styles.monthTitle}>
              {format(currentMonth, "MMMM yyyy")}
            </h2>

            <button
              className={styles.navBtn}
              onClick={() => changeMonth("next")}
              aria-label="Next month"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>

          <Link to={`/boards/${boardId}`} className={styles.backLink}>
            ← Back to Board
          </Link>
        </div>

        <div className={styles.weekDays}>
          {weekDays.map((day) => (
            <div key={day} className={styles.weekDay}>
              {day}
            </div>
          ))}
        </div>

        <div
          className={`${styles.calendarGrid} ${
            isAnimating
              ? animationDirection === "right"
                ? styles.slideRight
                : styles.slideLeft
              : ""
          }`}
        >
          {calendarDays.map((day, index) =>
            day ? (
              <div
                key={day.date.toISOString()}
                className={`${styles.calendarDay} ${
                  isToday(day.date) ? styles.today : ""
                }`}
                onClick={() => handleDayClick(day.date)}
              >
                <div className={styles.date}>{format(day.date, "d")}</div>
                <div className={styles.tasksPreview}>
                  {day.tasks.slice(0, 2).map((task: ITask) => (
                    <div key={task.id} className={styles.task}>
                      {task.title}
                    </div>
                  ))}
                  {day.tasks.length > 2 && (
                    <div className={styles.moreTasks}>
                      +{day.tasks.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div key={`empty-${index}`} className={styles.emptyDay}></div>
            )
          )}
        </div>
      </div>

      {selectedDate && (
        <CalendarDayModal
          date={selectedDate}
          tasks={Object.values(tasksByColumn)
            .flat()
            .filter((task: any) =>
              isSameDay(new Date(task.createdAt), selectedDate)
            )}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default CalendarPage;
