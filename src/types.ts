export type Setting = [string, number];

export const DEFAULT_SETTINGS: Setting[] = [
  ["inhale", 4],
  ["hold", 4],
  ["exhale", 4],
  ["pause", 4],
];

export function loadSettings(): Setting[] {
  try {
    const saved = window.localStorage.getItem("settings");
    if (saved !== null) return JSON.parse(saved) as Setting[];
  } catch (e) {
    // ignore
  }
  return DEFAULT_SETTINGS;
}
