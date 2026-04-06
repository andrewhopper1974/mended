"use client";

interface Props {
  progress: number; // 0-1
}

export default function ProgressBar({ progress }: Props) {
  return (
    <div
      className="w-full"
      style={{
        height: "4px",
        background: "#2d2850",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="progress-fill"
        style={{
          width: `${Math.min(progress * 100, 100)}%`,
          minWidth: progress > 0 ? "6px" : "0px",
        }}
      />
    </div>
  );
}
