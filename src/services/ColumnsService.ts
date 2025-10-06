import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

export interface IColumn {
  id: string;
  title: string;
  order: number;
  createdAt: number;
  ownerId?: string;
}

export async function createColumn(
  boardId: string,
  title: string,
  order: number
): Promise<IColumn | null> {
  try {
    const columnsRef = collection(db, "boards", boardId, "columns");
    const createdAt = Date.now();

    const docRef = await addDoc(columnsRef, {
      title,
      order,
      createdAt,
    });

    return {
      id: docRef.id,
      title,
      order,
      createdAt,
    };
  } catch (err) {
    console.error("Error adding column:", err);
    return null;
  }
}

export async function getColumns(boardId: string): Promise<IColumn[]> {
  try {
    const columnsRef = collection(db, "boards", boardId, "columns");
    const snapshot = await getDocs(columnsRef);

    const data: IColumn[] = snapshot.docs.map((snap) => {
      const raw = snap.data() as Record<string, any>;

      return {
        id: snap.id,
        title: String(raw.title ?? ""),
        order: Number(raw.order ?? 0),
        createdAt: Number(raw.createdAt ?? 0),
        ownerId: raw.ownerId ? String(raw.ownerId) : undefined,
      };
    });

    return data.sort((a, b) => a.order - b.order);
  } catch (err) {
    console.error("Error getting columns:", err);
    return [];
  }
}

export async function updateColumnOrder(
  boardId: string,
  columnId: string,
  order: number
): Promise<void> {
  try {
    const columnRef = doc(db, "boards", boardId, "columns", columnId);
    await updateDoc(columnRef, { order });
  } catch (err) {
    console.error("Error updating column order:", err);
  }
}
