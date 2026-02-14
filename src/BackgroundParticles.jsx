import { useCallback } from "react";
import Particles from "@tsparticles/react";
import { loadFull } from "tsparticles";

export default function BackgroundParticles() {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: true, zIndex: 0 },
  background: { color: "transparent" },
  detectRetina: true,
  fpsLimit: 60,
  interactivity: {
    events: {
      onClick: { enable: true, mode: "push" },
      onHover: { enable: true, mode: "repulse" },
      resize: true,
    },
    modes: {
      push: { quantity: 4 },
      repulse: { distance: 120, duration: 0.4 },
    },
  },
  particles: {
    number: { value: 70, density: { enable: true, area: 900 } },
    color: { value: "#ff2d6f" },
    links: { enable: true, color: "#ff2d6f", opacity: 0.2, distance: 140 },
    move: { enable: true, speed: 1.2 },
    opacity: { value: 0.45 },
    size: { value: { min: 1, max: 3 } },
  },
      }}
    />
  );
}
