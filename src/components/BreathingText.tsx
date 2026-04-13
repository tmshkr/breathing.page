import { useState, useRef, useCallback, useEffect } from "react";
import "./BreathingText.scss";

interface BreathingTextProps {
  text: string;
}

export default function BreathingText({ text }: BreathingTextProps) {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const visibleRef = useRef(true);

  useEffect(() => {
    setFading(true);
    const timer = setTimeout(() => setFading(false), 150);
    return () => clearTimeout(timer);
  }, [text]);

  const handleDocumentClick = useCallback(() => {
    visibleRef.current = true;
    setVisible(true);
    document.removeEventListener("click", handleDocumentClick);
  }, []);

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    visibleRef.current = false;
    setVisible(false);
    document.addEventListener("click", handleDocumentClick);
  }

  return (
    <h2
      id="text"
      className={fading ? "fading" : ""}
      style={{ color: visible ? "white" : "transparent" }}
      onClick={handleClick}
    >
      {text}
    </h2>
  );
}
