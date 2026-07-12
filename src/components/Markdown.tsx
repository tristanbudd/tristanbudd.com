"use client";

/**
 * @file Markdown.tsx
 * @description Custom React Markdown parser and renderer. Safely renders markdown content into styled HTML elements.
 */

import { AlertOctagon, AlertTriangle, BookOpen, Check, Copy, Lightbulb, Zap } from "lucide-react";
import React, { useState } from "react";

interface MarkdownProps {
  content: string;
  className?: string;
}

import { parseMarkdown } from "../lib/markdownParser";

// Tokenizer regex for common web languages (JS/TS/JSON/JSX/TSX/HTML/CSS)
const TOKEN_REGEX =
  /(\/\/.*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\b(?:const|let|var|function|return|import|export|class|interface|type|extends|implements|if|else|for|while|async|await|from|default|public|private|protected|readonly|new|typeof|instanceof|throw|try|catch|finally|as|in|of|keyof|break|continue|switch|case|default)\b)|(\b\d+\b)|(\b(?:true|false|null|undefined)\b)|(\b(?:string|number|boolean|any|void|unknown|never|Object|Array|Promise|React|useState|useEffect|useContext|useMemo|useCallback)\b)/g;

function highlightCode(code: string, lang?: string): React.ReactNode {
  if (
    !lang ||
    !["typescript", "javascript", "ts", "js", "json", "tsx", "jsx", "html", "css"].includes(
      lang.toLowerCase()
    )
  ) {
    return code;
  }

  const parts = code.split(TOKEN_REGEX);
  const result: React.ReactNode[] = [];

  let i = 0;
  while (i < parts.length) {
    const unmatched = parts[i];
    if (unmatched) {
      result.push(unmatched);
    }
    if (i + 1 < parts.length) {
      const comment = parts[i + 1];
      const str = parts[i + 2];
      const keyword = parts[i + 3];
      const num = parts[i + 4];
      const bool = parts[i + 5];
      const type = parts[i + 6];

      if (comment !== undefined) {
        result.push(
          <span key={i} className="text-zinc-450 italic">
            {comment}
          </span>
        );
      } else if (str !== undefined) {
        result.push(
          <span key={i} className="font-semibold text-emerald-700">
            {str}
          </span>
        );
      } else if (keyword !== undefined) {
        result.push(
          <span key={i} className="font-bold text-rose-600">
            {keyword}
          </span>
        );
      } else if (num !== undefined) {
        result.push(
          <span key={i} className="text-amber-600">
            {num}
          </span>
        );
      } else if (bool !== undefined) {
        result.push(
          <span key={i} className="text-indigo-650 font-semibold">
            {bool}
          </span>
        );
      } else if (type !== undefined) {
        result.push(
          <span key={i} className="font-semibold text-blue-600">
            {type}
          </span>
        );
      }
    }
    i += 7;
  }
  return result;
}

// Helper to copy text to clipboard
function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="3xl:my-10 3xl:rounded-2xl relative my-6 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50/50 shadow-xs">
      {/* Codeblock Header */}
      <div className="3xl:px-6 3xl:py-3.5 3xl:text-sm 4xl:text-base 5xl:text-lg flex items-center justify-between border-b border-zinc-200/80 bg-zinc-100/60 px-4 py-2.5 font-mono text-xs text-zinc-500">
        {/* Language label */}
        <span className="3xl:text-xs font-sans text-[0.65rem] font-bold tracking-widest text-zinc-400 uppercase">
          {lang || "plaintext"}
        </span>
        <button
          onClick={handleCopy}
          className="text-zinc-650 3xl:px-3 3xl:py-1.5 3xl:text-sm 4xl:px-4 4xl:py-2 4xl:text-base 5xl:px-5 5xl:py-2.5 5xl:text-lg flex cursor-pointer items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2 py-1 transition-colors hover:border-zinc-400 hover:bg-zinc-50 hover:text-black"
          aria-label={copied ? "Copied code" : "Copy code"}
        >
          {copied ? (
            <>
              <Check className="3xl:h-4.5 3xl:w-4.5 4xl:h-5.5 4xl:w-5.5 5xl:h-6.5 5xl:w-6.5 h-3.5 w-3.5 text-zinc-600" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="3xl:h-4.5 3xl:w-4.5 4xl:h-5.5 4xl:w-5.5 5xl:h-6.5 5xl:w-6.5 h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Text */}
      <pre className="3xl:p-6 3xl:text-base 4xl:text-lg 5xl:text-xl overflow-x-auto p-4 font-mono text-sm leading-relaxed text-zinc-950">
        <code>{highlightCode(code, lang)}</code>
      </pre>
    </div>
  );
}

// Inline content parser
function parseInline(text: string): React.ReactNode[] {
  const regex = /(!?\[[^\]]*\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  const parts = text.split(regex);
  return parts.map((part, i) => {
    if (part.startsWith("![") && part.endsWith(")")) {
      const match = part.match(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+["']([^"']+)["'])?\)/);
      if (match) {
        return (
          <span key={i} className="my-6 block text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={match[2]}
              alt={match[1]}
              className="mx-auto max-w-full rounded-xl border border-zinc-200 shadow-sm"
            />
            {match[3] && (
              <span className="3xl:text-sm 4xl:text-base 5xl:text-lg mt-2 block text-xs font-medium text-zinc-500">
                {match[3]}
              </span>
            )}
          </span>
        );
      }
    }
    if (part.startsWith("[") && part.endsWith(")")) {
      const match = part.match(/\[([^\]]*)\]\(([^)]+)\)/);
      if (match) {
        return (
          <a
            key={i}
            href={match[2]}
            className="hover:text-zinc-650 font-semibold text-black underline decoration-zinc-300 decoration-2 underline-offset-4 transition-colors hover:decoration-black"
            target={match[2].startsWith("http") ? "_blank" : undefined}
            rel={match[2].startsWith("http") ? "noopener noreferrer" : undefined}
          >
            {match[1]}
          </a>
        );
      }
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-extrabold text-black">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={i} className="text-zinc-800 italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="bg-zinc-150/50 rounded-md border border-zinc-200/60 px-1.5 py-0.5 font-mono text-[0.85em] font-semibold text-black"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

// Markdown renderer

export default function Markdown({ content, className = "" }: MarkdownProps) {
  const blocks = parseMarkdown(content);

  return (
    <div
      className={`text-zinc-750 font-sans text-base leading-relaxed md:text-[1.05rem] [&>*:first-child]:mt-0! ${className}`}
    >
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading": {
            const hText = parseInline(block.text || "");
            const hClass =
              "font-outfit text-black font-extrabold tracking-tight mt-8 mb-4 3xl:mt-12 3xl:mb-6";
            const id = block.slug;
            if (block.level === 1) {
              return (
                <h2
                  id={id}
                  key={index}
                  className={`${hClass} 3xl:text-5xl 4xl:text-6xl 5xl:text-7xl 3xl:pb-4 border-b border-zinc-200/60 pb-3 text-3xl sm:text-4xl`}
                >
                  {hText}
                </h2>
              );
            }
            if (block.level === 2) {
              return (
                <h3
                  id={id}
                  key={index}
                  className={`${hClass} 3xl:text-4xl 4xl:text-5xl 5xl:text-6xl text-2xl sm:text-3xl`}
                >
                  {hText}
                </h3>
              );
            }
            if (block.level === 3) {
              return (
                <h4
                  id={id}
                  key={index}
                  className={`${hClass} 3xl:text-3xl 4xl:text-4xl 5xl:text-5xl text-xl sm:text-2xl`}
                >
                  {hText}
                </h4>
              );
            }
            return (
              <h5
                id={id}
                key={index}
                className={`${hClass} 3xl:text-2xl 4xl:text-3xl 5xl:text-4xl text-lg sm:text-xl`}
              >
                {hText}
              </h5>
            );
          }

          case "paragraph":
            return (
              <p
                key={index}
                className="text-zinc-650 3xl:my-6 3xl:text-xl 4xl:text-2xl 5xl:text-3xl 3xl:leading-relaxed 4xl:leading-loose my-4"
              >
                {parseInline(block.text || "")}
              </p>
            );

          case "list": {
            const Tag = block.listType === "ordered" ? "ol" : "ul";
            const listClass =
              block.listType === "ordered"
                ? "list-decimal pl-6 my-4 space-y-2 text-zinc-650 3xl:pl-10 3xl:my-6 3xl:space-y-4 3xl:text-xl 4xl:text-2xl 5xl:text-3xl"
                : "list-disc pl-6 my-4 space-y-2 text-zinc-650 3xl:pl-10 3xl:my-6 3xl:space-y-4 3xl:text-xl 4xl:text-2xl 5xl:text-3xl";
            return (
              <Tag key={index} className={listClass}>
                {block.items?.map((item, idx) => (
                  <li key={idx} className="pl-1">
                    {parseInline(item)}
                  </li>
                ))}
              </Tag>
            );
          }

          case "codeblock":
            return <CodeBlock key={index} code={block.code || ""} lang={block.lang} />;

          case "blockquote": {
            if (block.alertType) {
              let borderClass = "";
              let titleColor = "";
              let alertTitle = "";
              let IconComponent = BookOpen;

              if (block.alertType === "note") {
                borderClass = "border-blue-500";
                titleColor = "text-blue-600";
                alertTitle = "Note";
                IconComponent = BookOpen;
              } else if (block.alertType === "tip") {
                borderClass = "border-emerald-500";
                titleColor = "text-emerald-600";
                alertTitle = "Tip";
                IconComponent = Lightbulb;
              } else if (block.alertType === "warning") {
                borderClass = "border-amber-500";
                titleColor = "text-amber-600";
                alertTitle = "Warning";
                IconComponent = AlertTriangle;
              } else if (block.alertType === "caution") {
                borderClass = "border-rose-500";
                titleColor = "text-rose-600";
                alertTitle = "Caution";
                IconComponent = AlertOctagon;
              } else if (block.alertType === "important") {
                borderClass = "border-purple-500";
                titleColor = "text-purple-600";
                alertTitle = "Important";
                IconComponent = Zap;
              }

              return (
                <div
                  key={index}
                  className={`my-6 flex flex-col gap-1.5 border-l-4 py-1 pl-4 ${borderClass}`}
                >
                  <div
                    className={`flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase ${titleColor} 3xl:text-sm 4xl:text-base 5xl:text-lg`}
                  >
                    <IconComponent className="3xl:h-5 3xl:w-5 4xl:h-6 4xl:w-6 5xl:h-7 5xl:w-7 h-4 w-4 shrink-0" />
                    <span>{alertTitle}</span>
                  </div>
                  <div className="text-zinc-650 3xl:text-base 4xl:text-lg 5xl:text-xl space-y-1.5 text-sm leading-relaxed">
                    {(block.text || "").split("\n").map((para, idx) => (
                      <p key={idx}>{parseInline(para)}</p>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <blockquote
                key={index}
                className="text-zinc-650 3xl:my-10 3xl:pl-6 3xl:py-2 my-6 border-l-4 border-zinc-300 py-1 pl-4 font-medium italic"
              >
                <div className="space-y-1.5">
                  {(block.text || "").split("\n").map((para, idx) => (
                    <p key={idx}>{parseInline(para)}</p>
                  ))}
                </div>
              </blockquote>
            );
          }

          case "table":
            return (
              <div
                key={index}
                className="3xl:my-10 3xl:rounded-2xl my-6 overflow-x-auto rounded-xl border border-zinc-200"
              >
                <table className="text-zinc-750 3xl:text-base 4xl:text-lg 5xl:text-xl w-full border-collapse text-left text-sm">
                  <thead className="font-outfit 3xl:text-sm 4xl:text-base 5xl:text-lg border-b border-zinc-200 bg-zinc-50 text-xs font-bold tracking-wider text-black uppercase">
                    <tr>
                      {block.headers?.map((header, idx) => {
                        const align = block.aligns?.[idx] || "left";
                        return (
                          <th key={idx} className="3xl:p-6 p-4" style={{ textAlign: align }}>
                            {parseInline(header)}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200/80">
                    {block.rows?.map((row, rowIdx) => (
                      <tr key={rowIdx} className="transition-colors hover:bg-zinc-50/30">
                        {row.map((cell, cellIdx) => {
                          const align = block.aligns?.[cellIdx] || "left";
                          return (
                            <td key={cellIdx} className="3xl:p-6 p-4" style={{ textAlign: align }}>
                              {parseInline(cell)}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case "hr":
            return <hr key={index} className="3xl:my-12 my-8 border-t border-zinc-200/60" />;

          default:
            return null;
        }
      })}
    </div>
  );
}
