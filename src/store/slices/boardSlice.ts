import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { IBoard } from "../../services/BoardsService";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

interface BoardState {
  board: IBoard | null;
  loading: boolean;
  error?: string | null;
}

const initialState: BoardState = { board: null, loading: false, error: null };

export const fetchBoard = createAsyncThunk(
  "board/fetch",
  async (boardId: string) => {
    const boardRef = doc(db, "boards", boardId);
    const snapshot = await getDoc(boardRef);
    if (!snapshot.exists()) return null;
    return {
      id: snapshot.id,
      ...(snapshot.data() as Omit<IBoard, "id">),
    } as IBoard;
  }
);

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchBoard.pending, (s) => {
      s.loading = true;
      s.error = null;
    })
      .addCase(fetchBoard.fulfilled, (s, a) => {
        s.board = a.payload;
        s.loading = false;
      })
      .addCase(fetchBoard.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message;
      });
  },
});

export default boardSlice.reducer;
