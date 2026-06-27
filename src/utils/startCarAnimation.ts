export function startCarAnimation(
  element: HTMLElement,
  velocity: number,
  distance: number,
) {
  const durationSec = distance / velocity;
  const travelPx = 500; // however you measure the track

  // start the CSS transition (or requestAnimationFrame loop)
  element.style.transition = `transform ${durationSec}s linear`;
  element.style.transform = `translateX(${travelPx}px)`;

  // return a "remote control" for this specific animation
  return {
    stop: () => {
      const { transform } = window.getComputedStyle(element);
      element.style.transition = "none";
      element.style.transform = transform; // freeze where it is
    },
  };
}