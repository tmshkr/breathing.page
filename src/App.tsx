import { useState, useEffect, useRef, useCallback } from "react";
import { Setting, loadSettings } from "./types";
import SideMenu from "./components/SideMenu";
import Circle from "./components/Circle";
import BreathingText from "./components/BreathingText";

export default function App() {
  const [settings, setSettings] = useState<Setting[]>(loadSettings);
  const [text, setText] = useState("ready");
  const [circleScale, setCircleScale] = useState(0.25);
  const [circleTransition, setCircleTransition] = useState("all 4.0s ease-in-out");

  const breatheTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearBreathTimeout = useCallback(() => {
    if (breatheTimeoutRef.current !== null) {
      clearTimeout(breatheTimeoutRef.current);
      breatheTimeoutRef.current = null;
    }
  }, []);

  const breathe = useCallback((currentSettings: Setting[], phaseIndex = 0) => {
    const [word, timeStr] = currentSettings[phaseIndex];
    const duration = Number(timeStr);

    // Show text always for inhale/exhale (even phases); only for hold/pause if duration > 0
    if (phaseIndex % 2 === 0 || duration > 0) {
      setText(word);
    }

    // Expand circle on inhale (phase 0), shrink on exhale (phase 2)
    if (phaseIndex === 0) {
      setCircleTransition(`all ${duration}s ease-in-out`);
      setCircleScale(1);
    } else if (phaseIndex === 2) {
      setCircleTransition(`all ${duration}s ease-in-out`);
      setCircleScale(0.25);
    }

    breatheTimeoutRef.current = setTimeout(() => {
      breathe(currentSettings, (phaseIndex + 1) % currentSettings.length);
    }, duration * 1000);
  }, []);

  useEffect(() => {
    breatheTimeoutRef.current = setTimeout(() => breathe(settings), 4000);
    return () => clearBreathTimeout();
  }, [breathe, clearBreathTimeout]);

  function handleSettingsChange(newSettings: Setting[]) {
    setSettings(newSettings);
    clearBreathTimeout();
    breathe(newSettings);
  }

  return (
    <>
      <SideMenu onSettingsChange={handleSettingsChange} />
      <div
        id="main-view"
        onTouchMove={(e) => e.preventDefault()}
      >
        <Circle scale={circleScale} transition={circleTransition} />
        <BreathingText text={text} />
      </div>
    </>
  );
}

