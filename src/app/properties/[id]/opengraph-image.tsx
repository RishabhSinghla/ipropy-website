import { ImageResponse } from "next/og";
import { getProperty } from "@/lib/crm-client";
import { formatIndianPrice, formatArea } from "@/lib/format";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let title = "iPropy";
  let location = "";
  let price = "";
  let area = "";
  let configuration = "";

  try {
    const property = await getProperty(id);
    title = property.project_name ?? property.name;
    location = [property.locality, property.city].filter(Boolean).join(", ");
    price = formatIndianPrice(property.total_price ?? property.base_price);
    area = property.carpet_area ? formatArea(property.carpet_area, property.area_unit) : "";
    configuration = property.configuration ?? "";
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
          {configuration && (
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
              {configuration}
            </span>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 68, color: "#f3ede1", lineHeight: 1.1, display: "flex", maxWidth: 1000 }}>
            {title}
          </div>
          <div style={{ marginTop: 16, fontSize: 28, color: "#c9bfab", display: "flex", gap: 16 }}>
            {location && <span style={{ display: "flex" }}>{location}</span>}
            {area && <span style={{ display: "flex" }}>· {area}</span>}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <span style={{ fontSize: 24, color: "#8a8071" }}>All-inclusive price</span>
          <span style={{ fontSize: 46, color: "#4cc189" }}>{price}</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
