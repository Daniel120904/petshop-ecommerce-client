import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/"];
const USER_PREFIX = "/user";

const REDIRECT_MAP: Record<string, string> = {
  MASTER: "/admin",
  ADMIN: "/admin",
  USER: "/user",
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const permission  = request.cookies.get("permission")?.value;

  const isAuthenticated = !!accessToken;
  const isPublicRoute   = PUBLIC_ROUTES.includes(pathname);

  // Não logado tentando acessar rota protegida → manda pro login
  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Logado → sempre redireciona para a área correta se estiver fora dela
  if (isAuthenticated && permission) {
    const home = REDIRECT_MAP[permission] ?? USER_PREFIX;
    const isInCorrectArea = pathname.startsWith(home);

    if (!isInCorrectArea) {
      return NextResponse.redirect(new URL(home, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};