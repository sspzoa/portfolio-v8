import { NextResponse } from "next/server"
import { getNotionCache } from "@/lib/mongodb"

export async function GET() {
  try {
    const data = await getNotionCache("activities")

    if (!data) {
      return NextResponse.json({ error: "Data not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch activities data" },
      { status: 500 }
    )
  }
}
