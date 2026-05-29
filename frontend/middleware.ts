import { NextRequest, NextResponse } from "next/server";

import { ACCESS_COOKIE } from "./lib/config";

// Gate app routes on the presence of the access cookie (real check is server-side).
export function middleware(req: NextRequest) {
  if (!req.cookies.has(ACCESS_COOKIE)) {
    const url = new URL("/login", req.url);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/board/:path*", "/dashboard/:path*"],
};
