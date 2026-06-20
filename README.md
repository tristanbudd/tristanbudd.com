<div align="center">
    <img width="600" height="300" alt="Personal Portfolio Website Banner" src="https://github.com/user-attachments/assets/7acf24a0-e7f8-45aa-9f44-639ca79c4f08" />
</div>

# Personal Portfolio Website

![](https://img.shields.io/github/stars/tristanbudd/tristanbudd.com.svg)
![](https://img.shields.io/github/watchers/tristanbudd/tristanbudd.com.svg)
![](https://img.shields.io/github/license/tristanbudd/tristanbudd.com.svg)

![](https://img.shields.io/github/issues-raw/tristanbudd/tristanbudd.com.svg)
![](https://img.shields.io/github/issues-closed-raw/tristanbudd/tristanbudd.com.svg)
![](https://img.shields.io/github/issues-pr-raw/tristanbudd/tristanbudd.com.svg)
![](https://img.shields.io/github/issues-pr-closed-raw/tristanbudd/tristanbudd.com.svg)

Personal Portfolio & Professional Showcase. Built with a high-performance Next.js 16 and React 19 backend, styled with Tailwind CSS 4, and backed by a MySQL/MariaDB database.

---

## Project Description

Tristanbudd.com is my personal portfolio and professional showcase website. It features blog posts, project summaries, professional experience timelines, volunteering history, and certifications.

Anyone is more than welcome to use this projects setup as a basis for their own professional portfolios, and all content is available under the [MIT License](LICENSE). This project (in its original form) is not available for community contributions, however if you find a bug or want to request a feature (for example: I'm struggling to use the site with X accessiblity need, or I can't view the website on X device), you can do so under the [Issues Tab](https://github.com/tristanbudd/tristanbudd.com/issues).

---

## Features

- **Dynamic Content & Custom Fields**: Projects and blogs are fully managed in the database, with support for customizable fields (e.g. project client, role, timeline) and automated blog reading time calculations.
- **Interactive Timelines & Badges**: Organized visual histories of work experience, academic history, and volunteering with dynamic duration calculation and institution icon badges.
- **Smooth Animation System**: Integration of Lenis for premium smooth-scrolling behavior combined with responsive glassmorphism styles via Tailwind CSS 4 and PostCSS.
- **Maintenance Mode**: Server-side maintenance state (`MAINTENANCE_MODE`) with a secure bypass key (`MAINTENANCE_BYPASS_KEY`) allowing developers to test the live site while visitors see a polished maintenance screen.
- **Contact Form**: Interactive, validated contact section with serverless email dispatching using the Resend API.
- **Database Offline Resilience**: Resilient data-fetching layers that gracefully catch connection timeouts and database failures, showing offline badges or custom message widgets while keeping the main website fully functional.
- **Admin Control Panel**: A comprehensive, secure admin control panel `/admin` powered by GitHub OAuth authentication, allowing the owner (`ADMIN_OWNER_ACCOUNT`) to create, update, or delete blog posts and projects.
- **Developer Console Wordle**: A hidden interactive Wordle game featuring developer-themed 5-letter words (e.g., `ASYNC`, `REACT`, `MONGO`). Accessible in the browser developer tools using standard JavaScript functions (`play()`, `guess("word")`, `help()`).
- **Google Tag Manager Integration**: Analytics telemetry to log user engagement events, including console game interactions, timeline expanders, outbound links, and contact requests.

---

## Tech Stack

- **Framework:** Next.js 16 (React 19, TypeScript)
- **Styling:** Tailwind CSS 4, PostCSS, Lenis (Smooth Scroll)
- **Database:** MariaDB / MySQL (via Prisma Client 7.8)
- **Authentication:** GitHub OAuth (custom middleware flow)
- **Email Delivery:** Resend API
- **Telemetry:** Google Tag Manager (GTM)
- **Containerization:** Docker, Docker Compose

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/tristanbudd/tristanbudd.com.git
cd tristanbudd.com
```

### 2. Setup Configuration

Copy the example environment file and fill in your keys (database credentials, GitHub OAuth tokens, GTM ID, Resend API key):

```bash
cp .env.example .env.local
```

### 3. Deploy using Docker Compose

Run the production Docker Compose stack, which will start the MySQL database and the Next.js app container:

```bash
docker compose up -d --build
```

The application will automatically perform schema migrations, database seeding (adding initial posts and projects), and run the production server. It will be accessible at `http://localhost:18050` (or the custom `APP_BIND_PORT` defined in your environment).

---

## Scripts

Use the following scripts to run, test, and check code quality locally:

```bash
pnpm install          # Install dependencies
pnpm dev              # Start the development server locally
pnpm build            # Generate the Prisma client and build the Next.js production code
pnpm start            # Run the production-built Next.js server locally
pnpm typecheck        # Run TypeScript typechecker to verify code types
pnpm lint             # Run ESLint to analyze code structure and style guidelines
pnpm format           # Run Prettier to format the codebase
```

---

## Development Notes

- **Database Schemas & Seeding**: Database tables are defined in `prisma/schema.prisma`. On container startup, the startup script `start.sh` runs `prisma db push` and `prisma db seed` to initialize schema layouts and load the default articles.
- **Pre-commit Automation**: This project uses Husky and `lint-staged` to enforce code cleanliness. Commits automatically trigger TypeScript typechecks, lint fixes, and code formatting on changed files.
- **Offline Fallbacks**: The data repository implementation in `src/app/page.tsx` wraps Prisma queries in robust try-catch blocks to prevent site crashes and displays a detailed notice when database access is lost.

---

## Credits & License

This project utilizes several open-source libraries and frameworks:

1. **[Next.js](https://nextjs.org/)** - MIT License
2. **[React](https://react.dev/)** - MIT License
3. **[Tailwind CSS](https://tailwindcss.com/)** - MIT License
4. **[Prisma](https://www.prisma.io/)** - Apache-2.0 License
5. **[Lenis](https://lenis.darkroom.engineering/)** - MIT License

This project is licensed under the **[MIT License](LICENSE)**.
