"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Home, Settings, LogOut, Plus, FileText, Image as ImageIcon, Mic, Trash2, Loader2, Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Workspace {
  id: string
  name: string
  pdfCount: number
  imageCount: number
  audioCount: number
  modified: string
}

export default function DashboardPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [filteredWorkspaces, setFilteredWorkspaces] = useState<Workspace[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newWorkspaceName, setNewWorkspaceName] = useState("")
  const [newWorkspaceDesc, setNewWorkspaceDesc] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [userName, setUserName] = useState("User")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      const userData = JSON.parse(user)
      setUserName(userData.name || "User")
    }

    fetchWorkspaces()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredWorkspaces(workspaces)
    } else {
      const filtered = workspaces.filter((w) =>
        w.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredWorkspaces(filtered)
    }
  }, [searchQuery, workspaces])

  const fetchWorkspaces = async () => {
    try {
      const response = await fetch("/api/workspaces?userId=1")
      const data = await response.json()
      if (data.success) {
        const formatted = data.workspaces.map((w: any) => ({
          ...w,
          modified: formatDate(w.modified),
        }))
        setWorkspaces(formatted)
        setFilteredWorkspaces(formatted)
      }
    } catch (error) {
      console.error("Failed to fetch workspaces:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "just now"
    if (diffInHours < 2) return "about 1 hour ago"
    if (diffInHours < 24) return `about ${diffInHours} hours ago`
    return `${Math.floor(diffInHours / 24)} days ago`
  }

  const handleCreateWorkspace = async () => {
    if (newWorkspaceName.trim()) {
      try {
        const response = await fetch("/api/workspaces", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: newWorkspaceName,
            description: newWorkspaceDesc,
            userId: "1",
          }),
        })

        const data = await response.json()
        if (data.success) {
          await fetchWorkspaces()
          setNewWorkspaceName("")
          setNewWorkspaceDesc("")
          setIsCreateModalOpen(false)
        }
      } catch (error) {
        console.error("Failed to create workspace:", error)
      }
    }
  }

  const handleDeleteWorkspace = async (id: string) => {
    try {
      const response = await fetch(`/api/workspaces?id=${id}`, {
        method: "DELETE",
      })

      const data = await response.json()
      if (data.success) {
        await fetchWorkspaces()
        setDeleteId(null)
      }
    } catch (error) {
      console.error("Failed to delete workspace:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-foreground animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/58fd43ef-3585-427a-8087-aea2cbb5d7ef/generated_images/minimalist-wolf-head-logo-icon-in-white--d843b5fe-20251003152443.jpg?"
                alt="Logo"
                fill
                className="object-contain dark:invert-0 invert"
              />
            </div>
            <h1 className="text-2xl font-light text-foreground">Declutter</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Home className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Settings className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/auth">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <LogOut className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-light text-foreground mb-2">Welcome to Declutter!</h2>
          <p className="text-muted-foreground">{userName}</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search workspaces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-card border-border text-foreground placeholder:text-muted-foreground h-12 rounded-full"
            />
          </div>
        </div>

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* New Chat Card */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center gap-4 hover:border-muted-foreground transition-colors min-h-[200px]"
          >
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <span className="text-xl text-foreground">New Chat</span>
          </motion.button>

          {/* Workspace Cards */}
          {filteredWorkspaces.map((workspace) => (
            <motion.div
              key={workspace.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="relative group"
            >
              <Link href={`/workspace/${workspace.id}`}>
                <div className="bg-card border border-border rounded-2xl p-6 hover:border-muted-foreground transition-all min-h-[200px] flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-medium text-foreground">{workspace.name}</h3>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        setDeleteId(workspace.id)
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-400"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>{workspace.pdfCount} PDFs</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ImageIcon className="w-4 h-4" />
                      <span>{workspace.imageCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mic className="w-4 h-4" />
                      <span>{workspace.audioCount}</span>
                    </div>
                  </div>

                  <div className="mt-auto text-xs text-muted-foreground">
                    Modified {workspace.modified}
                  </div>
                </div>
              </Link>

              {/* Delete Confirmation */}
              {deleteId === workspace.id && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-2xl flex items-center justify-center gap-3 z-10">
                  <Button
                    onClick={() => handleDeleteWorkspace(workspace.id)}
                    variant="destructive"
                    size="sm"
                  >
                    Delete workspace
                  </Button>
                  <Button
                    onClick={() => setDeleteId(null)}
                    variant="outline"
                    size="sm"
                    className="bg-transparent border-border text-foreground"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </main>

      {/* Create Workspace Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="text-2xl">Create New Workspace</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="workspace-name">Workspace Name</Label>
              <Input
                id="workspace-name"
                placeholder="My Research Project"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workspace-desc">Description (Optional)</Label>
              <Textarea
                id="workspace-desc"
                placeholder="A brief description..."
                value={newWorkspaceDesc}
                onChange={(e) => setNewWorkspaceDesc(e.target.value)}
                className="bg-background border-border text-foreground min-h-[100px]"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setIsCreateModalOpen(false)}
                variant="outline"
                className="flex-1 bg-transparent border-border text-foreground"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateWorkspace}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Create Workspace
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}