/**
 * @file route.tsx
 * @description Dynamic Open Graph image generation for social media previews.
 */

import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "#FEFEFE",
        padding: "100px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        position: "relative",
        alignItems: "flex-start",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: "-150px",
          right: "-150px",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,0,0,0.02) 0%, transparent 70%)",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "70px",
        }}
      >
        <div style={{ display: "flex", width: "210px", height: "210px" }}>
          <svg
            fill="none"
            height="210"
            viewBox="0 0 736 708"
            width="218"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M466 120H293V708H171V120H0V0H466V120Z" fill="#171717" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M736 607L635 708H328V156H450V294H570L614 250V158L577 120H502V0H635L736 101V294L674 354L736 414V607ZM450 414V588H577L614 550V458L570 414H450Z"
              fill="#171717"
            />
          </svg>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: "92px",
              fontWeight: "700",
              color: "#171717",
              letterSpacing: "-0.04em",
              lineHeight: 1,
            }}
          >
            Tristan Budd
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "40px",
              fontWeight: "400",
              color: "#666666",
              marginTop: "16px",
              letterSpacing: "-0.01em",
            }}
          >
            Software Engineer
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          position: "absolute",
          bottom: "80px",
          left: "100px",
          fontSize: "20px",
          fontWeight: "500",
          color: "#A1A1AA",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        tristanbudd.com
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    }
  );
}
