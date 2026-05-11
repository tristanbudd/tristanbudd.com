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
            viewBox="0 0 1086 1000"
            width="210"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M658.626 0H932.664L797.669 184.48H614.718L658.626 0ZM932.32 0L1069.17 141.288L847.43 237.189L797.669 184.48L932.32 0ZM462.501 816.984H682.775L791.814 1000H417.129L462.501 816.984ZM799.132 638.361L1047.95 601.758L992.328 836.017L777.178 739.386L799.132 638.361ZM752.296 585.652L939.639 480.234L1047.95 601.758L799.132 638.361L752.296 585.652ZM753.76 402.636L821.086 348.463L939.639 480.234L752.296 585.652L753.76 402.636ZM562.027 402.636H753.76L752.296 585.652H517.387L562.027 402.636ZM821.086 348.463L847.43 237.189L1040.63 401.171L939.639 480.234L821.086 348.463ZM847.43 237.189L1069.17 141.288L1086 175.696L1040.63 401.171L847.43 237.189ZM682.775 816.984L777.178 739.386L992.328 836.017L791.814 1000L682.775 816.984ZM204.321 816.984L447.61 729.869L383.466 1000H160.997L204.321 816.984ZM460.995 673.499L218.357 757.687L397.371 0H620.572L460.995 673.499ZM342.485 84.9194H378.324L374.507 101.025H342.485V84.9194ZM286.868 52.7089H385.957L382.14 68.8138H286.868V52.7089ZM385.957 52.7089H107.819L149.288 0H398.102L385.957 52.7089ZM382.14 68.8138L378.324 84.9194H81.7529L94.7866 68.8138H382.14ZM374.507 101.025L370.691 117.131L55.6176 117.216L68.72 101.025H374.507ZM370.691 117.131L366.873 133.236H286.868V117.154L370.691 117.131ZM42.6535 133.236H366.873L354.381 185.945H0L42.6535 133.236Z"
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
