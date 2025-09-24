import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export interface ITask {
  id: string;
  title: string;
  description: string;
  createdAt: number;
}

export async function createTask(
  boardId: string,
  columnId: string,
  title: string,
  description: string
) {
  const tasksRef = collection(
    db,
    "boards",
    boardId,
    "columns",
    columnId,
    "tasks"
  );
  const docRef = await addDoc(tasksRef, {
    title,
    description,
    createdAt: Date.now(),
  });
  return docRef.id;
}

export async function getTasks(
  boardId: string,
  columnId: string
): Promise<ITask[]> {
  const tasksRef = collection(
    db,
    "boards",
    boardId,
    "columns",
    columnId,
    "tasks"
  );
  const snapshot = await getDocs(tasksRef);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<ITask, "id">),
  }));
}
