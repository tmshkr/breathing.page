import { useRef, useEffect, useCallback } from "react";
import { PHASE_COLORS } from "../types";

interface ParticlesProps {
  trigger: number; // cycleCount — fires on milestone changes
  enabled: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  opacity: number;
  life: number;
  maxLife: number;
}

export default function Particles({ trigger, enabled }: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const alive: Particle[] = [];
    for (const p of particlesRef.current) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.02; // very light gravity
      p.life -= 1;
      p.opacity = Math.max(0, (p.life / p.maxLife) * 0.8);

      if (p.life > 0) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(")", `, ${p.opacity})`).replace("rgb", "rgba");
        ctx.fill();
        alive.push(p);
      }
    }

    particlesRef.current = alive;

    if (alive.length > 0) {
      animFrameRef.current = requestAnimationFrame(animate);
    }
  }, []);

  useEffect(() => {
    if (!enabled || trigger === 0 || trigger % 5 !== 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cx = canvas.width / 2;
    const cy = canvas.height * 0.35; // roughly where the circle center is

    const newParticles: Particle[] = [];
    for (let i = 0; i < 25; i++) {
      const angle = (Math.PI * 2 * i) / 25 + (Math.random() - 0.5) * 0.5;
      const speed = 1.5 + Math.random() * 2.5;
      const life = 80 + Math.random() * 40;
      const color = PHASE_COLORS[Math.floor(Math.random() * PHASE_COLORS.length)];

      // Convert hex to rgb for alpha manipulation
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);

      newParticles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1, // slight upward bias
        radius: 2 + Math.random() * 4,
        color: `rgb(${r}, ${g}, ${b})`,
        opacity: 0.8,
        life,
        maxLife: life,
      });
    }

    particlesRef.current = [...particlesRef.current, ...newParticles];
    cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(animate);
  }, [trigger, enabled, animate]);

  useEffect(() => {
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 10,
      }}
    />
  );
}
