import { useState, useRef, useEffect } from "react";
import NoSleep from "nosleep.js";
import { Button, Drawer, DrawerSize } from "@blueprintjs/core";
import { Setting, DEFAULT_SETTINGS, loadSettings } from "../types";
import "./SideMenu.scss";

interface SideMenuProps {
  onSettingsChange: (newSettings: Setting[]) => void;
}

export default function SideMenu({ onSettingsChange }: SideMenuProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [noSleepEnabled, setNoSleepEnabled] = useState(false);
  const [formSettings, setFormSettings] = useState<Setting[]>(loadSettings);

  const noSleepRef = useRef<NoSleep | null>(null);

  useEffect(() => {
    noSleepRef.current = new NoSleep();
  }, []);

  function closeDrawer() {
    window.scrollTo(0, 0);
    setDrawerOpen(false);
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
    window.localStorage.setItem("settings", JSON.stringify(newSettings));
    onSettingsChange(newSettings);
    closeDrawer();
  }

  function resetSettings() {
    setFormSettings(DEFAULT_SETTINGS);
    window.localStorage.setItem("settings", JSON.stringify(DEFAULT_SETTINGS));
    onSettingsChange(DEFAULT_SETTINGS);
    closeDrawer();
  }

  function toggleNoSleep() {
    if (noSleepEnabled) {
      noSleepRef.current?.disable();
      setNoSleepEnabled(false);
    } else {
      noSleepRef.current?.enable();
      setNoSleepEnabled(true);
    }
    closeDrawer();
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
      <Button
        id="menu-button"
        icon="menu"
        minimal
        onClick={() => setDrawerOpen(true)}
        aria-label="Open menu"
      />

      <Drawer
        isOpen={drawerOpen}
        onClose={closeDrawer}
        position="right"
        size={DrawerSize.SMALL}
        title="Settings"
        className="bp-drawer side-menu-drawer"
      >
        <div className="bp5-drawer-body">
          <ul className="drawer-menu">
            <li className="menu-section">
              <h3 className="menu-heading">Breathing Phases</h3>
              <table className="phase-table">
                <tbody>
                  {phases.map((phase, i) => (
                    <tr key={phase.label}>
                      <td>
                        <label className="visually-hidden" htmlFor={`phase-word-${phase.label}`}>
                          {phase.label} label
                        </label>
                        <input
                          id={`phase-word-${phase.label}`}
                          type="text"
                          name="word"
                          value={formSettings[i][0]}
                          placeholder={phase.label}
                          onChange={(e) => handleFormChange(i, "word", e.target.value)}
                        />
                      </td>
                      <td>
                        <label className="visually-hidden" htmlFor={`phase-time-${phase.label}`}>
                          {phase.label} seconds
                        </label>
                        <input
                          id={`phase-time-${phase.label}`}
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
                      <Button name="reset" onClick={resetSettings}>reset</Button>
                    </td>
                    <td>
                      <Button name="save" intent="primary" onClick={saveSettings}>save</Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </li>
            <li className="menu-section">
              <Button
                id="noSleepToggle"
                minimal
                icon={noSleepEnabled ? "tick" : undefined}
                onClick={toggleNoSleep}
              >
                Prevent Display Sleep
              </Button>
            </li>
            <li className="menu-section">
              <a href="https://github.com/tmshkr/breathing/" target="_blank" rel="noreferrer">
                GitHub Repository
              </a>
            </li>
            <li className="menu-section">
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
      </Drawer>
    </>
  );
}
