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

You'll simply need to install a virtual environment and pre-commit
hooks. To do so, run the following commands:

```bash
python3 -m venv venv
source venv/bin/activate
pip install pre-commit
pre-commit install
```

## QA and CI/CD

We use GitHub actions to build and deploy the application. We currently have 2 main pipelines:

- [QA](.github/workflows/qa.yml): Checks linters/formatters and run tests
- [deploy](.github/workflows/deploy.yml): Builds the application and deploys it to the production server

## Made by JKDev

<img alt="JKDev logo" src="https://jordan-kowal.github.io/assets/jkdev/logo.png" width="100" />
