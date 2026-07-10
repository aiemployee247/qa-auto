/**
 * AStream — Signup happy path
 * Flow: Welcome → Sign in → Create Account → Dashboard + Profile tabs
 * Jira: ASTREAM-1 — Xray TC-1
 */
describe('ASTREAM-1: Sign up', () => {
  it('TC-1: Welcome → Create Account → Dashboard and Profile', async () => {
    const { AStreamWelcomePage } = await import('../pages/WelcomePage');
    const { AStreamLoginPage } = await import('../pages/LoginPage');
    const { AStreamSignUpPage } = await import('../pages/SignUpPage');
    const { AStreamHomePage } = await import('../pages/HomePage');

    const welcome = new AStreamWelcomePage(browser);
    const login = new AStreamLoginPage(browser);
    const signup = new AStreamSignUpPage(browser);
    const home = new AStreamHomePage(browser);

    const firstName = 'AStream';
    const lastName = 'Tester';
    const email = `astream.user.${Date.now()}@test.local`;
    const password = 'Passw0rd!';

    if (await welcome.isShowing()) {
      await expect(welcome.getStartedButton).toBeExisting();
      await welcome.getStarted();
    }

    await login.waitForReady();
    await expect(login.emailInput).toBeExisting();
    await expect(login.submitButton).toBeExisting();

    await login.openSignUp();
    await signup.waitForReady();

    // Fields above the fold (birthdate is below — filled during signUp scroll)
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
      birthMonth: '03',
      birthDay: '15',
      birthYear: '1995',
      optInBrand: true,
    });

    await home.waitForReady();
    await expect(home.heading).toBeExisting();
    await expect(home.userName).toHaveText(`${firstName} ${lastName}`);
    await expect(home.userEmail).toHaveText(email);
    await expect(home.dashboardTab).toBeExisting();
    await expect(home.profileTab).toBeExisting();
    await expect(home.stats).toBeExisting();

    await home.openProfile();
    await expect(home.profileHeading).toBeExisting();
    await expect(home.profileDisplayName).toHaveText(`${firstName} ${lastName}`);
    await expect(home.profileEmail).toHaveText(email);
    await expect(home.profileSave).toBeExisting();

    await home.openDashboard();
    await expect(home.heading).toBeExisting();
  });
});
