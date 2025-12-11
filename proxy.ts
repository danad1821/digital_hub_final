// /middleware.ts or /app/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ============================================================================
// AUTHENTICATION MIDDLEWARE CONFIGURATION
// ============================================================================

/**
 * The login page route - accessible only to unauthenticated users.
 */
const LOGIN_ROUTE = "/admin";

/**
 * The dashboard route - where authenticated users are redirected after login.
 */
const DASHBOARD_ROUTE = "/admin/home";

/**
 * Cookie key used to store authentication status (Updated for JWT).
 */
const AUTH_COOKIE_KEY = "auth-token"; 

// ============================================================================
// MIDDLEWARE FUNCTION
// ============================================================================

/**
 * Main middleware function that handles authentication and routing logic.
 */
export function proxy(request: NextRequest): NextResponse {
    // Step 1: Extract authentication cookie
    const authCookie = request.cookies.get(AUTH_COOKIE_KEY)?.value;
    const isAuthenticated = Boolean(authCookie);
    // Note: In a production-grade app, you might decode/verify the JWT here
    // to ensure it hasn't expired, making the 'isAuthenticated' check more robust.

    const { pathname } = request.nextUrl;
    
    const isLoginPage = pathname === LOGIN_ROUTE;
    // An Admin page is any page *inside* the admin area, but not the login page itself.
    const isProtectedAdminRoute = pathname.startsWith(`${LOGIN_ROUTE}/`);

    // --- Logic Flow ---

    // 1. Unauthenticated user tries to access a protected route
    if (isProtectedAdminRoute && !isAuthenticated) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = LOGIN_ROUTE;
        
        // Redirect to login page
        return NextResponse.redirect(redirectUrl);
    }

    // 2. Authenticated user tries to access the login page
    if (isLoginPage && isAuthenticated) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = DASHBOARD_ROUTE;
        
        // Redirect to dashboard
        return NextResponse.redirect(redirectUrl);
    }

    // 3. Allow request to proceed normally (Authenticated user on protected page, 
    //    or Unauthenticated user on public page, or any unhandled case)
    return NextResponse.next();
}

// ============================================================================
// MIDDLEWARE CONFIGURATION
// ============================================================================

export const config = {
    // Matches the login page (/admin) and all routes under it (/admin/*)
    matcher: ["/admin/:path*", "/admin"], 
};