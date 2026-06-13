/**
 * @file markdownParser.ts
 * @description Shared functions for parsing Markdown strings into structured Block trees.
 */

export interface Block {
  type: "heading" | "paragraph" | "list" | "codeblock" | "blockquote" | "table" | "hr";
  level?: number;
  text?: string;
  slug?: string;
  items?: string[];
  listType?: "ordered" | "unordered";
  code?: string;
  lang?: string;
  alertType?: "note" | "tip" | "warning" | "caution" | "important" | null;
  headers?: string[];
  rows?: string[][];
  aligns?: ("left" | "center" | "right")[];
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
}

export function parseMarkdown(content: string): Block[] {
  const lines = content.split(/\r?\n/);
  const blocks: Block[] = [];

  let inCodeBlock = false;
  let codeLines: string[] = [];
  let codeLang = "";

  let currentBlock: Block | null = null;

  const closeCurrentBlock = () => {
    if (currentBlock) {
      blocks.push(currentBlock);
      currentBlock = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle Code Blocks
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        blocks.push({
          type: "codeblock",
          code: codeLines.join("\n"),
          lang: codeLang,
        });
        codeLines = [];
        codeLang = "";
        inCodeBlock = false;
      } else {
        closeCurrentBlock();
        inCodeBlock = true;
        codeLang = line.trim().slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    const trimmed = line.trim();

    // Empty line closes block
    if (trimmed === "") {
      closeCurrentBlock();
      continue;
    }

    // Horizontal Rule
    if (trimmed === "---" || trimmed === "***") {
      closeCurrentBlock();
      blocks.push({ type: "hr" });
      continue;
    }

    // Headings
    if (trimmed.startsWith("#")) {
      const match = trimmed.match(/^(#{1,6})\s+(.*)$/);
      if (match) {
        closeCurrentBlock();
        const headingText = match[2];
        blocks.push({
          type: "heading",
          level: match[1].length,
          text: headingText,
          slug: slugify(headingText),
        });
        continue;
      }
    }

    // Blockquotes & Alerts
    if (trimmed.startsWith(">")) {
      let quoteText = trimmed.slice(1).trim();
      let alertType: Block["alertType"] = null;

      const alertMatch = quoteText.match(/^\[!(NOTE|TIP|WARNING|CAUTION|IMPORTANT)\]/i);
      if (alertMatch) {
        alertType = alertMatch[1].toLowerCase() as Block["alertType"];
        quoteText = quoteText.slice(alertMatch[0].length).trim();
      }

      if (currentBlock && currentBlock.type === "blockquote") {
        if (alertType && !currentBlock.alertType) {
          currentBlock.alertType = alertType;
        }
        currentBlock.text = (currentBlock.text ? currentBlock.text + "\n" : "") + quoteText;
      } else {
        closeCurrentBlock();
        currentBlock = {
          type: "blockquote",
          text: quoteText,
          alertType,
        };
      }
      continue;
    }

    // Unordered List Items
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("+ ")) {
      const itemText = trimmed.slice(2).trim();
      if (currentBlock && currentBlock.type === "list" && currentBlock.listType === "unordered") {
        currentBlock.items?.push(itemText);
      } else {
        closeCurrentBlock();
        currentBlock = {
          type: "list",
          listType: "unordered",
          items: [itemText],
        };
      }
      continue;
    }

    // Ordered List Items
    if (/^\d+\.\s+/.test(trimmed)) {
      const match = trimmed.match(/^(\d+)\.\s+(.*)$/);
      const itemText = match ? match[2].trim() : trimmed;
      if (currentBlock && currentBlock.type === "list" && currentBlock.listType === "ordered") {
        currentBlock.items?.push(itemText);
      } else {
        closeCurrentBlock();
        currentBlock = {
          type: "list",
          listType: "ordered",
          items: [itemText],
        };
      }
      continue;
    }

    // Tables
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const cells = trimmed
        .slice(1, -1)
        .split("|")
        .map((cell) => cell.trim());

      // Check if divider row (e.g. |:---| or |---|)
      const isDivider = cells.every((cell) => /^:?-+:?$/.test(cell));

      if (isDivider) {
        if (currentBlock && currentBlock.type === "table") {
          currentBlock.aligns = cells.map((cell) => {
            const left = cell.startsWith(":");
            const right = cell.endsWith(":");
            if (left && right) return "center";
            if (right) return "right";
            return "left";
          });
        }
        continue;
      }

      if (currentBlock && currentBlock.type === "table") {
        currentBlock.rows?.push(cells);
      } else {
        closeCurrentBlock();
        currentBlock = {
          type: "table",
          headers: cells,
          rows: [],
          aligns: cells.map(() => "left"),
        };
      }
      continue;
    }

    // Paragraph (default)
    if (currentBlock && currentBlock.type === "paragraph") {
      currentBlock.text = (currentBlock.text || "") + " " + trimmed;
    } else {
      closeCurrentBlock();
      currentBlock = {
        type: "paragraph",
        text: trimmed,
      };
    }
  }

  closeCurrentBlock();
  return blocks;
}
