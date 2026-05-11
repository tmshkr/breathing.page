export type Setting = [string, number];

export interface AppSettings {
  phases: Setting[];
  soundEnabled: boolean;
  particlesEnabled: boolean;
  dynamicColorsEnabled: boolean;
  noSleepEnabled: boolean;
}

export const DEFAULT_APP_SETTINGS: AppSettings = {
  phases: [
    ["inhale", 4],
    ["hold", 4],
    ["exhale", 4],
    ["pause", 4],
  ],
  soundEnabled: false,
  particlesEnabled: true,
  dynamicColorsEnabled: true,
  noSleepEnabled: false,
};

const STORAGE_KEY = "appSettings";

export function normalizeAppSettings(partial: Partial<AppSettings>): AppSettings {
  const phases =
    partial.phases &&
    Array.isArray(partial.phases) &&
    partial.phases.length === DEFAULT_APP_SETTINGS.phases.length
      ? partial.phases
      : DEFAULT_APP_SETTINGS.phases;
  return {
    ...DEFAULT_APP_SETTINGS,
    ...partial,
    phases,
  };
}

function migrateLegacyLocalStorage(): AppSettings {
  let phases = DEFAULT_APP_SETTINGS.phases;
  try {
    const old = window.localStorage.getItem("settings");
    if (old !== null) {
      const parsed = JSON.parse(old) as Setting[];
      if (Array.isArray(parsed) && parsed.length === phases.length) {
        phases = parsed;
      }
    }
  } catch {
    // ignore
  }
  let soundEnabled = DEFAULT_APP_SETTINGS.soundEnabled;
  let particlesEnabled = DEFAULT_APP_SETTINGS.particlesEnabled;
  let dynamicColorsEnabled = DEFAULT_APP_SETTINGS.dynamicColorsEnabled;
  try {
    const oldPlayful = window.localStorage.getItem("playfulSettings");
    if (oldPlayful !== null) {
      const p = JSON.parse(oldPlayful) as Partial<AppSettings>;
      if (typeof p.soundEnabled === "boolean") soundEnabled = p.soundEnabled;
      if (typeof p.particlesEnabled === "boolean") particlesEnabled = p.particlesEnabled;
      if (typeof p.dynamicColorsEnabled === "boolean") {
        dynamicColorsEnabled = p.dynamicColorsEnabled;
      }
    }
  } catch {
    // ignore
  }
  let noSleepEnabled = DEFAULT_APP_SETTINGS.noSleepEnabled;
  try {
    const oldNs = window.localStorage.getItem("noSleepEnabled");
    if (oldNs !== null) noSleepEnabled = JSON.parse(oldNs) as boolean;
  } catch {
    // ignore
  }
  const merged = normalizeAppSettings({
    phases,
    soundEnabled,
    particlesEnabled,
    dynamicColorsEnabled,
    noSleepEnabled,
  });
  saveAppSettings(merged);
  return merged;
}

export function loadAppSettings(): AppSettings {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      return normalizeAppSettings(JSON.parse(saved) as Partial<AppSettings>);
    }
  } catch {
    // ignore
  }
  return migrateLegacyLocalStorage();
}

export function saveAppSettings(settings: AppSettings) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export const PHASE_COLORS = ["#87CEEB", "#A8D8EA", "#7EC8C8", "#B8A9C9"];
