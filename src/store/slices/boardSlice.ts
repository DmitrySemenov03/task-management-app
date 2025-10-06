import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  IBoard,
  createBoard as createBoardService,
  getBoards as getBoardsService,
  updateBoard as updateBoardService,
  deleteBoard as deleteBoardService,
} from "../../services/BoardsService";

interface BoardState {
  items: IBoard[];
  loading: boolean;
  error: string | null;
}

const initialState: BoardState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchBoards = createAsyncThunk(
  "boards/fetchAll",
  async (userId: string) => {
    const boards = await getBoardsService(userId);
    return boards || [];
  }
);

export const createBoard = createAsyncThunk(
  "boards/create",
  async ({ userId, title }: { userId: string; title: string }) => {
    const id = await createBoardService(userId, title);
    if (!id) throw new Error("Failed to create board");
    return { id, title, ownerId: userId, createdAt: Date.now() } as IBoard;
  }
);

export const updateBoard = createAsyncThunk(
  "boards/update",
  async ({
    boardId,
    updates,
  }: {
    boardId: string;
    updates: Partial<IBoard>;
  }) => {
    await updateBoardService(boardId, updates);
    return { boardId, updates };
  }
);

export const deleteBoard = createAsyncThunk(
  "boards/delete",
  async (boardId: string) => {
    await deleteBoardService(boardId);
    return boardId;
  }
);

const boardSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchBoards.fulfilled, (s, a) => {
        s.items = a.payload;
        s.loading = false;
      })
      .addCase(fetchBoards.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message || "Failed to load boards";
      })
      .addCase(createBoard.fulfilled, (s, a) => {
        s.items.push(a.payload);
      })
      .addCase(updateBoard.fulfilled, (s, a) => {
        const { boardId, updates } = a.payload;
        const board = s.items.find((b) => b.id === boardId);
        if (board) Object.assign(board, updates);
      })
      .addCase(deleteBoard.fulfilled, (s, a) => {
        s.items = s.items.filter((b) => b.id !== a.payload);
      });
  },
});

export default boardSlice.reducer;
