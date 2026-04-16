let audioCtx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (!audioCtx) {
    try {
      audioCtx = new AudioContext();
    } catch {
      return null;
    }
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(
  startFreq: number,
  endFreq: number,
  duration: number,
  gain: number,
) {
  const ctx = getContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + duration);

  gainNode.gain.setValueAtTime(gain, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

export function playPhaseSound(phaseIndex: number) {
  switch (phaseIndex) {
    case 0: // inhale — rising tone
      playTone(300, 500, 0.3, 0.08);
      break;
    case 1: // hold — soft sustained
      playTone(400, 400, 0.2, 0.05);
      break;
    case 2: // exhale — falling tone
      playTone(500, 300, 0.3, 0.08);
      break;
    case 3: // pause — very soft low tone
      playTone(250, 250, 0.2, 0.03);
      break;
  }
}

export function playMilestoneSound() {
  const ctx = getContext();
  if (!ctx) return;

  // Two-note ascending chime: C5 then E5
  const notes = [523.25, 659.25];
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const startTime = ctx.currentTime + i * 0.15;

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, startTime);

    gainNode.gain.setValueAtTime(0.12, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + 0.3);
  });
}
