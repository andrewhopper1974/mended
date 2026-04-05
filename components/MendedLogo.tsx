"use client";

export default function MendedLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const textSize = size === "sm" ? "1.1rem" : size === "lg" ? "2.6rem" : "1.4rem";

  return (
    <span
      style={{
        fontSize: textSize,
        fontWeight: 700,
        letterSpacing: "-0.02em",
        fontFamily: "var(--font-playfair), Georgia, serif",
        background: "linear-gradient(90deg, #34CBBF 0%, #8A5EFF 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      mended
    </span>
  );
}
