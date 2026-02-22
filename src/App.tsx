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

