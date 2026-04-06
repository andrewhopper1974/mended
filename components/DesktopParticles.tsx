"use client";

import { motion } from "framer-motion";

// Particles confined to left (<15%) and right (>85%) side columns
// Only renders on screens >= 1024px (lg:) where side columns are at least ~170px wide
const PARTICLES = [
  // ── Left column ──
  { x: "1.5%", y: "7%",  size: 2.5, color: "#8A5EFF", delay: 0,    dur: 4.2, driftX:  3 },
  { x: "7%",   y: "18%", size: 1.5, color: "#34CBBF", delay: 1.1,  dur: 5.0, driftX: -2 },
  { x: "3%",   y: "32%", size: 3,   color: "#4675FF", delay: 0.5,  dur: 3.8, driftX:  4 },
  { x: "11%",  y: "47%", size: 2,   color: "#c4afff", delay: 1.8,  dur: 4.5, driftX: -3 },
  { x: "5%",   y: "62%", size: 1.5, color: "#8A5EFF", delay: 0.8,  dur: 5.2, driftX:  2 },
  { x: "13%",  y: "54%", size: 2,   color: "#34CBBF", delay: 2.0,  dur: 3.6, driftX: -4 },
  { x: "8%",   y: "76%", size: 2.5, color: "#4675FF", delay: 0.3,  dur: 4.8, driftX:  3 },
  { x: "2%",   y: "88%", size: 1.5, color: "#c4afff", delay: 1.4,  dur: 4.0, driftX: -2 },
  { x: "14%",  y: "23%", size: 2,   color: "#8A5EFF", delay: 2.5,  dur: 5.5, driftX:  2 },
  { x: "9%",   y: "93%", size: 3,   color: "#34CBBF", delay: 0.9,  dur: 4.3, driftX: -3 },
  { x: "6%",   y: "40%", size: 1.5, color: "#4675FF", delay: 1.6,  dur: 3.9, driftX:  4 },
  { x: "12%",  y: "70%", size: 2,   color: "#c4afff", delay: 0.6,  dur: 5.8, driftX: -2 },

  // ── Right column ──
  { x: "98.5%", y: "11%", size: 2.5, color: "#34CBBF", delay: 0.6,  dur: 4.4, driftX: -3 },
  { x: "93%",   y: "22%", size: 2,   color: "#8A5EFF", delay: 1.5,  dur: 5.1, driftX:  2 },
  { x: "97%",   y: "38%", size: 1.5, color: "#4675FF", delay: 0.2,  dur: 3.9, driftX: -4 },
  { x: "87%",   y: "50%", size: 3,   color: "#c4afff", delay: 1.9,  dur: 4.6, driftX:  3 },
  { x: "95%",   y: "65%", size: 2,   color: "#8A5EFF", delay: 0.7,  dur: 5.3, driftX: -2 },
  { x: "86%",   y: "28%", size: 1.5, color: "#34CBBF", delay: 2.2,  dur: 3.7, driftX:  4 },
  { x: "91%",   y: "78%", size: 2.5, color: "#4675FF", delay: 1.0,  dur: 4.9, driftX: -3 },
  { x: "99%",   y: "85%", size: 2,   color: "#c4afff", delay: 0.4,  dur: 4.1, driftX:  2 },
  { x: "88%",   y: "15%", size: 2,   color: "#8A5EFF", delay: 2.8,  dur: 5.6, driftX: -2 },
  { x: "94%",   y: "44%", size: 3,   color: "#34CBBF", delay: 0.9,  dur: 4.2, driftX:  3 },
  { x: "89%",   y: "58%", size: 1.5, color: "#4675FF", delay: 1.7,  dur: 3.5, driftX: -4 },
  { x: "96%",   y: "92%", size: 2,   color: "#c4afff", delay: 0.5,  dur: 5.0, driftX:  2 },
];

export default function DesktopParticles() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
    >
      {PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full hidden lg:block"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            background: p.color,
          }}
          animate={{
            y: [-7, 7, -7],
            x: [0, p.driftX, 0],
            opacity: [0.2, 0.65, 0.2],
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
  );
}
