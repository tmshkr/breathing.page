import { useState, useRef, useCallback } from "react";

interface BreathingTextProps {
  text: string;
}

export default function BreathingText({ text }: BreathingTextProps) {
  const [visible, setVisible] = useState(true);
  const visibleRef = useRef(true);

  // Stable reference so removeEventListener can find the same function.
  const handleDocumentClick = useCallback(() => {
    visibleRef.current = true;
    setVisible(true);
    document.removeEventListener("click", handleDocumentClick);
  }, []);

  function handleClick(e: React.MouseEvent) {
    // Stop propagation so this click doesn't immediately trigger
    // the document listener we are about to add.
    e.stopPropagation();
    visibleRef.current = false;
    setVisible(false);
    document.addEventListener("click", handleDocumentClick);
  }

  return (
    <h2
      id="text"
      style={{ color: visible ? "white" : "transparent" }}
      onClick={handleClick}
    >
      {text}
    </h2>
  );
}
