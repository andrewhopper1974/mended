"use client";

import { motion } from "framer-motion";

// Particles confined to left (<15%) and right (>85%) side columns
// Only renders on screens >= 1024px (lg:) where side columns are at least ~170px wide
const PARTICLES = [
  // ── Left column ──
  { x: "1.5%", y: "4%",  size: 2.5, color: "#8A5EFF", delay: 0,    dur: 4.2, driftX:  3 },
  { x: "7%",   y: "12%", size: 1.5, color: "#34CBBF", delay: 1.1,  dur: 5.0, driftX: -2 },
  { x: "3%",   y: "22%", size: 3,   color: "#4675FF", delay: 0.5,  dur: 3.8, driftX:  4 },
  { x: "11%",  y: "34%", size: 2,   color: "#c4afff", delay: 1.8,  dur: 4.5, driftX: -3 },
  { x: "5%",   y: "44%", size: 1.5, color: "#8A5EFF", delay: 0.8,  dur: 5.2, driftX:  2 },
  { x: "13%",  y: "53%", size: 2,   color: "#34CBBF", delay: 2.0,  dur: 3.6, driftX: -4 },
  { x: "8%",   y: "63%", size: 2.5, color: "#4675FF", delay: 0.3,  dur: 4.8, driftX:  3 },
  { x: "2%",   y: "72%", size: 1.5, color: "#c4afff", delay: 1.4,  dur: 4.0, driftX: -2 },
  { x: "14%",  y: "80%", size: 2,   color: "#8A5EFF", delay: 2.5,  dur: 5.5, driftX:  2 },
  { x: "9%",   y: "90%", size: 3,   color: "#34CBBF", delay: 0.9,  dur: 4.3, driftX: -3 },
  { x: "6%",   y: "17%", size: 1.5, color: "#4675FF", delay: 1.6,  dur: 3.9, driftX:  4 },
  { x: "12%",  y: "28%", size: 2,   color: "#c4afff", delay: 0.6,  dur: 5.8, driftX: -2 },
  { x: "4%",   y: "58%", size: 3,   color: "#8A5EFF", delay: 2.2,  dur: 4.1, driftX:  3 },
  { x: "10%",  y: "40%", size: 1.5, color: "#34CBBF", delay: 0.4,  dur: 3.5, driftX: -3 },
  { x: "15%",  y: "68%", size: 2,   color: "#4675FF", delay: 1.9,  dur: 5.3, driftX:  2 },
  { x: "7%",   y: "96%", size: 1.5, color: "#c4afff", delay: 0.7,  dur: 4.6, driftX: -4 },
  { x: "1%",   y: "84%", size: 2.5, color: "#8A5EFF", delay: 1.3,  dur: 3.7, driftX:  4 },
  { x: "13%",  y: "7%",  size: 2,   color: "#34CBBF", delay: 2.8,  dur: 5.0, driftX: -2 },

  // ── Right column ──
  { x: "98.5%", y: "6%",  size: 2.5, color: "#34CBBF", delay: 0.6,  dur: 4.4, driftX: -3 },
  { x: "93%",   y: "16%", size: 2,   color: "#8A5EFF", delay: 1.5,  dur: 5.1, driftX:  2 },
  { x: "97%",   y: "26%", size: 1.5, color: "#4675FF", delay: 0.2,  dur: 3.9, driftX: -4 },
  { x: "87%",   y: "36%", size: 3,   color: "#c4afff", delay: 1.9,  dur: 4.6, driftX:  3 },
  { x: "95%",   y: "46%", size: 2,   color: "#8A5EFF", delay: 0.7,  dur: 5.3, driftX: -2 },
  { x: "86%",   y: "56%", size: 1.5, color: "#34CBBF", delay: 2.2,  dur: 3.7, driftX:  4 },
  { x: "91%",   y: "66%", size: 2.5, color: "#4675FF", delay: 1.0,  dur: 4.9, driftX: -3 },
  { x: "99%",   y: "76%", size: 2,   color: "#c4afff", delay: 0.4,  dur: 4.1, driftX:  2 },
  { x: "88%",   y: "86%", size: 2,   color: "#8A5EFF", delay: 2.8,  dur: 5.6, driftX: -2 },
  { x: "94%",   y: "95%", size: 3,   color: "#34CBBF", delay: 0.9,  dur: 4.2, driftX:  3 },
  { x: "89%",   y: "10%", size: 1.5, color: "#4675FF", delay: 1.7,  dur: 3.5, driftX: -4 },
  { x: "96%",   y: "20%", size: 2,   color: "#c4afff", delay: 0.5,  dur: 5.0, driftX:  2 },
  { x: "84%",   y: "32%", size: 3,   color: "#8A5EFF", delay: 2.4,  dur: 4.3, driftX: -3 },
  { x: "92%",   y: "42%", size: 1.5, color: "#34CBBF", delay: 0.3,  dur: 3.8, driftX:  4 },
  { x: "98%",   y: "52%", size: 2,   color: "#4675FF", delay: 1.2,  dur: 5.4, driftX: -2 },
  { x: "85%",   y: "62%", size: 2.5, color: "#c4afff", delay: 0.8,  dur: 4.7, driftX:  3 },
  { x: "90%",   y: "72%", size: 2,   color: "#8A5EFF", delay: 1.6,  dur: 3.6, driftX: -4 },
  { x: "87%",   y: "82%", size: 1.5, color: "#34CBBF", delay: 2.1,  dur: 5.2, driftX:  2 },
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
