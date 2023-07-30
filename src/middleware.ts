import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const rootUrl = new URL("/", req.url);

  if (req.nextUrl.pathname === "/auth/logout") {
    const cookies = req.cookies.getAll();

    if (cookies.length > 0) {
      for (let i = 0; i < cookies.length; i++) {
        if (cookies[i].name.slice(-10) === "auth-token") {
          const res = NextResponse.next();
          // delete authentication cookie
          res.cookies.delete(cookies[i].name);
          return res;
        }
      }
    }

    return NextResponse.redirect(rootUrl);
  }

  const res = NextResponse.next();

  const supabase = createMiddlewareClient({ req, res });

  await supabase.auth.getSession();

  return res;
}
