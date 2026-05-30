# Personal Website

My personal static website made with Vite + SolidJS + Tailwind CSS.
Single Page Application with the following sections:

- Hero Banner
- Reviews
- Skills
- Projects
- Timeline (Career/Education)
- GitHub Activity
- Contact (Footer)

## Running the application

Simply run the following:

```shell
bun install
bun start
```

## Setting up the pre-commits

Git hooks are set in the [.githooks](.githooks) folder
_(as `.git/hooks` is not tracked in `.git`)_

Run the following command to tell `git` to look for hooks in this folder:

```shell
git config core.hooksPath .githooks
```

## QA and CI/CD

- [QA](.github/workflows/qa.yml): GitHub Action that checks linters/formatters and runs `tsc` on pull requests.
- **Deploy**: hosted on [Cloudflare Pages](https://www.jordankowal.com), which auto-builds and deploys on every push to `main` (build command `bun install && bun run build`, output `dist/`).

See [docs/](docs/) for the launch/hardening checklist (SEO, security headers, analytics, hosting).

## Made by JKDev

<img alt="JKDev logo" src="https://www.jordankowal.com/logo.png" width="100" />
