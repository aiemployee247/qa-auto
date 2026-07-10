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
# Prefer a release/offline APK so the app does not wait on Metro:
#   apps/gstream/android/app-release.apk
#   apps/gstream/ios/GStream.app   # simulator .app for now; IPA later for Sauce

# Terminal 1
npm run appium

# Terminal 2 — emulator/simulator must be running
npm run test:gstream:android
npm run test:gstream:ios
```

### Sauce Labs (next)

1. Upload the APK/IPA to Sauce Storage.
2. In `.env`:
   - `APPIUM_PROVIDER=sauce`
   - `SAUCE_USERNAME` / `SAUCE_ACCESS_KEY`
   - `GSTREAM_SAUCE_APP=storage:filename=gstream.apk` (or the returned storage id)
   - optional: `SAUCE_DEVICE_NAME`, `SAUCE_PLATFORM_VERSION`, `SAUCE_BUILD`
3. Run the same npm scripts (`test:gstream:android` / `test:gstream:ios`).

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
