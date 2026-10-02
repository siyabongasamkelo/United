export const getWelcomeSetupTemplate = (setupUrl: string) => ({
  text: `Welcome to the Platform. An account has been provisioned for you. Please finalize your setup by clicking here: ${setupUrl}`,
  html: `
    <div style="font-family: sans-serif; padding: 20px; max-width: 600px;">
      <h2>Welcome to the Platform!</h2>
      <p>An administrator has created your profile account. To activate your access and choose a password, please click the button below:</p>
      <a href="${setupUrl}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">Setup Account Password</a>
      <p>This validation link will expire in 48 hours.</p>
    </div>
  `,
});

export const getVerificationTemplate = (verifyUrl: string) => ({
  text: `Please verify your email address by opening this link: ${verifyUrl}`,
  html: `
    <div style="font-family: sans-serif; padding: 20px; max-width: 600px;">
      <h2>Confirm Your Registration</h2>
      <p>Thank you for signing up. Please verify your email identity to begin utilizing the dashboard applications:</p>
      <a href="${verifyUrl}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">Verify Account</a>
    </div>
  `,
});
