import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Verificar si las variables de entorno están disponibles
  const isMissingEnvVars =
    typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "undefined" ||
    typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "undefined"

  // Si faltan variables de entorno, permitir el acceso para mostrar el mensaje de error
  if (isMissingEnvVars) {
    return res
  }

  const supabase = createMiddlewareClient({ req, res })

  // Check if the request is for the admin area
  if (req.nextUrl.pathname.startsWith("/admin") && req.nextUrl.pathname !== "/admin/login") {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      // If no session, redirect to login
      if (!session) {
        const redirectUrl = new URL("/admin/login", req.url)
        return NextResponse.redirect(redirectUrl)
      }
    } catch (error) {
      console.error("Auth middleware error:", error)
      // En caso de error, redirigir al login
      const redirectUrl = new URL("/admin/login", req.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return res
}

export const config = {
  matcher: ["/admin/:path*"],
}
