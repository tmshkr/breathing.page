import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { AppSettings, Setting } from "./types";
import { DEFAULT_APP_SETTINGS, normalizeAppSettings } from "./types";

interface PhaseDoc {
  word: string;
  duration: number;
}

/** Serialized shape stored under `appSettings` on the user document */
interface AppSettingsDoc {
  phases: PhaseDoc[];
  soundEnabled: boolean;
  particlesEnabled: boolean;
  dynamicColorsEnabled: boolean;
  noSleepEnabled: boolean;
}

/** Legacy Firestore user document fields */
interface LegacyUserDoc {
  appSettings?: AppSettingsDoc;
  settings?: PhaseDoc[];
  playfulSettings?: Partial<
    Pick<
      AppSettings,
      "soundEnabled" | "particlesEnabled" | "dynamicColorsEnabled"
    >
  >;
}

function serializePhases(settings: Setting[]): PhaseDoc[] {
  return settings.map(([word, duration]) => ({ word, duration }));
}

function deserializePhases(phases: PhaseDoc[]): Setting[] {
  return phases.map(({ word, duration }) => [word, duration]);
}

function serializeAppSettings(s: AppSettings): AppSettingsDoc {
  return {
    phases: serializePhases(s.phases),
    soundEnabled: s.soundEnabled,
    particlesEnabled: s.particlesEnabled,
    dynamicColorsEnabled: s.dynamicColorsEnabled,
    noSleepEnabled: s.noSleepEnabled,
  };
}

function deserializeAppSettings(doc_: AppSettingsDoc): AppSettings {
  return normalizeAppSettings({
    phases: deserializePhases(doc_.phases),
    soundEnabled: doc_.soundEnabled,
    particlesEnabled: doc_.particlesEnabled,
    dynamicColorsEnabled: doc_.dynamicColorsEnabled,
    noSleepEnabled: doc_.noSleepEnabled,
  });
}

export async function loadUserSettings(
  uid: string,
): Promise<AppSettings | null> {
  if (!db) return null;
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  const data = snap.data() as LegacyUserDoc;
  if (data.appSettings) {
    return deserializeAppSettings(data.appSettings);
  }
  const phases = data.settings
    ? deserializePhases(data.settings)
    : DEFAULT_APP_SETTINGS.phases;
  const playful = data.playfulSettings ?? {};
  return normalizeAppSettings({
    phases,
    ...playful,
    noSleepEnabled: DEFAULT_APP_SETTINGS.noSleepEnabled,
  });
}

export async function saveUserSettings(
  uid: string,
  settings: AppSettings,
): Promise<void> {
  if (!db) return;
  await setDoc(
    doc(db, "users", uid),
    { appSettings: serializeAppSettings(settings) },
    { merge: true },
  );
}
