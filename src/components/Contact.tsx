"use client";

/**
 * @file Contact.tsx
 * @description Two-column contact section: description panel and contact form.
 */

import { ArrowRight, CheckCircle, Loader2, Send, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type FormStatus = "idle" | "loading" | "success" | "error";

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

function Field({ id, label, error, required, children }: FieldProps) {
  return (
    <div className="3xl:gap-2.5 4xl:gap-3 5xl:gap-3.5 flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="3xl:text-sm 4xl:text-base 5xl:text-lg text-xs font-bold tracking-widest text-zinc-500 uppercase"
      >
        {label}
        {required && <span className="ml-1 text-black">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs font-semibold text-red-500" role="alert">
          <XCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

const inputBase =
  "w-full rounded-xl border border-zinc-200/70 bg-white/60 px-4 py-3 text-sm font-medium text-zinc-900 placeholder-zinc-400 backdrop-blur-sm transition-all duration-200 outline-none focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5 3xl:px-5 3xl:py-4 3xl:text-base 4xl:text-lg 5xl:text-xl";
const inputError = "border-red-300 focus:border-red-500 focus:ring-red-500/10";

export interface ContactProps {
  linkedInUrl?: string;
  linkedInHandle?: string;
}

export default function Contact({
  linkedInUrl = "https://www.linkedin.com/in/tristanbudd",
  linkedInHandle = "tristanbudd",
}: ContactProps) {
  // Reveal animation
  const sectionRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Name is required.";
    if (!email.trim()) {
      next.email = "Email is required.";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      next.email = "Enter a valid email address.";
    }
    if (!message.trim()) next.message = "Message is required.";
    if (message.trim().length > 2000) next.message = "Message must be under 2 000 characters.";
    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };

      if (!res.ok || !data.success) {
        setServerError(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
      } else {
        setStatus("success");
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      }
    } catch {
      setServerError("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  };

  const resetForm = () => {
    setStatus("idle");
    setServerError("");
    setErrors({});
  };

  const revealClass = () =>
    `transition-all duration-700 ease-out ${
      revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
    }`;

  return (
    <section
      ref={sectionRef}
      aria-label="Contact"
      className="font-outfit 3xl:scroll-mt-36 3xl:py-24 w-full scroll-mt-24 py-12 transition-all duration-500 ease-in-out sm:scroll-mt-28 sm:py-16"
    >
      <div className="3xl:gap-x-24 3xl:gap-y-10 4xl:gap-x-32 4xl:gap-y-12 5xl:gap-x-40 5xl:gap-y-16 grid grid-cols-1 gap-6 lg:grid-cols-5 lg:grid-rows-[auto_1fr] lg:gap-x-16 xl:gap-x-20">
        {/*  Left editorial panel  */}
        <div
          className={`3xl:gap-6 4xl:gap-8 5xl:gap-10 order-1 flex flex-col gap-4 lg:col-span-2 lg:row-start-1 ${revealClass()}`}
          style={{ transitionDelay: "0ms" }}
        >
          {/* Eyebrow */}
          <span className="3xl:text-sm 4xl:text-base 5xl:text-lg text-xs font-bold tracking-widest text-zinc-500 uppercase">
            Contact
          </span>

          {/* Headline */}
          <h2 className="3xl:text-6xl 4xl:text-7xl 5xl:text-8xl text-3xl font-extrabold tracking-tight text-black sm:text-4xl lg:text-5xl">
            Get In Touch.
          </h2>

          {/* Body copy */}
          <p className="3xl:max-w-xl 3xl:text-lg 4xl:max-w-2xl 4xl:text-xl 5xl:max-w-3xl 5xl:text-2xl mt-2 max-w-sm text-sm leading-relaxed text-zinc-500 sm:text-base">
            Have a project, opportunity, or just want to say hello? Fill in the form and I&apos;ll
            get back to you as soon as I can.
          </p>
        </div>

        {/* Right form panel */}
        <div
          className={`3xl:max-w-3xl 4xl:max-w-4xl 5xl:max-w-5xl order-2 w-full lg:col-span-3 lg:col-start-3 lg:row-span-2 lg:row-start-1 lg:justify-self-end ${revealClass()}`}
          style={{ transitionDelay: "80ms" }}
        >
          <div className="group 3xl:rounded-3xl 3xl:p-10 4xl:p-12 5xl:p-16 relative overflow-hidden rounded-2xl border border-zinc-200/60 bg-white/40 p-8 shadow-xs backdrop-blur-md transition-all duration-300 hover:border-zinc-300 hover:bg-white/60 hover:shadow-md">
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 h-[3px] w-full origin-left scale-x-0 bg-linear-to-r from-zinc-700 via-black to-zinc-800 transition-transform duration-300 group-hover:scale-x-100" />

            {/* Success state */}
            {status === "success" && (
              <div className="flex flex-col items-center gap-6 py-8 text-center">
                <div className="3xl:h-20 3xl:w-20 flex h-16 w-16 items-center justify-center rounded-full border-2 border-black bg-black">
                  <CheckCircle className="3xl:h-10 3xl:w-10 h-8 w-8 text-white" />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="3xl:text-2xl text-xl font-extrabold tracking-tight text-black">
                    Message sent!
                  </h3>
                  <p className="3xl:text-base text-sm text-zinc-500">
                    Thanks for reaching out. I&apos;ll be in touch shortly.
                  </p>
                </div>
                <button
                  onClick={resetForm}
                  className="3xl:text-sm text-xs font-bold tracking-widest text-zinc-400 uppercase underline underline-offset-4 transition-colors duration-200 hover:text-black"
                >
                  Send another message
                </button>
              </div>
            )}

            {/* Form state */}
            {status !== "success" && (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="3xl:gap-8 4xl:gap-10 5xl:gap-12 flex flex-col gap-6"
              >
                {/* Name + Email row */}
                <div className="3xl:gap-8 4xl:gap-10 5xl:gap-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Field id="contact-name" label="Name" required error={errors.name}>
                    <input
                      id="contact-name"
                      type="text"
                      autoComplete="name"
                      placeholder="Jane Smith"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors((p) => ({ ...p, name: "" }));
                      }}
                      className={`${inputBase} ${errors.name ? inputError : ""}`}
                      disabled={status === "loading"}
                      aria-describedby={errors.name ? "contact-name-error" : undefined}
                      aria-invalid={!!errors.name}
                    />
                  </Field>

                  <Field id="contact-email" label="Email" required error={errors.email}>
                    <input
                      id="contact-email"
                      type="email"
                      autoComplete="email"
                      placeholder="jane@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((p) => ({ ...p, email: "" }));
                      }}
                      className={`${inputBase} ${errors.email ? inputError : ""}`}
                      disabled={status === "loading"}
                      aria-describedby={errors.email ? "contact-email-error" : undefined}
                      aria-invalid={!!errors.email}
                    />
                  </Field>
                </div>

                {/* Subject */}
                <Field id="contact-subject" label="Subject">
                  <input
                    id="contact-subject"
                    type="text"
                    placeholder="What's it about? (optional)"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className={inputBase}
                    disabled={status === "loading"}
                  />
                </Field>

                {/* Message */}
                <Field id="contact-message" label="Message" required error={errors.message}>
                  <textarea
                    id="contact-message"
                    rows={5}
                    placeholder="Tell me about your project, opportunity, or anything else…"
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (errors.message) setErrors((p) => ({ ...p, message: "" }));
                    }}
                    className={`${inputBase} resize-none ${errors.message ? inputError : ""}`}
                    disabled={status === "loading"}
                    aria-describedby={errors.message ? "contact-message-error" : undefined}
                    aria-invalid={!!errors.message}
                  />
                  <span className="self-end text-[10px] font-semibold tracking-wider text-zinc-400 uppercase">
                    {message.length} / 2 000
                  </span>
                </Field>

                {/* Server error banner */}
                {status === "error" && serverError && (
                  <div
                    role="alert"
                    className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700"
                  >
                    <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    {serverError}
                  </div>
                )}

                {/* Submit */}
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <p className="3xl:text-xs 4xl:text-sm 5xl:text-base text-[10px] font-semibold tracking-wider text-zinc-400 uppercase">
                    * Required fields
                  </p>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    aria-label="Send contact message"
                    className="group/btn 3xl:py-2 3xl:pr-2 3xl:pl-8 3xl:text-base 4xl:py-2.5 4xl:pr-2.5 4xl:pl-10 4xl:text-lg 5xl:py-3 5xl:pr-3 5xl:pl-12 5xl:text-xl relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-full border-2 border-black bg-black py-1.5 pr-1.5 pl-6 text-sm font-semibold text-white shadow-xs transition-colors duration-300 hover:text-black focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {/* Sliding background */}
                    <span className="absolute inset-0 origin-left scale-x-0 rounded-full bg-white transition-transform duration-300 ease-out group-hover/btn:scale-x-100 group-focus-visible/btn:scale-x-100" />

                    <span className="relative z-10 whitespace-nowrap transition-colors duration-300">
                      {status === "loading" ? "Sending…" : "Send Message"}
                    </span>

                    <div className="3xl:h-10 3xl:w-10 4xl:h-12 4xl:w-12 5xl:h-14 5xl:w-14 relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-white transition-colors duration-300 group-hover/btn:bg-black group-focus-visible/btn:bg-black">
                      {status === "loading" ? (
                        <Loader2 className="3xl:h-5 3xl:w-5 4xl:h-6 4xl:w-6 5xl:h-7 5xl:w-7 h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="3xl:h-5 3xl:w-5 4xl:h-6 4xl:w-6 5xl:h-7 5xl:w-7 h-4 w-4 transition-all duration-300 group-hover/btn:-rotate-12 group-focus-visible/btn:-rotate-12" />
                      )}
                    </div>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
        {/* LinkedIn: shown below form on mobile, bottom-left on desktop */}
        <div
          className={`3xl:max-w-xl 4xl:max-w-2xl 5xl:max-w-3xl order-3 w-full lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:self-start ${revealClass()}`}
          style={{ transitionDelay: "120ms" }}
        >
          <p className="3xl:text-sm 3xl:mb-4 4xl:text-base 4xl:mb-5 5xl:text-lg 5xl:mb-6 mb-3 text-xs font-bold tracking-widest text-zinc-400 uppercase">
            Or find me on
          </p>
          <a
            href={linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View LinkedIn profile of ${linkedInHandle}`}
            className="group 3xl:px-6 3xl:py-5 flex w-full items-center gap-3 rounded-xl border border-zinc-200/70 bg-white/40 px-5 py-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-400 hover:bg-white hover:shadow-md"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="3xl:h-6 3xl:w-6 4xl:h-7 4xl:w-7 5xl:h-8 5xl:w-8 h-5 w-5 shrink-0 text-zinc-800 transition-colors duration-300 group-hover:text-black"
              aria-hidden="true"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            <div className="flex flex-col">
              <span className="3xl:text-[0.7rem] 4xl:text-[0.8rem] 5xl:text-[0.9rem] text-xs font-bold tracking-widest text-zinc-500 uppercase">
                LinkedIn
              </span>
              <span className="3xl:text-base 4xl:text-lg 5xl:text-xl text-sm font-semibold text-zinc-900 transition-colors duration-300 group-hover:text-black">
                in/{linkedInHandle}
              </span>
            </div>
            <ArrowRight className="3xl:h-5 3xl:w-5 4xl:h-6 4xl:w-6 5xl:h-7 5xl:w-7 ml-auto h-4 w-4 -translate-x-1 text-zinc-400 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:text-black group-hover:opacity-100" />
          </a>
        </div>
      </div>
    </section>
  );
}
