export function getTokenHint(customerToken: string, hasOAuthSession: boolean) {
  if (customerToken || hasOAuthSession) {
    return "Customer sign-in confirmed. Proceed to Ordering System.";
  }

  return "Sign in with OTP or Google OAuth. After Google redirect, cookie session auth is used automatically.";
}

const roleClaimKeys = [
  "role",
  "roles",
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
];

function decodeJwtPayload(token: string) {
  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }

  const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  const paddedPayload = payload.padEnd(
    payload.length + ((4 - (payload.length % 4)) % 4),
    "=",
  );

  try {
    const json = atob(paddedPayload);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function tokenSubjectId(token: string) {
  if (!token.trim()) {
    return "";
  }

  const payload = decodeJwtPayload(token.trim());
  if (!payload) {
    return "";
  }

  const subject = payload.sub;
  if (typeof subject !== "string") {
    return "";
  }

  return subject.trim();
}

export function tokenHasAdminRole(token: string) {
  if (!token.trim()) {
    return false;
  }

  const payload = decodeJwtPayload(token.trim());
  if (!payload) {
    return false;
  }

  for (const key of roleClaimKeys) {
    const claim = payload[key];
    if (typeof claim === "string" && claim.toLowerCase() === "admin") {
      return true;
    }

    if (
      Array.isArray(claim) &&
      claim.some(
        (value) => typeof value === "string" && value.toLowerCase() === "admin",
      )
    ) {
      return true;
    }
  }

  return false;
}
