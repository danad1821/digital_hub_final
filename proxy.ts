// /middleware.ts or /app/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose"; // 💡 Import jose for JWT verification

// ============================================================================
// AUTHENTICATION MIDDLEWARE CONFIGURATION
// ============================================================================

const LOGIN_ROUTE = "/admin";
const DASHBOARD_ROUTE = "/admin/home";
const AUTH_COOKIE_KEY = "auth-token";

// ============================================================================
// MIDDLEWARE FUNCTION
// ============================================================================

/**
 * Main middleware function that handles authentication and routing logic.
 */
export async function proxy(request: NextRequest): Promise<NextResponse> {
  const authCookie = request.cookies.get(AUTH_COOKIE_KEY)?.value;
  let isAuthenticated = false;

  // --- Step 1: Robust JWT Verification ---
  if (authCookie) {
    // Retrieve the secret key from environment variables
    const jwtSecret = process.env.JWT_SECRET;

    if (jwtSecret) {
      try {
        // The secret key must be in the format expected by jose (Uint8Array)
        const secret = new TextEncoder().encode(jwtSecret);

        // jwtVerify checks signature, structure, and expiry (exp claim)
        await jwtVerify(authCookie, secret, {
          algorithms: ["HS256"], // Explicitly match the 'jsonwebtoken' default
          clockTolerance: 60, // Allow 60 seconds of difference between server clocks
        });

        // If the promise resolves without error, the token is valid.
        isAuthenticated = true;
      } catch (error) {
        // If an error is caught (e.g., JWSInvalid or JWTExpired),
        // the token is invalid or expired.
        console.log("JWT Verification Failed or Token Expired:", error);
        isAuthenticated = false;
      }
    } else {
      // Log configuration error but default to unauthenticated if secret is missing
      console.error(
        "Configuration Error: JWT_SECRET is not set in middleware.",
      );
    }
  }
  // --- End of JWT Verification ---

  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === LOGIN_ROUTE;
  const isProtectedAdminRoute = pathname.startsWith(`${LOGIN_ROUTE}/`);

  // --- Logic Flow ---

  // 1. Unauthenticated user tries to access a protected route
  if (isProtectedAdminRoute && !isAuthenticated) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = LOGIN_ROUTE;

    // 💡 Ensure the invalid/expired cookie is deleted upon redirect
    const response = NextResponse.redirect(redirectUrl);
    response.cookies.delete(AUTH_COOKIE_KEY);
    return response;
  }

  // 2. Authenticated user tries to access the login page
  if (isLoginPage && isAuthenticated) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = DASHBOARD_ROUTE;
    return NextResponse.redirect(redirectUrl);
  }

  // 3. Allow request to proceed normally
  return NextResponse.next();
}

// ============================================================================
// MIDDLEWARE CONFIGURATION
// ============================================================================

export const config = {
  // Matches the login page (/admin) and all routes under it (/admin/*)
  matcher: ["/admin/:path*", "/admin"],
};
