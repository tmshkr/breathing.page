import "./Circle.scss";

interface CircleProps {
  scale: number;
  transition: string;
}

export default function Circle({ scale, transition }: CircleProps) {
  return (
    <div
      id="circle"
      style={{
        transform: `scale(${scale})`,
        transition,
        WebkitTransition: transition,
      }}
    >
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" />
      </svg>
    </div>
  );
}
