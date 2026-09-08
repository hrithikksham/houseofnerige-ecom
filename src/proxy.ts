import { createServerClient } from "@supabase/ssr";
import {
  NextResponse,
  type NextRequest,
} from "next/server";

import { ADMIN_USER_ID } from "@/lib/admin/config";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(
            ({ name, value }) => {
              request.cookies.set(name, value);
            }
          );

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(
            ({ name, value, options }) => {
              response.cookies.set(
                name,
                value,
                options
              );
            }
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, search } =
    request.nextUrl;

  const isLoginPage =
    pathname === "/admin/login";

  const isAuthorizedAdmin =
    Boolean(ADMIN_USER_ID) &&
    user?.id === ADMIN_USER_ID;

  /*
   * Login page
   *
   * - Authenticated authorized admin → dashboard
   * - Everyone else → login page
   */
  if (isLoginPage) {
    if (isAuthorizedAdmin) {
      return NextResponse.redirect(
        new URL("/admin", request.url)
      );
    }

    return response;
  }

  /*
   * Protect every other admin route.
   */
  if (!isAuthorizedAdmin) {
    const loginUrl = new URL(
      "/admin/login",
      request.url
    );

    const redirectedFrom =
      `${pathname}${search}`;

    loginUrl.searchParams.set(
      "redirectedFrom",
      redirectedFrom
    );

    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
  ],
};