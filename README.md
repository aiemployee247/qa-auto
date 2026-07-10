# qa-auto

Cross-platform QA automation — **Playwright + Appium (WebdriverIO) + TypeScript**, maintained by Viktor (AI QA).
Specs map 1:1 to Jira tickets and Xray test cases: `projects/<platform>/tests/<TICKET>-<TC>.spec.ts`.

## Structure

```
playwright.config.ts     # browser platforms (webtv, uctv)
shared/                  # shared page objects (web + mobile)
projects/
  webtv/                 # WebTV (Playwright)
  uctv/                  # UCTV (Playwright)
  gstream/               # GStream native (Appium) — login/signup
  astream/               # AStream native (Appium) — scaffold
  ios/                   # legacy manual Xray notes
apps/                    # local APK / IPA / .app binaries (gitignored)
.github/workflows/       # CI
```

## Running locally (web)

```bash
npm install
npx playwright install chromium
cp .env.example .env

npm test                 # Playwright platforms
npm run test:webtv
npm run report
```

## Running locally (native Appium)

```bash
# Install Appium drivers once
npx appium driver install uiautomator2
npx appium driver install xcuitest

# Put binaries in apps/ (or set paths in .env)
#   apps/gstream/android/app-debug.apk
#   apps/gstream/ios/GStream.app

# Terminal 1
npm run appium

# Terminal 2 — emulator/simulator must be running
npm run test:gstream:android
npm run test:gstream:ios
```

Sauce Labs (later): set `APPIUM_PROVIDER=sauce`, `SAUCE_USERNAME`, `SAUCE_ACCESS_KEY`, and `GSTREAM_SAUCE_APP=storage:filename=...`.

## Conventions

- **Selectors:** prefer `getByRole` / `getByTestId` / labels (web) and React Native `testID` → `~id` (Appium).
- **Naming:** one spec file per Jira ticket, one `test()` / `it()` per Xray case (`TC-n` in the title).
- **Environments:** URLs, credentials, and app paths come from `.env`. Never hardcode secrets.

## Current tests

| Spec | Platform | Case |
|---|---|---|
| `projects/webtv/tests/DEMO-2-TC-1.spec.ts` | WebTV | invalid login |
| `projects/gstream/tests/GSTREAM-1-TC-1.spec.ts` | GStream | signup → home |
| `projects/gstream/tests/GSTREAM-2-TC-1.spec.ts` | GStream | login invalid + valid |
| `projects/astream/tests/*` | AStream | scaffold (needs app binary) |
