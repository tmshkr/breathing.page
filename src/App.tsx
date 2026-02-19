import { useState, useEffect, useRef, useCallback } from "react";
import NoSleep from "nosleep.js";

type Setting = [string, number];

const DEFAULT_SETTINGS: Setting[] = [
  ["inhale", 4],
  ["hold", 4],
  ["exhale", 4],
  ["pause", 4],
];

function loadSettings(): Setting[] {
  try {
    const saved = window.localStorage.getItem("settings");
    if (saved !== null) return JSON.parse(saved) as Setting[];
  } catch (e) {
    // ignore
  }
  return DEFAULT_SETTINGS;
}

export default function App() {
  const [settings, setSettings] = useState<Setting[]>(loadSettings);
  const [text, setText] = useState("ready");
  const [textVisible, setTextVisible] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [noSleepEnabled, setNoSleepEnabled] = useState(false);
  const [circleScale, setCircleScale] = useState(0.25);
  const [circleTransition, setCircleTransition] = useState("all 4.0s ease-in-out");
  const [formSettings, setFormSettings] = useState<Setting[]>(loadSettings);

  const noSleepRef = useRef<NoSleep | null>(null);
  const breatheTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearBreathTimeout = useCallback(() => {
    if (breatheTimeoutRef.current !== null) {
      clearTimeout(breatheTimeoutRef.current);
      breatheTimeoutRef.current = null;
    }
  }, []);

  const breathe = useCallback((currentSettings: Setting[]) => {
    const words = currentSettings.map((s) => s[0]);
    const time = currentSettings.map((s) => Number(s[1]));

    setText(words[0]);
    setCircleTransition(`all ${time[0]}s ease-in-out`);
    setCircleScale(1);

    breatheTimeoutRef.current = setTimeout(() => {
      if (time[1] > 0) setText(words[1]);

      breatheTimeoutRef.current = setTimeout(() => {
        setText(words[2]);
        setCircleTransition(`all ${time[2]}s ease-in-out`);
        setCircleScale(0.25);

        breatheTimeoutRef.current = setTimeout(() => {
          if (time[3] > 0) setText(words[3]);

          breatheTimeoutRef.current = setTimeout(() => {
            breathe(currentSettings);
          }, time[3] * 1000);
        }, time[2] * 1000);
      }, time[1] * 1000);
    }, time[0] * 1000);
  }, []);

  useEffect(() => {
    noSleepRef.current = new NoSleep();
    breatheTimeoutRef.current = setTimeout(() => breathe(settings), 4000);
    return () => clearBreathTimeout();
  }, [breathe, clearBreathTimeout]);

  function handleTextClick() {
    if (textVisible) {
      setTextVisible(false);
      document.addEventListener("click", handleTextClick);
    } else {
      setTextVisible(true);
      document.removeEventListener("click", handleTextClick);
    }
  }

  function closeSidebar() {
    window.scrollTo(0, 0);
    setSidebarOpen(false);
  }

  function toggleSidebar() {
    setSidebarOpen((open) => !open);
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    const key = e.keyCode || e.which;
    if (key === 13) {
      const target = e.target as HTMLInputElement;
      if (["time", "word", "save"].indexOf(target.name) > -1) {
        saveSettings();
      } else if (target.name === "reset") {
        resetSettings();
      } else if (target.id === "noSleepToggle") {
        toggleNoSleep();
      } else {
        toggleSidebar();
      }
      document.getElementById("sidebar-toggle")?.focus();
    }
  }

  function saveSettings() {
    const newSettings: Setting[] = formSettings.map(([word, time], i) => {
      let t = Number(time);
      let w = word;
      if (t <= 0 && i % 2 === 1) {
        t = 0;
        w = "";
      }
      if (t < 2 && i % 2 === 0) t = 2;
      if (t > 10) t = 10;
      return [w, t];
    });
    setFormSettings(newSettings);
    setSettings(newSettings);
    window.localStorage.setItem("settings", JSON.stringify(newSettings));
    clearBreathTimeout();
    breathe(newSettings);
    closeSidebar();
  }

  function resetSettings() {
    setFormSettings(DEFAULT_SETTINGS);
    setSettings(DEFAULT_SETTINGS);
    window.localStorage.setItem("settings", JSON.stringify(DEFAULT_SETTINGS));
    clearBreathTimeout();
    breathe(DEFAULT_SETTINGS);
    closeSidebar();
  }

  function toggleNoSleep() {
    if (noSleepEnabled) {
      noSleepRef.current?.disable();
      setNoSleepEnabled(false);
    } else {
      noSleepRef.current?.enable();
      setNoSleepEnabled(true);
    }
    toggleSidebar();
  }

  function handleFormChange(index: number, field: "word" | "time", value: string) {
    setFormSettings((prev) => {
      const next: Setting[] = prev.map(([w, t]) => [w, t]);
      if (field === "word") {
        next[index][0] = value;
      } else {
        next[index][1] = Number(value);
      }
      return next;
    });
  }

  const phases = [
    { label: "inhale", minTime: 2 },
    { label: "hold", minTime: 0 },
    { label: "exhale", minTime: 2 },
    { label: "pause", minTime: 0 },
  ];

  return (
    <>
      <a
        id="sidebar-toggle"
        tabIndex={0}
        className={sidebarOpen ? "open" : ""}
        onClick={toggleSidebar}
        onKeyDown={handleKeyPress}
      >
        <span></span>
      </a>
      <main
        id="main"
        style={{ transform: sidebarOpen ? "translateX(-15em)" : "translateX(0)" }}
      >
        <div id="sidebar">
          <div></div>
          <ul>
            <li>
              <table>
                <tbody>
                  {phases.map((phase, i) => (
                    <tr key={phase.label}>
                      <td>
                        <input
                          type="text"
                          name="word"
                          value={formSettings[i][0]}
                          onChange={(e) => handleFormChange(i, "word", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="time"
                          min={phase.minTime}
                          max="10"
                          value={formSettings[i][1]}
                          onChange={(e) => handleFormChange(i, "time", e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td>
                      <input
                        type="button"
                        value="reset"
                        name="reset"
                        onClick={resetSettings}
                        onKeyDown={handleKeyPress}
                      />
                    </td>
                    <td>
                      <input
                        type="button"
                        value="save"
                        name="save"
                        onClick={saveSettings}
                        onKeyDown={handleKeyPress}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </li>
            <li>
              <a
                id="noSleepToggle"
                tabIndex={0}
                className={noSleepEnabled ? "checked" : ""}
                onClick={toggleNoSleep}
                onKeyDown={handleKeyPress}
              >
                Prevent Display Sleep
              </a>
            </li>
            <li>
              <a href="https://github.com/tmshkr/breathing/" target="_blank" rel="noreferrer">
                GitHub Repository
              </a>
            </li>
            <li>
              <a
                href="https://github.com/tmshkr/breathing/blob/master/LICENSE"
                target="_blank"
                rel="noreferrer"
              >
                License
              </a>
            </li>
          </ul>
        </div>
        <div
          id="main-view"
          onTouchMove={(e) => e.preventDefault()}
        >
          <div
            id="circle"
            style={{
              transform: `scale(${circleScale})`,
              transition: circleTransition,
              WebkitTransition: circleTransition,
            }}
          >
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="50" />
            </svg>
          </div>
          <h2
            id="text"
            style={{ color: textVisible ? "white" : "transparent" }}
            onClick={handleTextClick}
          >
            {text}
          </h2>
        </div>
      </main>
    </>
  );
}
