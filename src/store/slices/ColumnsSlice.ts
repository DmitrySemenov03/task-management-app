import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  IColumn,
  createColumn as createColumnService,
  getColumns as getColumnsService,
  updateColumnOrder as updateColumnOrderService,
} from "../../services/ColumnsService";

interface ColumnsState {
  items: IColumn[];
  loading: boolean;
  error?: string | null;
}

const initialState: ColumnsState = {
  items: [],
  loading: false,
  error: null,
};

// thunks
export const fetchColumns = createAsyncThunk(
  "columns/fetch",
  async (boardId: string) => {
    const cols = await getColumnsService(boardId);
    return cols;
  }
);

// create column
export const createColumn = createAsyncThunk(
  "columns/create",
  async ({
    boardId,
    title,
    order,
  }: {
    boardId: string;
    title: string;
    order: number;
  }) => {
    const res = await createColumnService(boardId, title, order);
    if (!res) throw new Error("Failed to create column");
    return res;
  }
);

export const persistColumnsOrder = createAsyncThunk(
  "columns/persistOrder",
  async ({
    boardId,
    ordered,
  }: {
    boardId: string;
    ordered: { id: string; order: number }[];
  }) => {
    for (const o of ordered) {
      await updateColumnOrderService(boardId, o.id, o.order);
    }
    return ordered;
  }
);

const columnsSlice = createSlice({
  name: "columns",
  initialState,
  reducers: {
    reorderLocally(state, action: PayloadAction<{ from: number; to: number }>) {
      const { from, to } = action.payload;
      const arr = state.items;
      const [moved] = arr.splice(from, 1);
      arr.splice(to, 0, moved);
    },
    setColumns(state, action: PayloadAction<IColumn[]>) {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchColumns.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchColumns.fulfilled, (s, action) => {
        s.items = action.payload;
        s.loading = false;
      })
      .addCase(fetchColumns.rejected, (s, action) => {
        s.loading = false;
        s.error = action.error.message;
      })
      .addCase(createColumn.fulfilled, (s, action) => {
        s.items.push(action.payload);
      });
  },
});

export const { reorderLocally, setColumns } = columnsSlice.actions;
export default columnsSlice.reducer;
