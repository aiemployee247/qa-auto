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

const localIosCaps = {
  platformName: 'iOS',
  'appium:automationName': 'XCUITest',
  'appium:deviceName': process.env.IOS_DEVICE_NAME || 'GStream_iPhone',
  'appium:platformVersion': process.env.IOS_PLATFORM_VERSION || '26.5',
  'appium:app': resolveAppPath('GSTREAM_IOS_APP', 'apps/gstream/ios/GStream.app'),
  'appium:bundleId': 'com.gstream.auth',
  'appium:autoAcceptAlerts': true,
  'appium:newCommandTimeout': 240,
};

const sauceIosCaps = {
  platformName: 'iOS',
  'appium:automationName': 'XCUITest',
  'appium:app': process.env.GSTREAM_SAUCE_APP || 'storage:filename=gstream.ipa',
  'appium:deviceName': process.env.SAUCE_DEVICE_NAME || 'iPhone 15 Simulator',
  'appium:platformVersion': process.env.SAUCE_PLATFORM_VERSION || '17.0',
  'sauce:options': {
    name: 'gstream-ios',
    build: process.env.SAUCE_BUILD || `gstream-${Date.now()}`,
    appiumVersion: process.env.SAUCE_APPIUM_VERSION || '2.0.0',
  },
};

export const config: WebdriverIO.Config = {
  runner: 'local',
  specs: ['./tests/**/*.spec.ts'],
  maxInstances: 1,
  capabilities: [isSauce ? sauceIosCaps : localIosCaps],
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
