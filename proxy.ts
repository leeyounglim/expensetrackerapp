import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAuthPage = pathname === '/login' || pathname === '/signup'
  const isApiRoute = pathname.startsWith('/api/')

  if (isApiRoute) return NextResponse.next()

  // Check for Supabase session cookie directly (no createServerClient needed)
  const hasSession = request.cookies.has('sb-dwazttcvdqwqujkjqumw-auth-token') 

  if (!hasSession && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (hasSession && isAuthPage) {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}