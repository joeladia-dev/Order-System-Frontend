export function getTokenHint(customerToken: string) {
  if (customerToken) {
    return "Customer sign-in confirmed. Proceed to Ordering System.";
  }

  return "Sign in with OTP (or paste token), then go to Ordering System. Admin access is optional.";
}
