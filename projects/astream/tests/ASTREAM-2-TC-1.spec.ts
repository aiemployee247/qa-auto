/**
 * AStream — Login validation + happy path
 * Flow: Welcome → Sign in → (signup setup) → Log out → Continue → Dashboard
 * Jira: ASTREAM-2 — Xray TC-1 / TC-2
 */
describe('ASTREAM-2: Login', () => {
  beforeEach(async () => {
    const platform = String(browser.capabilities.platformName || '').toLowerCase();
    if (platform === 'ios') {
      await browser.execute('mobile: terminateApp', {
        bundleId: 'com.astream.auth',
      });
      await browser.execute('mobile: activateApp', {
        bundleId: 'com.astream.auth',
      });
    } else {
      await browser.execute('mobile: clearApp', {
        appId: 'com.astream.auth',
      });
      await browser.execute('mobile: activateApp', {
        appId: 'com.astream.auth',
      });
    }
    await browser.pause(1500);
  });

  it('TC-1: invalid credentials show an error and do not sign in', async () => {
    const { AStreamWelcomePage } = await import('../pages/WelcomePage');
    const { AStreamLoginPage } = await import('../pages/LoginPage');
    const { AStreamHomePage } = await import('../pages/HomePage');

    const welcome = new AStreamWelcomePage(browser);
    const login = new AStreamLoginPage(browser);
    const home = new AStreamHomePage(browser);

    if (await welcome.isShowing()) {
      await welcome.getStarted();
    }

    await login.waitForReady();
    await expect(login.emailInput).toBeExisting();
    await expect(login.passwordInput).toBeExisting();
    await expect(login.submitButton).toBeExisting();

    await login.login('wrong-user@test.local', 'definitely-wrong');

    await expect(login.errorMessage).toBeDisplayed();
    await expect(home.heading).not.toBeExisting();
  });

  it('TC-2: valid credentials sign in and show dashboard', async () => {
    const { AStreamLoginPage } = await import('../pages/LoginPage');
    const { AStreamSignUpPage } = await import('../pages/SignUpPage');
    const { AStreamHomePage } = await import('../pages/HomePage');

    const login = new AStreamLoginPage(browser);
    const signup = new AStreamSignUpPage(browser);
    const home = new AStreamHomePage(browser);

    const firstName = 'Login';
    const lastName = 'Tester';
    const email = `astream.login.${Date.now()}@test.local`;
    const password = 'Passw0rd!';

    await login.waitForReady();
    await login.openSignUp();
    await signup.waitForReady();
    await signup.signUp({
      firstName,
      lastName,
      email,
      password,
      confirmPassword: password,
    });
    await home.waitForReady();
    await home.logout();

    await login.waitForReady();
    await expect(login.submitButton).toBeExisting();
    await login.login(email, password);

    await home.waitForReady();
    await expect(home.heading).toBeExisting();
    await expect(home.userName).toHaveText(`${firstName} ${lastName}`);
    await expect(home.userEmail).toHaveText(email);
    await expect(home.dashboardTab).toBeExisting();
    await expect(home.profileTab).toBeExisting();
  });
});
