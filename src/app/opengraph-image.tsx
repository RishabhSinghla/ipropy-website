import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f4f5f2",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 14,
          }}
        >
          <span style={{ fontSize: 96, color: "#0e1211", letterSpacing: -2 }}>IPROPY</span>
          <span style={{ fontSize: 22, color: "#1c7e53", letterSpacing: 4, textTransform: "uppercase" }}>
            Bespoke Living
          </span>
        </div>
        <div style={{ marginTop: 24, fontSize: 30, color: "#524a3f", display: "flex" }}>
          Curated, Title-Verified Properties
        </div>
        <div
          style={{
            marginTop: 48,
            width: 120,
            height: 4,
            background: "#1c7e53",
            borderRadius: 999,
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
