import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  createColumnOpen: boolean;
  createTaskOpenForColumn?: string | null;
}
const initialState: UIState = {
  createColumnOpen: false,
  createTaskOpenForColumn: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setCreateColumnOpen(state, action: PayloadAction<boolean>) {
      state.createColumnOpen = action.payload;
    },
    openCreateTaskModal(state, action: PayloadAction<string | null>) {
      state.createTaskOpenForColumn = action.payload;
    },
  },
});

export const { setCreateColumnOpen, openCreateTaskModal } = uiSlice.actions;
export default uiSlice.reducer;
