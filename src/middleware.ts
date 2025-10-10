import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  console.log('Middleware - Path:', nextUrl.pathname, 'Logged in:', isLoggedIn, 'Auth object:', !!req.auth, 'Auth details:', req.auth ? 'present' : 'null')

  // Allow API routes to pass through without authentication checks
  if (nextUrl.pathname.startsWith('/api/')) {
    console.log('Allowing API route to pass through')
    return NextResponse.next()
  }

  // Allow auth routes that are not NextAuth routes (for backend communication)
  if (nextUrl.pathname.startsWith('/auth/') && !nextUrl.pathname.startsWith('/api/auth/')) {
    console.log('Allowing backend auth route to pass through')
    return NextResponse.next()
  }

  // CRITICAL FIX: If user is logged in and on login page, redirect to overview immediately
  if (isLoggedIn && nextUrl.pathname === '/login') {
    console.log('Authenticated user on login page, redirecting to overview')
    const overviewUrl = new URL('/overview', nextUrl)
    console.log('Redirecting to:', overviewUrl.toString())
    return NextResponse.redirect(overviewUrl)
  }

  // Redirect authenticated users from home page to dashboard
  if (isLoggedIn && nextUrl.pathname === '/') {
    console.log('Authenticated user accessing home page, redirecting to overview')
    return NextResponse.redirect(new URL('/overview', nextUrl))
  }

  // Define routes that require user authentication
  const protectedRoutes = ['/overview', '/profile', '/trucks', '/drivers', '/orders', '/notifications']

  // Redirect unauthenticated users to login when accessing protected routes
  if (!isLoggedIn && protectedRoutes.includes(nextUrl.pathname)) {
    console.log('Unauthenticated user accessing protected route, redirecting to login')
    return NextResponse.redirect(new URL('/login', nextUrl))
  }

  // Allow request to continue to destination
  return NextResponse.next()
})

export const config = {
  matcher: [
    // Apply middleware to all routes except static assets
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
}