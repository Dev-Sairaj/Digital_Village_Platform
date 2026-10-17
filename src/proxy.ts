import { NextResponse, type NextRequest } from "next/server";
import { ROLE_HOME, canAccessPath } from "@/lib/permissions";
import { SESSION_COOKIE, verifyToken } from "@/lib/token";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifyToken(token) : null;
  const isLoginPage = pathname === "/login";

  if (!session) {
    if (isLoginPage) {
      const response = NextResponse.next();
      if (token) response.cookies.delete(SESSION_COOKIE); // drop invalid/expired cookie
      return response;
    }
    const url = new URL("/login", request.url);
    if (pathname !== "/") url.searchParams.set("next", `${pathname}${search}`);
    if (token) url.searchParams.set("reason", "expired");
    const response = NextResponse.redirect(url);
    if (token) response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  if (isLoginPage) {
    return NextResponse.redirect(new URL(ROLE_HOME[session.role], request.url));
  }

  if (!canAccessPath(session.role, pathname)) {
    return NextResponse.redirect(
      new URL(`${ROLE_HOME[session.role]}?denied=1`, request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
