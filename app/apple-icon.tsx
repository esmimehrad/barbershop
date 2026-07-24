import { ImageResponse } from "next/og";

// iOS home-screen icon (Add to Home Screen). Next auto-injects the
// <link rel="apple-touch-icon">. Code-generated — no committed binary.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#121110", // --bds-paper
          color: "#d7a13c", // --bds-gold
          fontSize: 120,
          fontWeight: 700,
          fontFamily: "serif",
        }}
      >
        F
      </div>
    ),
    { ...size },
  );
}
