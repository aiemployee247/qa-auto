import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../..');

function resolveAppPath(name: string, fallback: string): string {
  const raw = process.env[name] || fallback;
  return path.isAbsolute(raw) ? raw : path.resolve(repoRoot, raw);
}

const isSauce = process.env.APPIUM_PROVIDER === 'sauce';

const localAndroidCaps = {
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': process.env.ANDROID_DEVICE_NAME || 'Android Emulator',
  'appium:app': resolveAppPath(
    'GSTREAM_ANDROID_APP',
    'apps/gstream/android/app-release.apk',
  ),
  'appium:appPackage': 'com.gstream.auth',
  'appium:appActivity': '.MainActivity',
  'appium:appWaitActivity': 'com.gstream.auth.MainActivity',
  'appium:appWaitDuration': 60_000,
  'appium:autoGrantPermissions': true,
  'appium:newCommandTimeout': 240,
  'appium:adbExecTimeout': 120_000,
  'appium:androidInstallTimeout': 180_000,
  'appium:uiautomator2ServerLaunchTimeout': 120_000,
  // Give React Native time to mount after splash
  'appium:waitForIdleTimeout': 5_000,
};

const sauceAndroidCaps = {
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:app':
    process.env.GSTREAM_SAUCE_APP || 'storage:filename=gstream.apk',
  'appium:deviceName':
    process.env.SAUCE_DEVICE_NAME || 'Google Pixel 7 GoogleAPI Emulator',
  'appium:platformVersion': process.env.SAUCE_PLATFORM_VERSION || '14.0',
  'sauce:options': {
    name: 'gstream-android',
    build: process.env.SAUCE_BUILD || `gstream-${Date.now()}`,
    appiumVersion: process.env.SAUCE_APPIUM_VERSION || '2.0.0',
  },
};

export const config: WebdriverIO.Config = {
  runner: 'local',
  specs: ['./tests/**/*.spec.ts'],
  maxInstances: 1,
  capabilities: [isSauce ? sauceAndroidCaps : localAndroidCaps],
  logLevel: 'info',
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 180_000,
  },
  connectionRetryTimeout: 180_000,
  connectionRetryCount: 2,
  ...(isSauce
    ? {
        user: process.env.SAUCE_USERNAME,
        key: process.env.SAUCE_ACCESS_KEY,
        hostname: 'ondemand.us-west-1.saucelabs.com',
        port: 443,
        protocol: 'https' as const,
        path: '/wd/hub',
      }
    : {
        hostname: process.env.APPIUM_HOST || '127.0.0.1',
        port: Number(process.env.APPIUM_PORT || 4723),
        path: '/',
      }),
};
