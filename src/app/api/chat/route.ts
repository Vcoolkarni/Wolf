import { NextResponse } from "next/server"

// Mock message storage
const conversations: Record<string, any[]> = {}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { message, workspaceId } = body

    if (!message || !workspaceId) {
      return NextResponse.json(
        { success: false, error: "Message and workspaceId are required" },
        { status: 400 }
      )
    }

    // Store user message
    if (!conversations[workspaceId]) {
      conversations[workspaceId] = []
    }

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    }

    conversations[workspaceId].push(userMessage)

    // Simulate AI response
    const aiResponse = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: generateMockResponse(message),
      timestamp: new Date().toISOString(),
    }

    conversations[workspaceId].push(aiResponse)

    return NextResponse.json(
      {
        success: true,
        response: aiResponse,
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Chat request failed" },
      { status: 500 }
    )
  }
}

// GET conversation history
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

    const messages = conversations[workspaceId] || []

    return NextResponse.json(
      {
        success: true,
        messages,
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

// Helper function to generate mock AI responses
function generateMockResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase()

  if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
    return "Hello! I'm here to help you analyze your uploaded documents and media. What would you like to know?"
  }

  if (lowerMessage.includes("pdf") || lowerMessage.includes("document")) {
    return "I can help you analyze PDF documents. I can extract text, summarize content, answer questions about the document, and more. Please upload a PDF file to get started."
  }

  if (lowerMessage.includes("image") || lowerMessage.includes("picture")) {
    return "I can analyze images and describe their content. Upload an image and ask me questions about it, such as identifying objects, reading text, or describing scenes."
  }

  return "I'm analyzing your uploaded sources to provide you with an answer. Based on the content available in your workspace, I can help you understand, summarize, and extract information from your documents and media files."
}