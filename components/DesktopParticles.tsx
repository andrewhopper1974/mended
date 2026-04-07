"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

const COLORS = ["#8A5EFF", "#34CBBF", "#4675FF", "#c4afff", "#ffffff"];

// Deterministic pseudo-random so SSR + client match
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Particle {
  x: number;     // %
  y: number;     // %
  size: number;
  color: string;
  delay: number;
  dur: number;
  driftX: number;
  baseOpacity: number;
  peakOpacity: number;
}

function generateParticles(count: number, seed: number, region: "side" | "full"): Particle[] {
  const rand = mulberry32(seed);
  const out: Particle[] = [];
  for (let i = 0; i < count; i++) {
    let x: number;
    if (region === "side") {
      // Place in left (<15%) or right (>85%) columns
      x = rand() < 0.5 ? rand() * 15 : 85 + rand() * 15;
    } else {
      x = rand() * 100;
    }
    const y = rand() * 100;
    const size = 0.8 + rand() * 2.6; // 0.8–3.4 px
    const color = COLORS[Math.floor(rand() * COLORS.length)];
    const delay = rand() * 4;
    const dur = 3 + rand() * 4;
    const driftX = (rand() - 0.5) * 8;
    const baseOpacity = 0.05 + rand() * 0.15;
    const peakOpacity = 0.45 + rand() * 0.45;
    out.push({ x, y, size, color, delay, dur, driftX, baseOpacity, peakOpacity });
  }
  return out;
}

export default function DesktopParticles() {
  // Desktop: dense side columns (galaxy)
  const desktopParticles = useMemo(() => generateParticles(160, 1337, "side"), []);
  // Mobile/all sizes: scattered behind content (lower density to avoid clutter)
  const mobileParticles = useMemo(() => generateParticles(70, 4242, "full"), []);

  return (
    <>
      {/* Mobile + everywhere — behind content */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden lg:hidden"
        style={{ zIndex: 0 }}
      >
        {mobileParticles.map((p, i) => (
          <motion.div
            key={`m-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              background: p.color,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            }}
            animate={{
              y: [-6, 6, -6],
              x: [0, p.driftX, 0],
              opacity: [p.baseOpacity, p.peakOpacity, p.baseOpacity],
            }}
            transition={{
              repeat: Infinity,
              duration: p.dur,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Desktop side columns — dense galaxy */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden hidden lg:block"
        style={{ zIndex: 1 }}
      >
        {desktopParticles.map((p, i) => (
          <motion.div
            key={`d-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              background: p.color,
              boxShadow: `0 0 ${p.size * 2.5}px ${p.color}`,
            }}
            animate={{
              y: [-7, 7, -7],
              x: [0, p.driftX, 0],
              opacity: [p.baseOpacity, p.peakOpacity, p.baseOpacity],
            }}
            transition={{
              repeat: Infinity,
              duration: p.dur,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </>
  );
}
