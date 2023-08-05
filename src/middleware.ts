import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const rootUrl = new URL("/", req.url);

  // logout
  if (req.nextUrl.pathname === "/auth/logout") {
    const cookies = req.cookies.getAll();
    if (cookies.length > 0) {
      for (let i = 0; i < cookies.length; i++) {
        if (cookies[i].name.slice(-10) === "auth-token") {
          const res = NextResponse.redirect(
            new URL("/?reloadSession=true", req.url)
          );
          // delete authentication cookie
          res.cookies.delete(cookies[i].name);

          return res;
        }
      }
    }

    return NextResponse.redirect(rootUrl);
  }

  // handles protected routes
  if (req.nextUrl.pathname.slice(0, 11) === "/protected/") {
    const user = await supabase.auth.getSession();
    // an error on getSession() may result in a faulty user session
    if (user.data?.session === null || user.error) {
      return NextResponse.redirect(
        new URL(`/auth/login?redirect=${req.nextUrl.pathname}`, req.url)
      );
    }

    // makes sure a user cannot register a company if they already have one
    if (req.nextUrl.pathname === "/protected/company-profile/register") {
      const company = await supabase
        .from("companies")
        .select()
        .eq("user_id", user.data.session.user.id)
        .limit(1)
        .single();

      // redirect to company profile page if company is already registered
      if (company.data && !company.error) {
        return NextResponse.redirect(
          new URL("/protected/company-profile", req.url)
        );
      }
    }
  }

  // handles routes that should only be accessed as an unauthenticated user
  const restrictedToUnauthenticatedURLs = ["/auth/signup", "/auth/login"];
  if (restrictedToUnauthenticatedURLs.includes(req.nextUrl.pathname)) {
    const { data, error } = await supabase.auth.getUser();
    if (data?.user && !error) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  await supabase.auth.refreshSession();

  return res;
}
