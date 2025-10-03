import { NextResponse } from "next/server"

// Mock database
let workspaces = [
  {
    id: "1",
    name: "Handwriting",
    description: "Handwriting analysis workspace",
    pdfCount: 2,
    imageCount: 2,
    audioCount: 0,
    modified: new Date(Date.now() - 3600000).toISOString(),
    userId: "1",
  },
  {
    id: "2",
    name: "myportfolio",
    description: "Portfolio documents",
    pdfCount: 0,
    imageCount: 1,
    audioCount: 0,
    modified: new Date(Date.now() - 25200000).toISOString(),
    userId: "1",
  },
]

// GET all workspaces
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "1"

    const userWorkspaces = workspaces.filter((w) => w.userId === userId)

    return NextResponse.json(
      {
        success: true,
        workspaces: userWorkspaces,
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

// POST create new workspace
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, userId = "1" } = body

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Workspace name is required" },
        { status: 400 }
      )
    }

    const newWorkspace = {
      id: Date.now().toString(),
      name,
      description: description || "",
      pdfCount: 0,
      imageCount: 0,
      audioCount: 0,
      modified: new Date().toISOString(),
      userId,
    }

    workspaces.push(newWorkspace)

    return NextResponse.json(
      {
        success: true,
        workspace: newWorkspace,
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE workspace
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Workspace ID is required" },
        { status: 400 }
      )
    }

    workspaces = workspaces.filter((w) => w.id !== id)

    return NextResponse.json(
      {
        success: true,
        message: "Workspace deleted successfully",
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