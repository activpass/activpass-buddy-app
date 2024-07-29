# Activpass Dashboard

Activpass Dashboard is a web application that allows users to manage their Activpass account. It is built using Next.js, Tailwind CSS, and TypeScript.

### Requirements

- Node.js 20+ and npm. You can install it by running:

```sh
nvm install 20.12.2 && nvm use 20.12.2
```

Node.js 20+ and pnpm (If you not have pnpm installed, you can install it with `corepack enable pnpm`, For more information, you can check [pnpm installation](https://pnpm.io/installation))

### Getting started

Run the following command on your local environment:

```shell
git clone git@github.com:ActivPass/activpass-dashboard.git activpass-dashboard
cd activpass-dashboard
pnpm install
```

#### Prerequisites

- This application need two services needs to be run mongodb and redis. You can run these services with docker-compose by running:

```shell
docker-compose up -d
```

- Copy the `.env.example` file to `.env.local` and update the environment variables with your own values.

```shell
cp .env.example .env.local
```

and update the environment variables with your own values.

Then, you can run the project locally in development mode with live reload by executing:

```shell
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your favorite browser to see your project.

### Project structure

```shell
.
├── README.md                       # README file
├── .github                         # GitHub folder
├── .husky                          # Husky configuration
├── .storybook                      # Storybook folder
├── .vscode                         # VSCode configuration
├── public                          # Public assets folder
├── scripts                         # Scripts folder
├── src
│   ├── app                         # Next JS App (App Router)
│   ├── components                  # React components
│   ├── constants                   # constants folder
│   ├── server                      # server folder
│   ├── stores                      # Store folder (Zustand)
│   ├── hooks                       # hooks folder
│   |   ├── react-client            # client side hooks
│   |   ├── react-server            # server side hooks
│   |   ├── react-generic           # generic hooks (both client and server)
│   ├── layouts                     # layouts folder
│   ├── lib                         # 3rd party libraries configuration
│   ├── providers                   # providers folder
│   ├── styles                      # Styles folder
│   ├── templates                   # Templates folder
│   ├── trpc                        # tRPC folder
│   ├── types                       # Type definitions
│   ├── utils                       # Utilities folder
│   └── validations                 # Validation schemas(Zod)
├── tests
│   ├── e2e                         # E2E tests, also includes Monitoring as Code
│   └── integration                 # Integration tests
├── tailwind.config.js              # Tailwind CSS configuration
└── tsconfig.json                   # TypeScript configuration
```

### Commit Message Format

The project enforces [Conventional Commits](https://www.conventionalcommits.org/) specification. This means that all your commit messages must be formatted according to the specification. To help you write commit messages, the project uses [Commitizen](https://github.com/commitizen/cz-cli), an interactive CLI that guides you through the commit process. To use it, run the following command:

```shell
pnpm commit
```

One of the benefits of using Conventional Commits is that it allows us to automatically generate a `CHANGELOG` file. It also allows us to automatically determine the next version number based on the types of commits that are included in a release.

### Testing

All unit tests are located with the source code inside the same directory. So, it makes it easier to find them. The project uses Jest and React Testing Library for unit testing. You can run the tests with:

```shell
pnpm test
```

### Integration & E2E Testing

The project uses Playwright for Integration and E2E testing. You can run the tests with:

```shell
npx playwright install # Only for the first time in a new environment
pnpm test:e2e
```

### Deploy to production

Then, you can generate a production build with:

```shell
pnpm build
```

It generates an optimized production build of the boilerplate. For testing the generated build, you can run:

```shell
pnpm start
```

The command starts a local server with the production build. Then, you can now open [http://localhost:3000](http://localhost:3000) with your favorite browser to see the project.
