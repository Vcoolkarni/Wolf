import { NextResponse } from "next/server"

// Mock file storage
const uploadedFiles: Record<string, any[]> = {}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const workspaceId = formData.get("workspaceId") as string

    if (!file || !workspaceId) {
      return NextResponse.json(
        { success: false, error: "File and workspaceId are required" },
        { status: 400 }
      )
    }

    // Determine file type
    let fileType = "other"
    if (file.type.includes("pdf")) fileType = "pdf"
    else if (file.type.includes("image")) fileType = "image"
    else if (file.type.includes("audio")) fileType = "audio"

    // Simulate file processing
    const fileData = {
      id: Date.now().toString(),
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: fileType,
      uploadedAt: new Date().toISOString(),
      workspaceId,
    }

    // Store in mock database
    if (!uploadedFiles[workspaceId]) {
      uploadedFiles[workspaceId] = []
    }
    uploadedFiles[workspaceId].push(fileData)

    return NextResponse.json(
      {
        success: true,
        file: fileData,
        message:
          fileType === "audio"
            ? "Audio file stored but not yet queryable"
            : "File processed successfully",
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "File upload failed" },
      { status: 500 }
    )
  }
}

// GET files for a workspace
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const workspaceId = searchParams.get("workspaceId")

    if (!workspaceId) {
      return NextResponse.json(
        { success: false, error: "workspaceId is required" },
        { status: 400 }
      )
    }

    const files = uploadedFiles[workspaceId] || []

    return NextResponse.json(
      {
        success: true,
        files,
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