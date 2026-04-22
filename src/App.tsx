import { useState, useEffect, useRef, useCallback } from "react";
import {
  Setting,
  PlayfulSettings,
  loadSettings,
  loadPlayfulSettings,
  savePlayfulSettings,
  PHASE_COLORS,
} from "./types";
import { playPhaseSound, playMilestoneSound } from "./audio";
import SideMenu from "./components/SideMenu";
import Circle from "./components/Circle";
import BreathingText from "./components/BreathingText";
import CycleCounter from "./components/CycleCounter";
import Particles from "./components/Particles";

export default function App() {
  const [settings, setSettings] = useState<Setting[]>(loadSettings);
  const [playful, setPlayful] = useState<PlayfulSettings>(loadPlayfulSettings);
  const [text, setText] = useState("ready");
  const [circleScale, setCircleScale] = useState(0.25);
  const [circleTransition, setCircleTransition] = useState("all 4.0s ease-in-out");
  const [phaseIndex, setPhaseIndex] = useState(-1);
  const [cycleCount, setCycleCount] = useState(0);

  const breatheTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playfulRef = useRef(playful);
  playfulRef.current = playful;

  const clearBreathTimeout = useCallback(() => {
    if (breatheTimeoutRef.current !== null) {
      clearTimeout(breatheTimeoutRef.current);
      breatheTimeoutRef.current = null;
    }
  }, []);

  const firstCycleRef = useRef(true);

  const breathe = useCallback((currentSettings: Setting[], phase = 0) => {
    const [word, timeStr] = currentSettings[phase];
    const duration = Number(timeStr);

    setPhaseIndex(phase);

    // Increment cycle count when wrapping back to inhale (phase 0) after completing a full cycle
    if (phase === 0) {
      if (firstCycleRef.current) {
        firstCycleRef.current = false;
      } else {
        setCycleCount((prev) => {
          const next = prev + 1;
          if (next > 0 && next % 5 === 0 && playfulRef.current.soundEnabled) {
            playMilestoneSound();
          }
          return next;
        });
      }
    }

    // Play phase sound if enabled
    if (playfulRef.current.soundEnabled && duration > 0) {
      playPhaseSound(phase);
    }

    // Show text always for inhale/exhale (even phases); only for hold/pause if duration > 0
    if (phase % 2 === 0 || duration > 0) {
      setText(word);
    }

    // Expand circle on inhale (phase 0), shrink on exhale (phase 2)
    if (phase === 0) {
      setCircleTransition(`all ${duration}s ease-in-out`);
      setCircleScale(1);
    } else if (phase === 2) {
      setCircleTransition(`all ${duration}s ease-in-out`);
      setCircleScale(0.25);
    }

    breatheTimeoutRef.current = setTimeout(() => {
      breathe(currentSettings, (phase + 1) % currentSettings.length);
    }, duration * 1000);
  }, []);

  useEffect(() => {
    breatheTimeoutRef.current = setTimeout(() => breathe(settings), 4000);
    return () => clearBreathTimeout();
  }, [breathe, clearBreathTimeout]);

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.hidden) {
        clearBreathTimeout();
        setPhaseIndex(-1);
        setText("ready");
        setCircleScale(0.25);
        firstCycleRef.current = true;
      } else {
        clearBreathTimeout();
        breatheTimeoutRef.current = setTimeout(() => breathe(settings), 4000);
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [settings, breathe, clearBreathTimeout]);

  // Set background accent color based on phase
  useEffect(() => {
    if (playful.dynamicColorsEnabled && phaseIndex >= 0) {
      const color = PHASE_COLORS[phaseIndex % PHASE_COLORS.length];
      // Convert hex to rgba with low opacity for ambient bg
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      document.documentElement.style.setProperty(
        "--bg-accent",
        `rgba(${r}, ${g}, ${b}, 0.06)`,
      );
    } else {
      document.documentElement.style.setProperty(
        "--bg-accent",
        "rgba(135, 206, 235, 0.06)",
      );
    }
  }, [phaseIndex, playful.dynamicColorsEnabled]);

  function handleSettingsChange(newSettings: Setting[]) {
    setSettings(newSettings);
    clearBreathTimeout();
    setCycleCount(0);
    setPhaseIndex(-1);
    firstCycleRef.current = true;
    breathe(newSettings);
  }

  function handlePlayfulChange(newPlayful: PlayfulSettings) {
    setPlayful(newPlayful);
    savePlayfulSettings(newPlayful);
  }

  return (
    <>
      <SideMenu
        onSettingsChange={handleSettingsChange}
        playfulSettings={playful}
        onPlayfulChange={handlePlayfulChange}
      />
      <div
        id="main-view"
        onTouchMove={(e) => e.preventDefault()}
      >
        <Circle
          scale={circleScale}
          transition={circleTransition}
          phaseIndex={phaseIndex}
          cycleCount={cycleCount}
          dynamicColorsEnabled={playful.dynamicColorsEnabled}
        />
        <BreathingText text={text} />
        <CycleCounter cycleCount={cycleCount} phaseIndex={phaseIndex} />
        <Particles trigger={cycleCount} enabled={playful.particlesEnabled} />
      </div>
    </>
  );
}
