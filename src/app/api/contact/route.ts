/**
 * @file route.ts
 * @description Contact form submission handler. Validates fields and sends email via Resend.
 */

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const RECIPIENT = "contact@tristanbudd.com";
const SENDER = "Portfolio Contact <contact@tristanbudd.com>";

// In-memory rate limiting resets on server restarts. This approach prevents basic form spam.
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_IP = 5;
const MAX_GLOBAL = 25;

interface RateBucket {
  count: number;
  resetAt: number;
}

const ipBuckets = new Map<string, RateBucket>();
let globalBucket: RateBucket = { count: 0, resetAt: Date.now() + WINDOW_MS };

/**
 * Extract the best-available client IP from request headers.
 */
function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

/**
 * Increments the relevant buckets and returns a 429 Response if either limit
 * is exceeded, or null if the request is allowed through.
 */
function checkRateLimit(ip: string): NextResponse | null {
  const now = Date.now();

  // Prune expired IP entries
  for (const [key, bucket] of ipBuckets) {
    if (now > bucket.resetAt) ipBuckets.delete(key);
  }

  // Reset global bucket if the window has elapsed
  if (now > globalBucket.resetAt) {
    globalBucket = { count: 0, resetAt: now + WINDOW_MS };
  }

  // Check global ceiling first
  if (globalBucket.count >= MAX_GLOBAL) {
    const retryAfter = Math.ceil((globalBucket.resetAt - now) / 1000);
    return NextResponse.json(
      { error: "The contact form is temporarily unavailable. Please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  // Check per-IP limit
  const ipBucket = ipBuckets.get(ip) ?? { count: 0, resetAt: now + WINDOW_MS };
  if (ipBucket.count >= MAX_PER_IP) {
    const retryAfter = Math.ceil((ipBucket.resetAt - now) / 1000);
    return NextResponse.json(
      {
        error: `You've reached the limit of ${MAX_PER_IP} messages per hour. Please try again later.`,
      },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  // Allow and increment both buckets
  ipBuckets.set(ip, { count: ipBucket.count + 1, resetAt: ipBucket.resetAt });
  globalBucket.count += 1;

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const ip = getIp(req);
    const limitResponse = checkRateLimit(ip);
    if (limitResponse) return limitResponse;

    const body = (await req.json()) as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
    };

    const { name, email, subject, message } = body;

    // Basic server-side validation
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    // Splits text into HTML paragraphs. Email clients ignore CSS whitespace styling (pre-wrap).
    const safe = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const formatMessage = (text: string) =>
      text
        .trim()
        .split(/\n{2,}/)
        .map((para) => para.replace(/\n/g, "<br>"))
        .map(
          (para) =>
            `<p style="margin: 0 0 12px; font-size: 14px; color: #3f3f46; line-height: 1.7;">${safe(para)}</p>`
        )
        .join("");

    const { error } = await resend.emails.send({
      from: SENDER,
      to: RECIPIENT,
      replyTo: email,
      subject: subject?.trim()
        ? `Portfolio - ${subject.trim()}`
        : `Portfolio - Message from ${name.trim()}`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #fafafa; border-radius: 12px; border: 1px solid #e4e4e7;">
          <p style="margin: 0 0 4px; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #a1a1aa;">Portfolio contact form</p>
          <h2 style="margin: 0 0 24px; font-size: 22px; font-weight: 800; color: #000; letter-spacing: -0.02em;">${safe(name.trim())} got in touch</h2>

          <p style="margin: 0 0 4px; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #a1a1aa;">From</p>
          <p style="margin: 0 0 16px; font-size: 14px; font-weight: 600; color: #18181b;"><a href="mailto:${email}" style="color: #000;">${safe(email)}</a></p>

          ${subject?.trim() ? `<p style="margin: 0 0 4px; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #a1a1aa;">Subject</p><p style="margin: 0 0 16px; font-size: 14px; font-weight: 600; color: #18181b;">${safe(subject.trim())}</p>` : ""}

          <p style="margin: 0 0 8px; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #a1a1aa;">Message</p>
          <div style="background: #fff; border: 1px solid #e4e4e7; border-radius: 8px; padding: 20px 20px 8px;">
            ${formatMessage(message)}
          </div>

          <p style="margin: 24px 0 0; font-size: 11px; color: #a1a1aa;">Sent from tristanbudd.com</p>
        </div>
      `,
    });

    if (error) {
      console.error("Contact API - Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send message. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Contact API - Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
