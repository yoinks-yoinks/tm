import confetti from "canvas-confetti";

type ConfettiOptions = {
  particleCount?: number;
  spread?: number;
  origin?: { x: number; y: number };
  colors?: string[];
};

const defaultOptions: ConfettiOptions = {
  particleCount: 100,
  spread: 70,
  origin: { x: 0.5, y: 0.6 },
  colors: ["#22c55e", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"],
};

export function fireConfetti(options: ConfettiOptions = {}) {
  // Check for reduced motion preference
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const mergedOptions = { ...defaultOptions, ...options };

  confetti({
    particleCount: mergedOptions.particleCount,
    spread: mergedOptions.spread,
    origin: mergedOptions.origin,
    colors: mergedOptions.colors,
    disableForReducedMotion: true,
  });
}

export function fireTaskCompletedConfetti() {
  // Small burst from center
  fireConfetti({
    particleCount: 50,
    spread: 60,
    origin: { x: 0.5, y: 0.5 },
  });
}

export function fireCelebration() {
  // Big celebration burst
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
}
