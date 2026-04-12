export default function ShutdownPage() {
  return (
    <main
      style={{
        textAlign: "center",
        padding: "2rem",
        maxWidth: "480px",
      }}
    >
      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: 600,
          marginBottom: "1rem",
          lineHeight: 1.4,
        }}
      >
        Mended is no longer accepting new signups.
      </h1>
      <p
        style={{
          fontSize: "1rem",
          opacity: 0.7,
          lineHeight: 1.6,
        }}
      >
        For any questions, contact{" "}
        <a
          href="mailto:PLACEHOLDER@example.com"
          style={{ color: "#8A5EFF", textDecoration: "underline" }}
        >
          PLACEHOLDER@example.com
        </a>
      </p>
    </main>
  );
}
