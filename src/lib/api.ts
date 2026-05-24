const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type FetchOptions = RequestInit & {
  auth?: boolean; // true = envia Authorization header automaticamente
};

export async function api<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { auth = false, headers, ...rest } = options;

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

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.message ?? "Erro na requisição.");
  }
  console.log(res)
  return res.json() as Promise<T>;
}