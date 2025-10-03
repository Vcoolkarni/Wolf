"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Home, Settings, LogOut, Upload, Send, Copy, Volume2, Bot, User, FileText, Image as ImageIcon, Mic as MicIcon, TrendingUp, Loader2, X, Video, FileType, BarChart3, Headphones, FileImage, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useParams } from "next/navigation"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  citations?: { number: number; source: string; page?: string }[]
}

interface SourceFile {
  id: string
  name: string
  size: string
  type: "pdf" | "image" | "audio" | "video" | "document"
}

export default function WorkspacePage() {
  const params = useParams()
  const workspaceId = params.id as string
  
  const [workspaceName, setWorkspaceName] = useState("Workspace")
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [sources, setSources] = useState<SourceFile[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null)
  const [voiceGender, setVoiceGender] = useState<"male" | "female">("female")
  const [summaryType, setSummaryType] = useState<"text" | "diagram" | "podcast" | null>(null)
  const [generatingSummary, setGeneratingSummary] = useState(false)
  const [deletingChat, setDeletingChat] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchWorkspaceInfo()
    fetchFiles()
    fetchMessages()
    
    // Load voice preference from settings
    const loadSettings = async () => {
      try {
        const response = await fetch("/api/settings?userId=1")
        const data = await response.json()
        if (data.success) {
          setVoiceGender(data.settings.voiceGender)
        }
      } catch (error) {
        console.error("Failed to load settings:", error)
      }
    }
    loadSettings()
  }, [workspaceId])

  const fetchWorkspaceInfo = async () => {
    try {
      const response = await fetch(`/api/workspaces?id=${workspaceId}`)
      const data = await response.json()
      if (data.success && data.workspace) {
        setWorkspaceName(data.workspace.name)
      }
    } catch (error) {
      console.error("Failed to fetch workspace info:", error)
    }
  }

  const fetchFiles = async () => {
    try {
      const response = await fetch(`/api/upload?workspaceId=${workspaceId}`)
      const data = await response.json()
      if (data.success) {
        setSources(data.files)
      }
    } catch (error) {
      console.error("Failed to fetch files:", error)
    }
  }

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/chat?workspaceId=${workspaceId}`)
      const data = await response.json()
      if (data.success) {
        setMessages(data.messages)
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error)
    }
  }

  const handleDeleteChat = async () => {
    if (!confirm("Are you sure you want to delete this entire chat? This action cannot be undone.")) {
      return
    }

    setDeletingChat(true)
    try {
      const response = await fetch(`/api/chat?workspaceId=${workspaceId}`, {
        method: "DELETE",
      })

      const data = await response.json()
      if (data.success) {
        setMessages([])
      }
    } catch (error) {
      console.error("Failed to delete chat:", error)
    } finally {
      setDeletingChat(false)
    }
  }

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: inputValue,
      }
      setMessages([...messages, newMessage])
      setInputValue("")
      setLoading(true)
      
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: inputValue,
            workspaceId,
            sources: sources.map(s => ({ id: s.id, name: s.name, type: s.type })),
          }),
        })

        const data = await response.json()
        if (data.success) {
          setMessages((prev) => [...prev, data.response])
        }
      } catch (error) {
        console.error("Failed to send message:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      setUploading(true)
      
      for (const file of Array.from(files)) {
        try {
          const formData = new FormData()
          formData.append("file", file)
          formData.append("workspaceId", workspaceId)

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          })

          const data = await response.json()
          if (data.success) {
            setSources((prev) => [...prev, data.file])
          }
        } catch (error) {
          console.error("Failed to upload file:", error)
        }
      }
      
      setUploading(false)
    }
  }

  const handleDeleteFile = async (fileId: string) => {
    try {
      const response = await fetch(`/api/upload?fileId=${fileId}&workspaceId=${workspaceId}`, {
        method: "DELETE",
      })

      const data = await response.json()
      if (data.success) {
        setSources((prev) => prev.filter((s) => s.id !== fileId))
      }
    } catch (error) {
      console.error("Failed to delete file:", error)
    }
  }

  const handleReadAloud = async (messageId: string, content: string) => {
    if (playingMessageId === messageId) {
      setPlayingMessageId(null)
      window.speechSynthesis.cancel()
    } else {
      setPlayingMessageId(messageId)
      const utterance = new SpeechSynthesisUtterance(content)
      
      // Set voice based on gender preference
      const voices = window.speechSynthesis.getVoices()
      const selectedVoice = voices.find(voice => 
        voiceGender === "female" 
          ? voice.name.includes("Female") || voice.name.includes("Samantha") || voice.name.includes("Victoria")
          : voice.name.includes("Male") || voice.name.includes("Daniel") || voice.name.includes("Alex")
      )
      if (selectedVoice) utterance.voice = selectedVoice
      
      utterance.onend = () => setPlayingMessageId(null)
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleGenerateSummary = async (type: "text" | "diagram" | "podcast") => {
    setSummaryType(type)
    setGeneratingSummary(true)
    
    try {
      // Simulate summary generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const summaryMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: type === "text" 
          ? "Summary: This workspace contains multiple documents discussing AI and machine learning concepts. The main themes include neural networks, data processing, and model training..."
          : type === "diagram"
          ? "📊 [Diagram Generated] A visual summary showing the relationship between your uploaded documents and key concepts has been created."
          : "🎙️ [Audio Podcast Generated] A 2-minute audio summary of your workspace content is ready to play.",
      }
      
      setMessages((prev) => [...prev, summaryMessage])
    } catch (error) {
      console.error("Failed to generate summary:", error)
    } finally {
      setGeneratingSummary(false)
      setSummaryType(null)
    }
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-5 h-5 text-red-400" />
      case "image":
        return <ImageIcon className="w-5 h-5 text-blue-400" />
      case "audio":
        return <MicIcon className="w-5 h-5 text-purple-400" />
      case "video":
        return <Video className="w-5 h-5 text-green-400" />
      default:
        return <FileType className="w-5 h-5 text-gray-400" />
    }
  }

  const pdfCount = sources.filter((s) => s.type === "pdf").length
  const imageCount = sources.filter((s) => s.type === "image").length
  const audioCount = sources.filter((s) => s.type === "audio").length
  const videoCount = sources.filter((s) => s.type === "video").length

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/58fd43ef-3585-427a-8087-aea2cbb5d7ef/generated_images/minimalist-wolf-head-logo-icon-in-white--d843b5fe-20251003152443.jpg?"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl font-light text-white">Declutter</h1>
            <span className="text-gray-500 mx-2">/</span>
            <span className="text-lg text-gray-300">{workspaceName}</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteChat}
              disabled={deletingChat || messages.length === 0}
              className="text-gray-400 hover:text-red-400"
            >
              {deletingChat ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Chat
                </>
              )}
            </Button>
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Home className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Settings className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/auth">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <LogOut className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Three Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Sources */}
        <div className="w-80 border-r border-gray-800 bg-gray-950/50 flex flex-col">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-4">Sources</h2>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="*/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full bg-white text-black hover:bg-gray-200 gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload Files
                </>
              )}
            </Button>
            <p className="text-sm text-gray-400 mt-3">
              Supports all file types: PDFs, images, videos, audio, documents, and more.
            </p>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-6 space-y-3">
              {sources.length === 0 ? (
                <div className="text-center py-12">
                  <Upload className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500">No sources yet</p>
                </div>
              ) : (
                sources.map((source) => (
                  <div
                    key={source.id}
                    className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getFileIcon(source.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{source.name}</p>
                        <p className="text-xs text-gray-500">{source.size}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteFile(source.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Center - Chat */}
        <div className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 p-6">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center mb-4">
                  <Bot className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl text-white mb-2">Ready to assist</h3>
                <p className="text-gray-400 max-w-md">
                  Upload files and ask me anything. I can retrieve documents, count files, and provide cited answers.
                </p>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-6">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-4 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] rounded-2xl px-6 py-4 ${
                        message.role === "user"
                          ? "bg-white text-black"
                          : "bg-gray-900 text-white"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      
                      {/* Citations */}
                      {message.citations && message.citations.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {message.citations.map((citation) => (
                            <button
                              key={citation.number}
                              className="w-6 h-6 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs text-gray-300 hover:bg-gray-700 transition-colors"
                              title={`Source: ${citation.source}${citation.page ? `, Page ${citation.page}` : ''}`}
                            >
                              {citation.number}
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {message.role === "assistant" && (
                        <div className="flex items-center gap-2 mt-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-3 text-gray-400 hover:text-white"
                            onClick={() => navigator.clipboard.writeText(message.content)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-8 px-3 ${playingMessageId === message.id ? 'text-green-400' : 'text-gray-400 hover:text-white'}`}
                            onClick={() => handleReadAloud(message.id, message.content)}
                          >
                            <Volume2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    {message.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-gray-300" />
                      </div>
                    )}
                  </motion.div>
                ))}
                {loading && (
                  <div className="flex gap-4 justify-start">
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="bg-gray-900 rounded-2xl px-6 py-4">
                      <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-gray-800 p-6">
            <div className="max-w-4xl mx-auto flex gap-3">
              <Input
                placeholder="Ask anything about your sources..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !loading && handleSendMessage()}
                disabled={loading}
                className="flex-1 bg-gray-900 border-gray-800 text-white placeholder:text-gray-500"
              />
              <Button
                onClick={handleSendMessage}
                disabled={loading || !inputValue.trim()}
                size="icon"
                className="bg-gray-800 hover:bg-gray-700"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Analytics & Summary */}
        <div className="w-80 border-l border-gray-800 bg-gray-950/50 p-6 overflow-y-auto">
          {/* Analytics Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-semibold text-white">Analytics</h2>
            </div>

            <div className="space-y-6">
              {/* Total Queries */}
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-400">Total Queries</p>
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
                <p className="text-4xl font-bold text-white">{messages.filter(m => m.role === "user").length}</p>
              </div>

              {/* Queries by Type */}
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                  <span>#</span>
                  Files by Type
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">PDF</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{pdfCount}</span>
                      <div className="w-2 h-2 rounded-full bg-red-400" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Image</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{imageCount}</span>
                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Audio</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{audioCount}</span>
                      <div className="w-2 h-2 rounded-full bg-purple-400" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Video</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{videoCount}</span>
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Summary</h2>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => handleGenerateSummary("text")}
                disabled={generatingSummary || sources.length === 0}
                className="w-full bg-gray-900 hover:bg-gray-800 border border-gray-800 text-white justify-start gap-3"
              >
                {generatingSummary && summaryType === "text" ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <FileText className="w-5 h-5" />
                )}
                Text Summary
              </Button>

              <Button
                onClick={() => handleGenerateSummary("diagram")}
                disabled={generatingSummary || sources.length === 0}
                className="w-full bg-gray-900 hover:bg-gray-800 border border-gray-800 text-white justify-start gap-3"
              >
                {generatingSummary && summaryType === "diagram" ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <FileImage className="w-5 h-5" />
                )}
                Diagram
              </Button>

              <Button
                onClick={() => handleGenerateSummary("podcast")}
                disabled={generatingSummary || sources.length === 0}
                className="w-full bg-gray-900 hover:bg-gray-800 border border-gray-800 text-white justify-start gap-3"
              >
                {generatingSummary && summaryType === "podcast" ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Headphones className="w-5 h-5" />
                )}
                Audio Podcast
              </Button>

              {sources.length === 0 && (
                <p className="text-xs text-gray-500 text-center mt-2">
                  Upload files to generate summaries
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}