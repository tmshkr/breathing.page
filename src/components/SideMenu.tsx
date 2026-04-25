import { useState, useRef, useEffect } from "react";
import NoSleep from "nosleep.js";
import { Button, Drawer, DrawerSize, Switch } from "@blueprintjs/core";
import {
  Setting,
  PlayfulSettings,
  DEFAULT_SETTINGS,
  loadSettings,
  loadNoSleepEnabled,
  saveNoSleepEnabled,
} from "../types";
import { useAuth } from "../auth/AuthContext";
import "./SideMenu.scss";

interface SideMenuProps {
  onSettingsChange: (newSettings: Setting[]) => void;
  playfulSettings: PlayfulSettings;
  onPlayfulChange: (settings: PlayfulSettings) => void;
}

export default function SideMenu({
  onSettingsChange,
  playfulSettings,
  onPlayfulChange,
}: SideMenuProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [noSleepEnabled, setNoSleepEnabled] = useState(loadNoSleepEnabled);
  const [formSettings, setFormSettings] = useState<Setting[]>(loadSettings);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authBusy, setAuthBusy] = useState(false);

  const { user, loading: authLoading, configured, signInWithGoogle, signOut } =
    useAuth();

  const noSleepRef = useRef<NoSleep | null>(null);

  useEffect(() => {
    noSleepRef.current = new NoSleep();
    if (noSleepEnabled) {
      Promise.resolve(noSleepRef.current.enable()).catch(() => {
        setNoSleepEnabled(false);
        saveNoSleepEnabled(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      saveNoSleepEnabled(false);
    } else {
      noSleepRef.current?.enable();
      setNoSleepEnabled(true);
      saveNoSleepEnabled(true);
    }
    closeDrawer();
  }

  function handleFormChange(
    index: number,
    field: "word" | "time",
    value: string,
  ) {
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

  function handlePlayfulToggle(key: keyof PlayfulSettings) {
    onPlayfulChange({ ...playfulSettings, [key]: !playfulSettings[key] });
  }

  async function handleSignIn() {
    setAuthError(null);
    setAuthBusy(true);
    try {
      await signInWithGoogle();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Sign-in failed";
      setAuthError(message);
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleSignOut() {
    setAuthError(null);
    setAuthBusy(true);
    try {
      await signOut();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Sign-out failed";
      setAuthError(message);
    } finally {
      setAuthBusy(false);
    }
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
                        <label
                          className="visually-hidden"
                          htmlFor={`phase-word-${phase.label}`}
                        >
                          {phase.label} label
                        </label>
                        <input
                          id={`phase-word-${phase.label}`}
                          type="text"
                          name="word"
                          value={formSettings[i][0]}
                          placeholder={phase.label}
                          onChange={(e) =>
                            handleFormChange(i, "word", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <label
                          className="visually-hidden"
                          htmlFor={`phase-time-${phase.label}`}
                        >
                          {phase.label} seconds
                        </label>
                        <input
                          id={`phase-time-${phase.label}`}
                          type="number"
                          name="time"
                          min={phase.minTime}
                          max="10"
                          value={formSettings[i][1]}
                          onChange={(e) =>
                            handleFormChange(i, "time", e.target.value)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td>
                      <Button name="reset" onClick={resetSettings}>
                        reset
                      </Button>
                    </td>
                    <td>
                      <Button
                        name="save"
                        intent="primary"
                        onClick={saveSettings}
                      >
                        save
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </li>
            <li className="menu-section">
              <h3 className="menu-heading">Extras</h3>
              <div className="extras-toggles">
                <Switch
                  checked={playfulSettings.soundEnabled}
                  label="Sound effects"
                  onChange={() => handlePlayfulToggle("soundEnabled")}
                />
                <Switch
                  checked={playfulSettings.particlesEnabled}
                  label="Celebrations"
                  onChange={() => handlePlayfulToggle("particlesEnabled")}
                />
                <Switch
                  checked={playfulSettings.dynamicColorsEnabled}
                  label="Color shifts"
                  onChange={() => handlePlayfulToggle("dynamicColorsEnabled")}
                />
              </div>
            </li>
            {configured && (
              <li className="menu-section account-section">
                <h3 className="menu-heading">Account</h3>
                {authLoading ? (
                  <div className="account-status">Loading…</div>
                ) : user ? (
                  <div className="account-info">
                    <div className="account-identity">
                      {user.photoURL && (
                        <img
                          className="account-avatar"
                          src={user.photoURL}
                          alt=""
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <div className="account-meta">
                        {user.displayName && (
                          <div className="account-name">{user.displayName}</div>
                        )}
                        {user.email && (
                          <div className="account-email">{user.email}</div>
                        )}
                      </div>
                    </div>
                    <Button
                      icon="log-out"
                      onClick={handleSignOut}
                      loading={authBusy}
                    >
                      Sign out
                    </Button>
                  </div>
                ) : (
                  <Button
                    icon="log-in"
                    intent="primary"
                    onClick={handleSignIn}
                    loading={authBusy}
                  >
                    Sign in with Google
                  </Button>
                )}
                {authError && (
                  <div className="account-error" role="alert">
                    {authError}
                  </div>
                )}
              </li>
            )}
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
              <a
                href="https://github.com/tmshkr/breathing.page/"
                target="_blank"
                rel="noreferrer"
              >
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
