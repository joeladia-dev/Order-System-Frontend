export type RequestInitWithAuth = RequestInit & {
  token?: string;
};

export async function requestJson<T>(
  path: string,
  init?: RequestInitWithAuth,
): Promise<T> {
  const headers = new Headers(init?.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (init?.token) {
    headers.set("Authorization", `Bearer ${init.token}`);
  }

  const response = await fetch(path, {
    ...init,
    headers,
  });

  if (!response.ok) {
    let message = `${response.status} ${response.statusText}`;
    const text = await response.text();
    if (text) {
      try {
        const data = JSON.parse(text) as { message?: string };
        message = data.message ?? text;
      } catch {
        message = text;
      }
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}
