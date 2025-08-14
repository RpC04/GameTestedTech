import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const isMissingEnvVars =
    typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "undefined" ||
    typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "undefined"

  if (isMissingEnvVars) {
    return res
  }

  const supabase = createMiddlewareClient({ req, res })

  // Redirect to admin if already logged in and trying to access login
  if (req.nextUrl.pathname === "/admin/login") {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        return NextResponse.redirect(new URL("/admin", req.url))
      }
    } catch (error) {
      console.error("Login redirect error:", error)
    }
    return res
  }

  // Check admin area protection
  if (req.nextUrl.pathname.startsWith("/admin")) {
    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        const redirectUrl = new URL("/admin/login", req.url)
        return NextResponse.redirect(redirectUrl)
      } 
    } catch (error) {
      console.error("Auth middleware error:", error)
      const redirectUrl = new URL("/admin/login", req.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return res
}

export const config = {
  matcher: ["/admin/:path*"],
}