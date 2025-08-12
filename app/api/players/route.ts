import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch("http://2.58.113.233:30120/players.json", {
      headers: {
        "User-Agent": "FiveM-Launcher/1.0",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const players = await response.json()

    return NextResponse.json(players)
  } catch (error) {
    console.error("Failed to fetch players:", error)
    // Return empty array as fallback
    return NextResponse.json([])
  }
}
