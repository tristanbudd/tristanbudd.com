/**
 * @file route.tsx
 * @description Dynamic Open Graph image generation for social media previews.
 */

import { ImageResponse } from "next/og";

export const runtime = "edge";

async function fetchOutfitFont(): Promise<ArrayBuffer> {
  const css = await fetch("https://fonts.googleapis.com/css2?family=Outfit:wght@100..900", {
    headers: {
      // Old Safari UA → Google Fonts returns format('truetype') TTF.
      // Modern browser UAs get woff2, which Satori cannot parse.
      "User-Agent":
        "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
    },
  }).then((res) => res.text());

  const match = css.match(/src: url\((.+?)\) format\('truetype'\)/);
  if (!match) throw new Error("Could not find Outfit TTF URL in Google Fonts response");

  return fetch(match[1]).then((res) => res.arrayBuffer());
}

export async function GET() {
  const outfitFont = await fetchOutfitFont();

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "#FAFAFA",
        padding: "100px",
        fontFamily: "Outfit",
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
            <path d="M466 120H293V708H171V120H0V0H466V120Z" fill="#000000" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M736 607L635 708H328V156H450V294H570L614 250V158L577 120H502V0H635L736 101V294L674 354L736 414V607ZM450 414V588H577L614 550V458L570 414H450Z"
              fill="#000000"
            />
          </svg>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: "88px",
              fontWeight: "900",
              color: "#000000",
              letterSpacing: "-0.04em",
              lineHeight: 1,
              fontFamily: "Outfit",
            }}
          >
            Tristan Budd
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "38px",
              fontWeight: "500",
              color: "#32383d",
              marginTop: "20px",
              letterSpacing: "-0.02em",
              fontFamily: "Outfit",
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
          fontWeight: "600",
          color: "#A1A1AA",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontFamily: "Outfit",
        }}
      >
        tristanbudd.com
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Outfit",
          data: outfitFont,
          weight: 500 as const,
          style: "normal" as const,
        },
        {
          name: "Outfit",
          data: outfitFont,
          weight: 900 as const,
          style: "normal" as const,
        },
      ],
    }
  );
}
