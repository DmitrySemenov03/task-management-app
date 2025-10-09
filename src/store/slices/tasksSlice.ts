import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  ITask,
  createTask as createTaskService,
  getTasks as getTasksService,
  updateTask as updateTaskService,
  deleteTask as deleteTaskService,
} from "../../services/TasksService";

type TasksByColumn = Record<string, ITask[]>;

interface TasksState {
  byColumn: TasksByColumn;
  loading: boolean;
  error?: string | null;
}

const initialState: TasksState = {
  byColumn: {},
  loading: false,
  error: null,
};

// Load tasks for one column
export const fetchTasksForColumn = createAsyncThunk(
  "tasks/fetchForColumn",
  async ({ boardId, columnId }: { boardId: string; columnId: string }) => {
    const tasks = await getTasksService(boardId, columnId);
    return { columnId, tasks };
  }
);

export const createTask = createAsyncThunk(
  "tasks/create",
  async ({
    boardId,
    columnId,
    title,
    description,
  }: {
    boardId: string;
    columnId: string;
    title: string;
    description?: string;
  }) => {
    const id = await createTaskService(boardId, columnId, title, description);
    if (!id) throw new Error("Failed to create task");
    return {
      columnId,
      task: {
        id,
        title,
        description: description || "",
        isCompleted: false,
        createdAt: Date.now(),
      } as ITask,
    };
  }
);

export const updateTask = createAsyncThunk(
  "tasks/update",
  async ({
    boardId,
    columnId,
    taskId,
    updates,
  }: {
    boardId: string;
    columnId: string;
    taskId: string;
    updates: Partial<ITask>;
  }) => {
    await updateTaskService(boardId, columnId, taskId, updates);
    return { columnId, taskId, updates };
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async ({
    boardId,
    columnId,
    taskId,
  }: {
    boardId: string;
    columnId: string;
    taskId: string;
  }) => {
    await deleteTaskService(boardId, columnId, taskId);
    return { columnId, taskId };
  }
);

export const moveTaskBetweenColumns = createAsyncThunk(
  "tasks/moveBetween",
  async (
    {
      boardId,
      fromColumnId,
      toColumnId,
      taskId,
      destIndex,
    }: {
      boardId: string;
      fromColumnId: string;
      toColumnId: string;
      taskId: string;
      destIndex: number;
    },
    { getState }
  ) => {
    const state = getState() as any;
    const srcTasks: ITask[] = state.tasks.byColumn[fromColumnId] || [];
    const task = srcTasks.find((t) => t.id === taskId);
    if (!task) throw new Error("Task not found");

    const newId = await createTaskService(
      boardId,
      toColumnId,
      task.title,
      task.description
    );
    if (!newId) throw new Error("Failed to create copy in destination");

    await deleteTaskService(boardId, fromColumnId, taskId);

    const newTask: ITask = { ...task, id: newId };
    return { fromColumnId, toColumnId, taskId, newTask, destIndex };
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    reorderTasksLocally(
      state,
      action: PayloadAction<{ columnId: string; from: number; to: number }>
    ) {
      const { columnId, from, to } = action.payload;
      const arr = state.byColumn[columnId] || [];
      const [moved] = arr.splice(from, 1);
      arr.splice(to, 0, moved);
      state.byColumn[columnId] = arr;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksForColumn.fulfilled, (s, action) => {
        s.byColumn[action.payload.columnId] = action.payload.tasks;
      })
      .addCase(createTask.fulfilled, (s, action) => {
        const { columnId, task } = action.payload;
        s.byColumn[columnId] = [...(s.byColumn[columnId] || []), task];
      })
      .addCase(updateTask.fulfilled, (s, action) => {
        const { columnId, taskId, updates } = action.payload;
        s.byColumn[columnId] = (s.byColumn[columnId] || []).map((t) =>
          t.id === taskId ? { ...t, ...updates } : t
        );
      })
      .addCase(deleteTask.fulfilled, (s, action) => {
        const { columnId, taskId } = action.payload;
        s.byColumn[columnId] = (s.byColumn[columnId] || []).filter(
          (t) => t.id !== taskId
        );
      })
      .addCase(moveTaskBetweenColumns.fulfilled, (s, action) => {
        const { fromColumnId, toColumnId, taskId, newTask, destIndex } =
          action.payload;
        s.byColumn[fromColumnId] = (s.byColumn[fromColumnId] || []).filter(
          (t) => t.id !== taskId
        );
        const arr = [...(s.byColumn[toColumnId] || [])];
        arr.splice(destIndex, 0, newTask);
        s.byColumn[toColumnId] = arr;
      });
  },
});

export const { reorderTasksLocally } = tasksSlice.actions;
export default tasksSlice.reducer;
