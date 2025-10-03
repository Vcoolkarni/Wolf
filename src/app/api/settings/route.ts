import { NextResponse } from "next/server"

// Mock user settings storage
let userSettings: Record<string, any> = {
  "1": {
    fullName: "Gwen Stacy",
    email: "mygwenstacy08@gmail.com",
    darkMode: true,
    autoRead: true,
    voiceGender: "female",
  },
}

// GET user settings
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "1"

    const settings = userSettings[userId] || {
      fullName: "User",
      email: "user@example.com",
      darkMode: true,
      autoRead: true,
      voiceGender: "female",
    }

    return NextResponse.json(
      {
        success: true,
        settings,
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT update user settings
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { userId = "1", ...settings } = body

    userSettings[userId] = {
      ...userSettings[userId],
      ...settings,
    }

    return NextResponse.json(
      {
        success: true,
        settings: userSettings[userId],
        message: "Settings updated successfully",
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update settings" },
      { status: 500 }
    )
  }
}