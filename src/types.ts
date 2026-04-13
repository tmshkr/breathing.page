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

export interface PlayfulSettings {
  soundEnabled: boolean;
  particlesEnabled: boolean;
  dynamicColorsEnabled: boolean;
}

export const DEFAULT_PLAYFUL: PlayfulSettings = {
  soundEnabled: false,
  particlesEnabled: true,
  dynamicColorsEnabled: true,
};

export function loadPlayfulSettings(): PlayfulSettings {
  try {
    const saved = window.localStorage.getItem("playfulSettings");
    if (saved !== null) return { ...DEFAULT_PLAYFUL, ...JSON.parse(saved) };
  } catch (e) {
    // ignore
  }
  return DEFAULT_PLAYFUL;
}

export function savePlayfulSettings(settings: PlayfulSettings) {
  window.localStorage.setItem("playfulSettings", JSON.stringify(settings));
}

export const PHASE_COLORS = ["#87CEEB", "#A8D8EA", "#7EC8C8", "#B8A9C9"];
