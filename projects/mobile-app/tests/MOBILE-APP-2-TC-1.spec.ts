/**
 * Mobile App — Login validation + happy path
 * Flow: Welcome → Sign in → (signup setup) → Log out → Continue → Dashboard
 * Jira: MOBILE-APP-2 — Xray TC-1 / TC-2
 */
describe('MOBILE-APP-2: Login', () => {
  it('TC-1: invalid credentials show an error and do not sign in', async () => {
    const { MobileAppWelcomePage } = await import('../pages/WelcomePage');
    const { MobileAppLoginPage } = await import('../pages/LoginPage');
    const { MobileAppHomePage } = await import('../pages/HomePage');

    const welcome = new MobileAppWelcomePage(browser);
    const login = new MobileAppLoginPage(browser);
    const home = new MobileAppHomePage(browser);

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
    const { MobileAppLoginPage } = await import('../pages/LoginPage');
    const { MobileAppSignUpPage } = await import('../pages/SignUpPage');
    const { MobileAppHomePage } = await import('../pages/HomePage');

    const login = new MobileAppLoginPage(browser);
    const signup = new MobileAppSignUpPage(browser);
    const home = new MobileAppHomePage(browser);

    const firstName = 'Login';
    const lastName = 'Tester';
    const email = `mobile.login.${Date.now()}@test.local`;
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

    // Logout returns to Welcome — dismiss again into Sign in
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
