# Personal Website

My personal static website made with Vite + React + Antd.
Single Page Application with the following sections:

- Banner
- Skills
- Projects
- Career
- Contact

## Running the application

Simply run the following:

```shell
yarn install
yarn start
```

## Setting up the pre-commits

Git hooks are set in the [.githooks](.githooks) folder
_(as `.git/hooks` is not tracked in `.git`)_

Run the following command to tell `git` to look for hooks in this folder:

```shell
git config core.hooksPath .githooks
```

## QA and CI/CD

We use GitHub actions to build and deploy the application. We currently have 2 main pipelines:

- [QA](.github/workflows/qa.yml): Checks linters/formatters and run tests
- [deploy](.github/workflows/deploy.yml): Builds the application and deploys it to GitHub Pages

## Made by JKDev

<img alt="JKDev logo" src="https://jordan-kowal.github.io/assets/jkdev/logo.png" width="100" />
