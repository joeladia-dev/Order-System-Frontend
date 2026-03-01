import { requestJson } from "./http";

export type AuthResponse = {
  accessToken: string;
  tokenType: string;
  expiresAt: string;
  user: {
    id: string;
    email: string;
    emailVerified: boolean;
  };
};

export function requestCode(email: string) {
  return requestJson<{ verificationCode?: string; expiresInSeconds: number }>(
    "/api/auth/request-code",
    {
      method: "POST",
      body: JSON.stringify({ email }),
    },
  );
}

export function verifyCode(email: string, code: string) {
  return requestJson<AuthResponse>("/api/auth/verify-code", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
}

export function createDevToken(email: string, roles: string[]) {
  return requestJson<AuthResponse>("/api/auth/dev/token", {
    method: "POST",
    body: JSON.stringify({ email, roles, scopes: [] }),
  });
}

export function getGoogleStartUrl() {
  return requestJson<{ authorizeUrl: string }>("/api/auth/oauth/start/google");
}
