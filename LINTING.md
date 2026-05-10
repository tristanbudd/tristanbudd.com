# Linting and Formatting Setup (tristanbudd.com)

This project is configured with ESLint, Prettier, and TypeScript, following industry-standard best practices for modern Next.js 16 + React 19 development.

## Configuration Files

- **tsconfig.json** - Controls TypeScript compiler rules and strict type-checking.
- **.prettierrc** - Prettier configuration for TypeScript, React (TSX), and CSS formatting, including Tailwind class sorting.
- **.prettierignore** - Protects compiled assets and build artifacts from Prettier.
- **eslint.config.mjs** - Modern ESLint "Flat Config" handling React 19, TS/TSX parsing, and Next.js vitals.

## Available Scripts

### React / Frontend (TypeScript)

- **pnpm typecheck** - Runs the TypeScript compiler (`tsc --noEmit`) to catch type errors.
- **pnpm lint** - Check for linting errors using ESLint.
- **pnpm lint:fix** - Fix auto-fixable ESLint errors.
- **pnpm format** - Format all TS/TSX/CSS files with Prettier.
- **pnpm format:check** - Check if files are formatted correctly (used in CI).

## Key Features

### Prettier Settings

- **Semi-colons**: Enabled (true)
- **Single quotes**: Disabled (false) for standard JSX/TSX consistency.
- **Print width**: 100 characters.
- **Tab width**: 2 spaces (Next.js standard).
- **Tailwind Plugin**: Automatically sorts Tailwind classes, including those inside the `cn()` utility.

### ESLint Rules

- **Next.js Vitals**: Uses `eslint-config-next/core-web-vitals`.
- **TypeScript**: Integrated with `@typescript-eslint` via Next.js defaults.
- **Prettier Integration**: Uses `eslint-config-prettier` to ensure ESLint never conflicts with formatting rules.
- **Strict Ignores**: Ignores `.next/`, `build/`, and `public/`.

## VS Code Integration (Recommended)

This repository is pre-configured for VS Code. When you open the project, it will recommend the necessary extensions.

1. **ESLint** (dbaeumer.vscode-eslint)
2. **Prettier** (esbenp.prettier-vscode)
3. **Tailwind CSS IntelliSense** (bradlc.vscode-tailwindcss)
4. **GitHub Actions** (github.vscode-github-actions)

The workspace `.vscode/settings.json` is configured to **format on save** and **fix linting errors on save**.

## Pre-commit Hook (Husky)

This project uses Husky and lint-staged to guarantee code quality before every commit.

**Workflow:**

1. Runs `pnpm run typecheck` (Full project check).
2. Runs `lint-staged` on changed files:
   - `eslint --fix`
   - `prettier --write`

## Best Practices

1. **Trust the automation**: Let your editor format on save. It saves time and prevents CI failures.
2. **Review auto-fixes**: While `lint:fix` is helpful, always double-check staged changes before pushing.
3. **CI/CD**: Every push to GitHub triggers a full suite of quality checks. Ensure your local environment passes before pushing.
