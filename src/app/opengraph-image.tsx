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
          background: "linear-gradient(135deg, #faf7f2 0%, #f2ede4 100%)",
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
          <span style={{ fontSize: 96, color: "#191510", letterSpacing: -2 }}>IPROPY</span>
          <span style={{ fontSize: 22, color: "#a9702f", letterSpacing: 4, textTransform: "uppercase" }}>
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
            background: "#a9702f",
            borderRadius: 999,
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
