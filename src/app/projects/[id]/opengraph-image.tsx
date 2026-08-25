import { ImageResponse } from "next/og";
import { getProject } from "@/lib/crm-client";
import { formatPriceRange } from "@/lib/format";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let name = "iPropy";
  let location = "";
  let price = "";
  let status = "";

  try {
    const { project } = await getProject(id);
    name = project.name;
    location = [project.locality, project.city].filter(Boolean).join(", ");
    price = formatPriceRange(project.price_min, project.price_max);
    status = project.status;
  } catch {
    // fall through to defaults on 404/error
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0e1211",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 30, color: "#f3ede1", letterSpacing: -1 }}>IPROPY</span>
          {status && (
            <span
              style={{
                fontSize: 20,
                color: "#f1cf9b",
                background: "#3a2c17",
                padding: "8px 20px",
                borderRadius: 999,
                display: "flex",
              }}
            >
              {status}
            </span>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 72, color: "#f3ede1", lineHeight: 1.1, display: "flex", maxWidth: 1000 }}>
            {name}
          </div>
          {location && (
            <div style={{ marginTop: 16, fontSize: 30, color: "#c9bfab", display: "flex" }}>{location}</div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <span style={{ fontSize: 24, color: "#8a8071" }}>Starting from</span>
          <span style={{ fontSize: 46, color: "#4cc189" }}>{price}</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
