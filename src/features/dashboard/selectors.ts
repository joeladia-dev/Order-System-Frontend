export function getTokenHint(
  customerToken: string,
  hasOAuthSession: boolean,
) {
  if (customerToken || hasOAuthSession) {
    return "Customer sign-in confirmed. Proceed to Ordering System.";
  }

  return "Sign in with OTP or Google OAuth. After Google redirect, cookie session auth is used automatically.";
}
