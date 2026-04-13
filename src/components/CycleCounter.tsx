import { useState, useEffect } from "react";
import "./CycleCounter.scss";

interface CycleCounterProps {
  cycleCount: number;
  phaseIndex: number;
}

const MILESTONE_MESSAGES = ["nice!", "keep going!", "steady!", "smooth!", "great flow!"];

export default function CycleCounter({ cycleCount, phaseIndex }: CycleCounterProps) {
  const [showMilestone, setShowMilestone] = useState(false);

  const isMilestone = cycleCount > 0 && cycleCount % 5 === 0 && phaseIndex === 0;

  useEffect(() => {
    if (isMilestone) {
      setShowMilestone(true);
      const timer = setTimeout(() => setShowMilestone(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isMilestone]);

  if (cycleCount < 1) return null;

  const message = MILESTONE_MESSAGES[Math.floor(cycleCount / 5) % MILESTONE_MESSAGES.length];

  return (
    <div
      className={`cycle-counter ${showMilestone ? "milestone" : ""}`}
      aria-live="polite"
    >
      <span className="count">
        {cycleCount} {cycleCount === 1 ? "cycle" : "cycles"}
      </span>
      {showMilestone && <span className="milestone-msg">{message}</span>}
    </div>
  );
}
