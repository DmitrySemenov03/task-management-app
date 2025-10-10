import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "./slices/boardSlice";
import columnsReducer from "./slices/ColumnsSlice";
import tasksReducer from "./slices/tasksSlice";

export const store = configureStore({
  reducer: {
    board: boardReducer,
    columns: columnsReducer,
    tasks: tasksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
