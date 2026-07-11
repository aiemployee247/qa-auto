/**
 * Mobile App — Signup happy path
 * Flow: Welcome → Sign in → Create Account → Dashboard + Profile tabs
 * Jira: MOBILE-APP-1 — Xray TC-1
 */
describe('MOBILE-APP-1: Sign up', () => {
  it('TC-1: Welcome → Create Account → Dashboard and Profile', async () => {
    const { MobileAppWelcomePage } = await import('../pages/WelcomePage');
    const { MobileAppLoginPage } = await import('../pages/LoginPage');
    const { MobileAppSignUpPage } = await import('../pages/SignUpPage');
    const { MobileAppHomePage } = await import('../pages/HomePage');

    const welcome = new MobileAppWelcomePage(browser);
    const login = new MobileAppLoginPage(browser);
    const signup = new MobileAppSignUpPage(browser);
    const home = new MobileAppHomePage(browser);

    const firstName = 'Mobile';
    const lastName = 'Tester';
    const email = `mobile.user.${Date.now()}@test.local`;
    const password = 'Passw0rd!';

    // Welcome (first screen after install)
    if (await welcome.isShowing()) {
      await expect(welcome.getStartedButton).toBeExisting();
      await welcome.getStarted();
    }

    await login.waitForReady();
    await expect(login.emailInput).toBeExisting();
    await expect(login.submitButton).toBeExisting();

    await login.openSignUp();
    await signup.waitForReady();

    // Create Account form (fields above the fold)
    await expect(signup.firstNameInput).toBeExisting();
    await expect(signup.lastNameInput).toBeExisting();
    await expect(signup.emailInput).toBeExisting();
    await expect(signup.passwordInput).toBeExisting();
    await expect(signup.confirmPasswordInput).toBeExisting();
    await expect(signup.submitButton).toBeExisting();

    await signup.signUp({
      firstName,
      lastName,
      email,
      password,
      confirmPassword: password,
      optInBrand: true,
    });

    // Dashboard tab (default after Register)
    await home.waitForReady();
    await expect(home.heading).toBeExisting();
    await expect(home.userName).toHaveText(`${firstName} ${lastName}`);
    await expect(home.userEmail).toHaveText(email);
    await expect(home.dashboardTab).toBeExisting();
    await expect(home.profileTab).toBeExisting();
    await expect(home.stats).toBeExisting();

    // Profile tab
    await home.openProfile();
    await expect(home.profileHeading).toBeExisting();
    await expect(home.profileDisplayName).toHaveText(`${firstName} ${lastName}`);
    await expect(home.profileEmail).toHaveText(email);
    await expect(home.profileSave).toBeExisting();

    // Back to Dashboard
    await home.openDashboard();
    await expect(home.heading).toBeExisting();
  });
});
