# AStream (native) — Appium scaffold

Login/signup specs live under `tests/`. They **skip** until you set an app path:

```bash
ASTREAM_ANDROID_APP=/absolute/path/to/astream.apk
# or
ASTREAM_IOS_APP=/absolute/path/to/AStream.app
```

Place binaries under `apps/astream/` (gitignored) or point env vars at them.

```bash
# Local Android
npm run test:astream:android

# Local iOS simulator
npm run test:astream:ios

# Sauce Labs (later)
APPIUM_PROVIDER=sauce ASTREAM_SAUCE_APP=storage:filename=astream.apk npm run test:astream:android
```
