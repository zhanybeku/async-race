interface AnimationMetrics {
  travelPx: number;
  trackLengthPx: number;
}

function getAnimationMetrics(element: HTMLElement): AnimationMetrics | null {
  const row = element.closest("tr");
  if (!row) return null;

  const startLine = row.querySelector<HTMLElement>(".start-line");
  const finishLine = row.querySelector<HTMLElement>(".finish-line");
  const finishZone = row.querySelector<HTMLElement>(".finish-zone");
  if (!finishZone) return null;

  const carRect = element.getBoundingClientRect();
  const finishRect = finishZone.getBoundingClientRect();

  const finishCenter = finishRect.left + finishRect.width / 2;
  const targetLeft = finishCenter - carRect.width / 2;
  const travelPx = Math.max(targetLeft - carRect.left, 0);

  const trackLengthPx =
    startLine && finishLine
      ? Math.max(
          finishLine.getBoundingClientRect().right -
            startLine.getBoundingClientRect().left,
          0,
        )
      : travelPx;

  return { travelPx, trackLengthPx };
}

const activeAnimations = new WeakMap<HTMLElement, () => void>();

export function startCarAnimation(element: HTMLElement, velocity: number) {
  const metrics = getAnimationMetrics(element);
  if (!metrics) return { stop: () => {} };

  const { travelPx, trackLengthPx } = metrics;
  const durationMs = (trackLengthPx / velocity) * 500;

  element.style.transform = "translateX(0px)";

  const startTime = performance.now();
  let rafId = 0;
  let stopped = false;
  let lastProgress = 0;

  const tick = (now: number) => {
    if (stopped) return;

    const progress = Math.min((now - startTime) / durationMs, 1);
    lastProgress = progress;
    element.style.transform = `translateX(${travelPx * progress}px)`;

    if (progress < 1) {
      rafId = requestAnimationFrame(tick);
    }
  };

  rafId = requestAnimationFrame(tick);

  const stop = () => {
    stopped = true;
    cancelAnimationFrame(rafId);
    element.style.transform = `translateX(${travelPx * lastProgress}px)`;
  };

  activeAnimations.set(element, stop);

  return { stop };
}

export function resetCarPosition(element: HTMLElement) {
  activeAnimations.get(element)?.();
  activeAnimations.delete(element);
  element.style.transform = "";
}
