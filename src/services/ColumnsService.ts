import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export interface IColumn {
  id: string;
  title: string;
  createdAt: number;
  ownerId: string;
}

export async function createColumn(
  boardId: string,
  title: string
): Promise<string | null> {
  try {
    const columnsRef = collection(db, "boards", boardId, "columns");
    const docRef = await addDoc(columnsRef, {
      title,
      createdAt: Date.now(),
    });
    return docRef.id;
  } catch (err) {
    console.error("Error adding column:", err);
    return null;
  }
}

export async function getColumns(boardId: string): Promise<IColumn[]> {
  try {
    const columnsRef = collection(db, "boards", boardId, "columns");
    const snapshot = await getDocs(columnsRef);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<IColumn, "id">),
    }));
  } catch (err) {
    console.error("Error getting columns:", err);
    return [];
  }
}
