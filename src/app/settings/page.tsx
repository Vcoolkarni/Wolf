"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Home, Settings as SettingsIcon, LogOut, User, Moon, Sun, Volume2, Save, Camera, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function SettingsPage() {
  const [autoRead, setAutoRead] = useState(true)
  const [voiceGender, setVoiceGender] = useState<"female" | "male">("female")
  const [fullName, setFullName] = useState("Gwen Stacy")
  const [email, setEmail] = useState("mygwenstacy08@gmail.com")
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchSettings()
    
    // Always apply dark theme
    document.documentElement.classList.add("dark")
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings?userId=1")
      const data = await response.json()
      if (data.success) {
        setFullName(data.settings.fullName)
        setEmail(data.settings.email)
        setAutoRead(data.settings.autoRead)
        setVoiceGender(data.settings.voiceGender)
        setProfilePicture(data.settings.profilePicture)
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePicture(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setSuccessMessage("")

    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "1",
          fullName,
          email,
          autoRead,
          voiceGender,
          profilePicture,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setSuccessMessage("Settings saved successfully!")
        setTimeout(() => setSuccessMessage(""), 3000)
      }
    } catch (error) {
      console.error("Failed to save settings:", error)
    } finally {
      setSaving(false)
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
                className="object-contain"
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
              <Button variant="ghost" size="icon" className="text-foreground">
                <SettingsIcon className="w-5 h-5" />
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
      <main className="container max-w-3xl mx-auto px-6 py-12">
        <h2 className="text-4xl font-light text-foreground mb-12">Settings</h2>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400">
            {successMessage}
          </div>
        )}

        <div className="space-y-8">
          {/* Profile Information */}
          <div className="bg-card border border-border rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-foreground" />
              <h3 className="text-2xl font-medium text-foreground">Profile Information</h3>
            </div>

            {/* Avatar */}
            <div className="mb-8">
              <div className="relative w-24 h-24 mx-auto mb-4">
                {profilePicture ? (
                  <Image
                    src={profilePicture}
                    alt="Profile"
                    fill
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
                    <User className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors"
                >
                  <Camera className="w-4 h-4 text-primary-foreground" />
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-2 mb-4">
              <Label htmlFor="fullName" className="text-foreground">
                Full Name
              </Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-background border-border text-foreground"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background border-border text-foreground"
                disabled
              />
            </div>
          </div>

          {/* Voice Settings */}
          <div className="bg-card border border-border rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Volume2 className="w-6 h-6 text-foreground" />
              <h3 className="text-2xl font-medium text-foreground">Voice Settings</h3>
            </div>

            {/* Voice Gender */}
            <div className="mb-6">
              <Label className="text-foreground mb-3 block">Voice Gender</Label>
              <div className="flex gap-3">
                <button
                  onClick={() => setVoiceGender("female")}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                    voiceGender === "female"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  Female
                </button>
                <button
                  onClick={() => setVoiceGender("male")}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                    voiceGender === "male"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  Male
                </button>
              </div>
            </div>

            {/* Auto-read Responses */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground font-medium mb-1">Auto-read Responses</p>
                <p className="text-sm text-muted-foreground">Automatically read AI responses aloud</p>
              </div>
              <Switch checked={autoRead} onCheckedChange={setAutoRead} />
            </div>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-base font-medium gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save All Changes
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  )
}