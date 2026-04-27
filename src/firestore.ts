import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { Setting, PlayfulSettings } from "./types";

export interface UserSettings {
  settings?: Setting[];
  playfulSettings?: PlayfulSettings;
}

export async function loadUserSettings(uid: string): Promise<UserSettings | null> {
  if (!db) return null;
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? (snap.data() as UserSettings) : null;
}

export async function saveUserSettings(uid: string, data: Partial<UserSettings>): Promise<void> {
  if (!db) return;
  await setDoc(doc(db, "users", uid), data, { merge: true });
}
