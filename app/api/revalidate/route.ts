import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export async function POST(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url)
    const supabase = createRouteHandlerClient({ cookies })

    // Verify the request is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the path to revalidate from the request body
    const { path } = await request.json()

    if (!path) {
      return NextResponse.json({ error: "Path is required" }, { status: 400 })
    }

    // Revalidate the path
    revalidatePath(path)

    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (error) {
    console.error("Error revalidating path:", error)
    return NextResponse.json({ error: "Error revalidating path" }, { status: 500 })
  }
}
