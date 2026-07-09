# qa-auto

Cross-platform QA automation — **Playwright + TypeScript**, maintained by Viktor (AI QA).
Specs map 1:1 to Jira tickets and Xray test cases: `projects/<platform>/tests/<TICKET>-<TC>.spec.ts`.

## Structure

```
playwright.config.ts     # one Playwright "project" per platform, env-driven base URLs
shared/                  # cross-platform page objects & fixtures
projects/
  webtv/                 # WebTV (browser) — automated
    pages/               # page object models
    tests/               # specs, named after Jira ticket + Xray case IDs
  uctv/                  # UCTV — automated (specs land here as tickets arrive)
  ios/                   # native iOS — manual Xray cases (see its README)
.github/workflows/       # CI: run on push/PR, manual runs per platform
```

## Running locally

```bash
npm install
npx playwright install chromium
cp .env.example .env     # set base URLs / creds

npm test                 # all platforms
npm run test:webtv       # one platform
npm run report           # open the HTML report
```

## Conventions

- **Selectors:** prefer `getByRole` / `getByTestId` / labels over CSS classes (resilient to UI churn).
- **Naming:** one spec file per Jira ticket, one `test()` per Xray test case (`TC-n` in the title).
- **Environments:** base URLs and credentials come from env vars (`.env` locally, repo variables/secrets in CI). Never hardcode credentials.
- **Failure triage:** on CI failure, Viktor inspects traces/artifacts — UI drift → repair PR; real regression → Jira bug; ambiguous → question in Slack.

## Current tests

| Spec | Platform | Jira | Xray case |
|---|---|---|---|
| `projects/webtv/tests/DEMO-2-TC-1.spec.ts` | WebTV | DEMO-2 | TC-1 — invalid login shows error, no sign-in |
