"use client";

import { trackConsoleGame } from "@/lib/gtm";
import { useEffect } from "react";

// Extend global window type for TypeScript
declare global {
  interface Window {
    play?: () => string;
    guess?: (input: string) => string;
    help?: () => string;
  }
}

// Extended array of developer/technology themed 5-letter words
const DEV_WORDS = [
  "ADMIN",
  "AGILE",
  "ARRAY",
  "ASCII",
  "ASSET",
  "ASYNC",
  "AUDIO",
  "AWAIT",
  "AZURE",
  "BASIC",
  "BATCH",
  "BENCH",
  "BLOCK",
  "BOARD",
  "BOUND",
  "BREAK",
  "BUILD",
  "BYTES",
  "CABLE",
  "CACHE",
  "CHART",
  "CHECK",
  "CHUNK",
  "CISCO",
  "CLASS",
  "CLEAR",
  "CLICK",
  "CLOCK",
  "CLONE",
  "CLOSE",
  "CLOUD",
  "CODER",
  "CODES",
  "COLOR",
  "CONST",
  "COUNT",
  "CRASH",
  "CRYPT",
  "CYCLE",
  "DEBUG",
  "DELAY",
  "DELTA",
  "DIGIT",
  "DRIVE",
  "DUMMY",
  "EMPTY",
  "ENTRY",
  "EPOCH",
  "ERROR",
  "EVENT",
  "EXCEL",
  "FALSE",
  "FAULT",
  "FETCH",
  "FIBER",
  "FIELD",
  "FILES",
  "FLASH",
  "FLOAT",
  "FOCUS",
  "FONTS",
  "FORGE",
  "FRAME",
  "GATES",
  "GLYPH",
  "GNOME",
  "GRAPH",
  "GRIDS",
  "HEAPS",
  "HOOKS",
  "HOSTS",
  "HTTPS",
  "ICONS",
  "IMAGE",
  "INDEX",
  "INNER",
  "INPUT",
  "INTEL",
  "JOINS",
  "KAFKA",
  "LATEX",
  "LAYER",
  "LEAKS",
  "LIMIT",
  "LINKS",
  "LINTS",
  "LINUX",
  "LOGIC",
  "LOGIN",
  "LOOPS",
  "MACRO",
  "MAGIC",
  "MATCH",
  "MATHS",
  "MEDIA",
  "MEMOS",
  "MERGE",
  "MICRO",
  "MODAL",
  "MODEL",
  "MONGO",
  "MOUSE",
  "MUTEX",
  "NODES",
  "OAUTH",
  "OCTAL",
  "OUTER",
  "PAGES",
  "PANEL",
  "PARAM",
  "PARSE",
  "PATCH",
  "PATHS",
  "PIPES",
  "PIXEL",
  "PLUGS",
  "POOLS",
  "POPUP",
  "PORTS",
  "POSIX",
  "PRINT",
  "PROPS",
  "PROXY",
  "PULLS",
  "QUERY",
  "QUEUE",
  "RADIX",
  "RAILS",
  "REACT",
  "READS",
  "REDIS",
  "REGEX",
  "REPLY",
  "REPOS",
  "RESET",
  "RETRY",
  "ROBOT",
  "ROUTE",
  "RULES",
  "SCALE",
  "SCOPE",
  "SERVE",
  "SETUP",
  "SHELL",
  "SHIFT",
  "SLASH",
  "SLICE",
  "SMART",
  "SOLID",
  "SPACE",
  "SPARK",
  "SPAWN",
  "SPLIT",
  "SPOOL",
  "STACK",
  "START",
  "STATE",
  "STORE",
  "STYLE",
  "SUPER",
  "SWIFT",
  "SWIPE",
  "TABLE",
  "TASKS",
  "TESTS",
  "THEME",
  "THROW",
  "TITLE",
  "TOKEN",
  "TOOLS",
  "TOUCH",
  "TRACE",
  "TRACK",
  "TREES",
  "TRUST",
  "TUPLE",
  "TYPES",
  "UNZIP",
  "USERS",
  "VALID",
  "VALUE",
  "VIDEO",
  "VIEWS",
  "VIRUS",
  "WHEEL",
  "WHILE",
  "WIDTH",
  "WIRED",
  "WRITE",
  "YIELD",
];

export default function ConsoleGame() {
  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;

    const isDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

    // Sizing and typography styles
    const STYLE_BRAND = isDark
      ? "color: #f4f4f5; font-family: monospace; font-size: 14px; font-weight: bold; line-height: 1.5;"
      : "color: #18181b; font-family: monospace; font-size: 14px; font-weight: bold; line-height: 1.5;";
    const STYLE_TAG = isDark
      ? "color: #e4e4e7; font-family: monospace; font-size: 14px; font-weight: bold;"
      : "color: #27272a; font-family: monospace; font-size: 14px; font-weight: bold;";
    const STYLE_ALERT_TAG = isDark
      ? "color: #f87171; font-family: monospace; font-size: 14px; font-weight: bold;"
      : "color: #ef4444; font-family: monospace; font-size: 14px; font-weight: bold;";
    const STYLE_CODE = isDark
      ? "color: #ffffff; font-family: monospace; font-weight: bold; background-color: #27272a; padding: 2px 5px; border-radius: 3px; font-size: 13px;"
      : "color: #18181b; font-family: monospace; font-weight: bold; background-color: #e4e4e7; padding: 2px 5px; border-radius: 3px; font-size: 13px;";
    const STYLE_NORMAL = isDark
      ? "color: #a1a1aa; font-family: monospace; font-size: 14px; line-height: 1.5;"
      : "color: #71717a; font-family: monospace; font-size: 14px; line-height: 1.5;";

    let isGameActive = false;
    let secretWord = "";
    let guesses: string[] = [];
    const maxAttempts = 6;

    const logBanner = () => {
      trackConsoleGame("discover");
      console.log(
        `%c
  ████████  ███████
     ██     ██    ██
     ██     ███████
     ██     ██    ██
     ██     ███████

  Console Game%c
  Well done for finding the secret game!

  • Type %cplay()%c to start a 5-letter developer Wordle game.
  • Type %chelp()%c for rules.
        `,
        STYLE_BRAND,
        STYLE_NORMAL,
        STYLE_CODE,
        STYLE_NORMAL,
        STYLE_CODE,
        STYLE_NORMAL
      );
    };

    // Delay banner slightly so framework logs don't bury it
    const bannerTimeout = setTimeout(logBanner, 1500);

    const help = () => {
      console.log(
        `%cSystem -%c Wordle rules:
  - Guess the hidden 5-letter developer word in 6 attempts.
  - Letters are checked and feedback is displayed as:
    🟩 - The letter is correct and in the right position.
    🟨 - The letter is in the word but in the wrong position.
    ⬛ - The letter is not in the word.

  Operations:
  %cplay()%c      - Start / restart the game
  %cguess("word")%c - Submit a 5-letter guess
  %chelp()%c      - View rules`,
        STYLE_TAG,
        STYLE_NORMAL,
        STYLE_CODE,
        STYLE_NORMAL,
        STYLE_CODE,
        STYLE_NORMAL,
        STYLE_CODE,
        STYLE_NORMAL
      );
      return "Ready to play. Run play() to start.";
    };

    const play = () => {
      isGameActive = true;
      guesses = [];
      secretWord = DEV_WORDS[Math.floor(Math.random() * DEV_WORDS.length)];
      trackConsoleGame("start");

      console.log(
        `%cSystem -%c Wordle game started!
%cSystem -%c Guess the 5-letter developer word (e.g., REACT, STACK, BUILD).
%cSystem -%c Run %cguess("word")%c to make your first attempt.`,
        STYLE_TAG,
        STYLE_NORMAL,
        STYLE_TAG,
        STYLE_NORMAL,
        STYLE_TAG,
        STYLE_NORMAL,
        STYLE_CODE,
        STYLE_NORMAL
      );
      return 'Game started. Run guess("word") to submit a guess.';
    };

    const guess = (input: string) => {
      if (!isGameActive) {
        console.log(
          `%cAlert -%c No active game session. Type %cplay()%c to start.`,
          STYLE_ALERT_TAG,
          STYLE_NORMAL,
          STYLE_CODE,
          STYLE_NORMAL
        );
        return "No active game. Type play() to start.";
      }

      if (typeof input !== "string") {
        console.log(
          `%cAlert -%c Invalid input. Guess must be a word string, e.g., guess("react").`,
          STYLE_ALERT_TAG,
          STYLE_NORMAL
        );
        return "Invalid input. Guess must be a word string.";
      }

      const formatted = input.toUpperCase().trim();

      if (formatted.length !== 5 || !/^[A-Z]+$/.test(formatted)) {
        console.log(
          `%cAlert -%c Guess must be a 5-letter alphabetical word.`,
          STYLE_ALERT_TAG,
          STYLE_NORMAL
        );
        return "Guess must be a 5-letter alphabetical word.";
      }

      guesses.push(formatted);
      trackConsoleGame("guess", { guess_word: formatted, attempt: guesses.length });

      console.log(`%cSystem -%c Current Wordle Board:`, STYLE_TAG, STYLE_NORMAL);

      guesses.forEach((g, index) => {
        let feedback = "";

        // Count letters in secret word for yellow highlights
        const letterCount: { [key: string]: number } = {};
        for (let i = 0; i < secretWord.length; i++) {
          letterCount[secretWord[i]] = (letterCount[secretWord[i]] || 0) + 1;
        }

        const matchArray = new Array(5).fill("⬛");

        // First pass: mark exact greens
        for (let i = 0; i < 5; i++) {
          if (g[i] === secretWord[i]) {
            matchArray[i] = "🟩";
            letterCount[g[i]]--;
          }
        }

        // Second pass: mark yellows
        for (let i = 0; i < 5; i++) {
          if (matchArray[i] !== "🟩") {
            if (secretWord.includes(g[i]) && letterCount[g[i]] > 0) {
              matchArray[i] = "🟨";
              letterCount[g[i]]--;
            }
          }
        }

        feedback = matchArray.join(" ");
        const spacedWord = g.split("").join(" ");

        console.log(`  ${index + 1}: %c${spacedWord}%c   [ ${feedback} ]`, STYLE_TAG, STYLE_NORMAL);
      });

      // Check win condition
      if (formatted === secretWord) {
        isGameActive = false;
        trackConsoleGame("win", { attempts: guesses.length, word: secretWord });
        console.log(
          `%cSuccess -%c Solved in ${guesses.length}/${maxAttempts} attempts!
%cSystem -%c Thanks for playing! Type %cplay()%c to play again.`,
          STYLE_TAG,
          STYLE_NORMAL,
          STYLE_TAG,
          STYLE_NORMAL,
          STYLE_CODE,
          STYLE_NORMAL
        );
        return "Solved! Congratulations.";
      }

      // Check lose condition
      if (guesses.length >= maxAttempts) {
        isGameActive = false;
        trackConsoleGame("lose", { attempts: guesses.length, word: secretWord });
        console.log(
          `%cAlert -%c Out of attempts. Game over.
%cSystem -%c The correct word was %c${secretWord}%c.
%cSystem -%c Type %cplay()%c to try again.`,
          STYLE_ALERT_TAG,
          STYLE_NORMAL,
          STYLE_TAG,
          STYLE_NORMAL,
          STYLE_CODE,
          STYLE_NORMAL,
          STYLE_TAG,
          STYLE_NORMAL,
          STYLE_CODE,
          STYLE_NORMAL
        );
        return `Game over. The correct word was ${secretWord}.`;
      }

      return `${maxAttempts - guesses.length} attempts remaining.`;
    };

    window.play = play;
    window.guess = guess;
    window.help = help;

    return () => {
      clearTimeout(bannerTimeout);
      delete window.play;
      delete window.guess;
      delete window.help;
    };
  }, []);

  return null;
}
