"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Lock, FolderOpen, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-10">
        <h1 className="text-2xl font-light text-foreground">Declutter</h1>
        <div className="flex items-center gap-4">
          <Link href="/auth">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              Sign In
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-4xl mx-auto"
      >
        {/* Wolf Logo - Larger, no border */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-12"
        >
          <div className="relative w-40 h-40 mx-auto">
            <Image
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/58fd43ef-3585-427a-8087-aea2cbb5d7ef/generated_images/minimalist-wolf-head-logo-icon-in-white--d843b5fe-20251003152443.jpg?"
              alt="Declutter Wolf Logo"
              fill
              className="object-contain dark:invert-0 invert"
              priority
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-7xl md:text-8xl font-light text-foreground mb-6 tracking-tight"
        >
          Declutter
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-xl md:text-2xl text-muted-foreground mb-12 font-light"
        >
          Your Private, Offline AI
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Link href="/auth">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 rounded-full gap-2 group"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="bg-card/30 backdrop-blur-sm border border-border rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Lock className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-foreground font-medium mb-2">Private & Secure</h3>
            <p className="text-muted-foreground text-sm">Your data stays on your device. No cloud storage, no tracking.</p>
          </div>

          <div className="bg-card/30 backdrop-blur-sm border border-border rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <FolderOpen className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-foreground font-medium mb-2">Multi-Format Support</h3>
            <p className="text-muted-foreground text-sm">Upload PDFs, images, audio files, or paste URLs to analyze.</p>
          </div>

          <div className="bg-card/30 backdrop-blur-sm border border-border rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Sparkles className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-foreground font-medium mb-2">AI-Powered Insights</h3>
            <p className="text-muted-foreground text-sm">Query your content with natural language and get instant answers.</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}