const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

type FetchOptions = RequestInit & {
  auth?: boolean;
  _retry?: boolean; // controle interno para evitar loop
};

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return null;

    const { data } = await res.json();

    // Atualiza o accessToken no storage e no cookie
    localStorage.setItem("accessToken", data.accessToken);
    const expires = new Date(Date.now() + 864e5).toUTCString();
    document.cookie = `accessToken=${encodeURIComponent(data.accessToken)}; expires=${expires}; path=/; SameSite=Lax`;

    return data.accessToken;
  } catch {
    return null;
  }
}

export async function api<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { auth = false, _retry = false, headers, ...rest } = options;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token = localStorage.getItem("accessToken");
    if (token) defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...rest,
    headers: { ...defaultHeaders, ...(headers as Record<string, string>) },
  });

  // Token expirado → tenta refresh uma vez
  if (res.status === 401 && auth && !_retry) {
    const newToken = await refreshAccessToken();

    if (newToken) {
      // Refaz a requisição original com o novo token
      return api<T>(endpoint, { ...options, _retry: true });
    }

    // Refresh falhou → limpa sessão e redireciona pro login
    localStorage.clear();
    document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie = "permission=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    window.location.href = "/";
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.message ?? "Erro na requisição.");
  }

  return res.json() as Promise<T>;
}