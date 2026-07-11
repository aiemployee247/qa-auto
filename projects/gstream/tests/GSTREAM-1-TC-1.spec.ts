/**
 * GStream — Signup happy path
 * Flow: Welcome → Sign in → Create Account → Dashboard + Profile tabs
 * Jira: GSTREAM-1 — Xray TC-1
 */
describe('GSTREAM-1: Sign up', () => {
  it('TC-1: Welcome → Create Account → Dashboard and Profile', async () => {
    const { GStreamWelcomePage } = await import('../pages/WelcomePage');
    const { GStreamLoginPage } = await import('../pages/LoginPage');
    const { GStreamSignUpPage } = await import('../pages/SignUpPage');
    const { GStreamHomePage } = await import('../pages/HomePage');

    const welcome = new GStreamWelcomePage(browser);
    const login = new GStreamLoginPage(browser);
    const signup = new GStreamSignUpPage(browser);
    const home = new GStreamHomePage(browser);

    const firstName = 'GStream';
    const lastName = 'Tester';
    const email = `gstream.user.${Date.now()}@test.local`;
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
