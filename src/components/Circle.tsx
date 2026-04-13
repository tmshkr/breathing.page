import { PHASE_COLORS } from "../types";
import "./Circle.scss";

interface CircleProps {
  scale: number;
  transition: string;
  phaseIndex: number;
  cycleCount: number;
  dynamicColorsEnabled: boolean;
}

export default function Circle({
  scale,
  transition,
  phaseIndex,
  cycleCount,
  dynamicColorsEnabled,
}: CircleProps) {
  const color = dynamicColorsEnabled && phaseIndex >= 0
    ? PHASE_COLORS[phaseIndex % PHASE_COLORS.length]
    : "#87CEEB";

  const isMilestone = cycleCount > 0 && cycleCount % 5 === 0 && phaseIndex === 0;

  return (
    <div
      id="circle"
      className={isMilestone ? "milestone" : ""}
      style={{
        transform: `scale(${scale})`,
        transition,
        WebkitTransition: transition,
        "--phase-color": color,
      } as React.CSSProperties}
    >
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" />
        {/* Ripple ring — key forces re-mount to restart animation */}
        <circle
          key={`${phaseIndex}-${cycleCount}`}
          className="ripple"
          cx="50"
          cy="50"
          r="48"
        />
      </svg>
    </div>
  );
}
