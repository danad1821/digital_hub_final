import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ============================================================================
// AUTHENTICATION MIDDLEWARE CONFIGURATION
// ============================================================================
// This middleware protects admin routes by enforcing authentication via cookies.
// It redirects unauthenticated users to login and authenticated users away from
// the login page to the dashboard.
// ============================================================================

/**
 * Routes that require authentication.
 * Any route starting with these paths will be protected.
 * Note: "/admin" (without trailing slash) is the login page and is public.
 */
const PROTECTED_ROUTES = ["/admin/"];

/**
 * The login page route - accessible only to unauthenticated users.
 */
const LOGIN_ROUTE = "/admin";

/**
 * The dashboard route - where authenticated users are redirected after login.
 */
const DASHBOARD_ROUTE = "/admin/home";

/**
 * Cookie key used to store authentication status.
 */
const AUTH_COOKIE_KEY = "user-role";

// ============================================================================
// MIDDLEWARE FUNCTION
// ============================================================================

/**
 * Main middleware function that handles authentication and routing logic.
 * 
 * @param request - The incoming NextRequest object
 * @returns NextResponse with appropriate redirection or pass-through
 * 
 * Flow:
 * 1. Check if user has authentication cookie
 * 2. Determine if current route is protected
 * 3. Redirect based on auth status and route type:
 *    - Unauthenticated + Protected Route → Login Page
 *    - Authenticated + Login Page → Dashboard
 *    - Otherwise → Continue to requested page
 */
export function proxy(request: NextRequest): NextResponse {
  // Step 1: Extract authentication cookie
  const authCookie = request.cookies.get(AUTH_COOKIE_KEY)?.value;
  const isAuthenticated = Boolean(authCookie);

  // Step 2: Check if requested route requires authentication
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Step 3: Handle unauthenticated access to protected routes
  if (isProtectedRoute && !isAuthenticated) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = LOGIN_ROUTE;
    
    return NextResponse.redirect(redirectUrl);
  }

  // Step 4: Handle authenticated access to login page
  // (redirect to dashboard to prevent unnecessary login attempts)
  const isLoginPage = request.nextUrl.pathname === LOGIN_ROUTE;
  
  if (isLoginPage && isAuthenticated) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = DASHBOARD_ROUTE;
    
    return NextResponse.redirect(redirectUrl);
  }

  // Step 5: Allow request to proceed normally
  return NextResponse.next();
}

// ============================================================================
// MIDDLEWARE CONFIGURATION
// ============================================================================

/**
 * Matcher configuration determines which routes trigger this middleware.
 * The pattern "/admin/:path*" matches:
 *   - /admin (the login page)
 *   - /admin/home (dashboard)
 *   - /admin/services (protected admin page)
 *   - /admin/any/nested/route (any admin route)
 * 
 * This ensures all admin-related routes go through authentication checks.
 */
export const config = {
  matcher: ["/admin/:path*", "/admin"],
};