import { ImageResponse } from "next/og";
export const runtime = "edge";
export const alt = "Skyline Estates, luxury real estate in Dubai";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OG() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "linear-gradient(180deg,#05060f 0%,#2a2150 60%,#e0a35e 100%)", fontFamily: "serif" }}>
      <div style={{ fontSize: 30, color: "#ecd8a8", letterSpacing: 8 }}>SKYLINE ESTATES</div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 96, color: "#fff", lineHeight: 1 }}>Live above</div>
        <div style={{ fontSize: 96, color: "#d4a853", lineHeight: 1.05, fontStyle: "italic" }}>the ordinary.</div>
        <div style={{ fontSize: 28, color: "#e9e6df", marginTop: 28 }}>Dubai luxury homes · AI advisor Layla books viewings 24/7</div>
      </div>
    </div>, size);
}
