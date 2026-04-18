"use client";

export default function Home() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#f2f2f2",
      fontFamily: "'Montserrat', sans-serif",
      padding: "0 24px",
      textAlign: "center",
    }}>
      <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 42, color: "#C8A97E", marginBottom: 16 }}>
        S &amp; A
      </p>
      <p style={{ fontSize: 14, fontWeight: 400, color: "#000000", letterSpacing: "0.15em", marginBottom: 8 }}>
        This page is not accessible.
      </p>
      <p style={{ fontSize: 12, fontWeight: 300, color: "#9f9f9d" }}>
        Please use your personal invite link to access this site.
      </p>
    </div>
  );
}
