import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { Setting, PlayfulSettings } from "./types";

interface PhaseDoc {
  word: string;
  duration: number;
}

interface UserDoc {
  settings?: PhaseDoc[];
  playfulSettings?: PlayfulSettings;
}

export interface UserSettings {
  settings?: Setting[];
  playfulSettings?: PlayfulSettings;
}

function serializeSettings(settings: Setting[]): PhaseDoc[] {
  return settings.map(([word, duration]) => ({ word, duration }));
}

function deserializeSettings(phases: PhaseDoc[]): Setting[] {
  return phases.map(({ word, duration }) => [word, duration]);
}

export async function loadUserSettings(uid: string): Promise<UserSettings | null> {
  if (!db) return null;
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  const data = snap.data() as UserDoc;
  return {
    settings: data.settings ? deserializeSettings(data.settings) : undefined,
    playfulSettings: data.playfulSettings,
  };
}

export async function saveUserSettings(uid: string, data: Partial<UserSettings>): Promise<void> {
  if (!db) return;
  const doc_ = doc(db, "users", uid);
  const payload: Partial<UserDoc> = {};
  if (data.settings) payload.settings = serializeSettings(data.settings);
  if (data.playfulSettings) payload.playfulSettings = data.playfulSettings;
  await setDoc(doc_, payload, { merge: true });
}
