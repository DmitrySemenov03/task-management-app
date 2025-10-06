import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

export interface IBoard {
  id: string;
  title: string;
  ownerId: string;
  createdAt: number;
}

export async function createBoard(
  userId: string,
  title: string
): Promise<string | null> {
  try {
    const boardsRef = collection(db, "boards");
    const docRef = await addDoc(boardsRef, {
      title,
      ownerId: userId,
      createdAt: Date.now(),
    });
    return docRef.id;
  } catch (err) {
    console.error("Error adding board:", err);
    return null;
  }
}

export async function getBoards(userId: string): Promise<IBoard[] | null> {
  try {
    const boardsRef = collection(db, "boards");
    const q = query(boardsRef, where("ownerId", "==", userId));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<IBoard, "id">),
    }));
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateBoard(boardId: string, updates: Partial<IBoard>) {
  try {
    const boardsRef = doc(db, "boards", boardId);
    await updateDoc(boardsRef, updates);
  } catch (err) {
    console.error("Error editing column", err);
  }
}

export async function deleteBoard(boardId: string) {
  try {
    const boardsRef = doc(db, "boards", boardId);
    await deleteDoc(boardsRef);
  } catch (err) {
    console.error("Error deleting column", err);
  }
}
