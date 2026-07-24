import { ImageResponse } from "next/og";

// Code-generated brand icon (favicon + manifest icon) — no committed binary.
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
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
          fontSize: 340,
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
