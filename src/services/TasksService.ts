import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

export interface ITask {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  createdAt: number;
}

export async function createTask(
  boardId: string,
  columnId: string,
  title: string,
  description?: string
) {
  try {
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
      description: description || "",
      completed: false,
      createdAt: Date.now(),
    });
    return docRef.id;
  } catch (err) {
    console.error("Error creating task:", err);
    return null;
  }
}

export async function getTasks(
  boardId: string,
  columnId: string
): Promise<ITask[]> {
  try {
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
  } catch (err) {
    console.error("Error loading tasks:", err);
    return [];
  }
}

export async function updateTask(
  boardId: string,
  columnId: string,
  taskId: string,
  updates: Partial<ITask>
) {
  try {
    const tasksRef = doc(
      db,
      "boards",
      boardId,
      "columns",
      columnId,
      "tasks",
      taskId
    );
    await updateDoc(tasksRef, updates);
  } catch (err) {
    console.error("Error editing task", err);
  }
}

export async function deleteTask(
  boardId: string,
  columnId: string,
  taskId: string
) {
  try {
    const tasksRef = doc(
      db,
      "boards",
      boardId,
      "columns",
      columnId,
      "tasks",
      taskId
    );
    await deleteDoc(tasksRef);
  } catch (err) {
    console.error("Error deleting task", err);
  }
}
