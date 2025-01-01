"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Download } from 'lucide-react'
import Image from "next/image"
import { saveImageDataToLocalStorage } from "@/lib/storage"
import { ImageParameters, ImageData } from "@/types/image"
import { MODELS } from "@/lib/constants"

export function CreateDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [generatedImage, setGeneratedImage] = useState<string>("")
  const [parameters, setParameters] = useState<ImageParameters>({
    width: 1024,
    height: 1024,
    safe: true,
    private: false,
    enhance: false,
    nologo: false,
    model: "flux"
  })
  const [settings, setSettings] = useState({ username: "" })

  useEffect(() => {
    const loadSettings = () => {
      const savedSettings = localStorage.getItem("user-settings")
      if (savedSettings) {
        const userSettings = JSON.parse(savedSettings)
        setParameters(prev => ({
          ...prev,
          model: userSettings.model,
          safe: userSettings.safe,
          private: userSettings.private,
          enhance: userSettings.enhance,
          nologo: userSettings.nologo,
        }))
        setSettings(userSettings)
      }
    }

    loadSettings()
    window.addEventListener('user-settings-updated', loadSettings)

    return () => {
      window.removeEventListener('user-settings-updated', loadSettings)
    }
  }, [])

  useEffect(() => {
    const handleRemix = (event: CustomEvent<{ prompt: string; parameters: ImageParameters }>) => {
      setPrompt(event.detail.prompt)
      setParameters(event.detail.parameters)
      setOpen(true)
    }

    document.addEventListener('remix-image', handleRemix as EventListener)
    return () => {
      document.removeEventListener('remix-image', handleRemix as EventListener)
    }
  }, [])

  const aspectRatios = {
    "16:9": { width: 1280, height: 720 },
    "1:1": { width: 1024, height: 1024 },
    "9:16": { width: 720, height: 1280 },
  }

  const truncatePrompt = (prompt: string, maxLength: number = 100) => {
    return prompt.length > maxLength ? prompt.substring(0, maxLength) + '...' : prompt
  }

  const handleDownload = async (imageUrl: string, promptText: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${promptText.slice(0, 30)}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Failed to download image:', error)
    }
  }

  const generateImage = async () => {
    if (!prompt) return

    setLoading(true)
    setGeneratedImage("")
    try {
      const fullPrompt = prompt
      const encodedPrompt = encodeURIComponent(fullPrompt)
      const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${parameters.width}&height=${parameters.height}&model=${parameters.model}&enhance=${parameters.enhance}&nologo=${parameters.nologo}&private=${parameters.private}&safe=${parameters.safe}`

      const response = await fetch(url)
      if (response.ok) {
        setGeneratedImage(url)

        const newImageData: ImageData = {
          id: Date.now(),
          imageUrl: url,
          username: settings.username || "@user",
          prompt,
          parameters,
          createdAt: new Date().toISOString(),
        }

        saveImageDataToLocalStorage(newImageData)
        
        document.dispatchEvent(new CustomEvent('new-image-created', { detail: newImageData }))
      } else {
        console.error('Failed to generate image')
      }
    } catch (error) {
      console.error("Failed to generate image:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
          Create
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] sm:max-h-[600px] bg-background border-zinc-800 overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-white">Create Image</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt" className="text-white">Prompt</Label>
              <Input
                id="prompt"
                placeholder="Describe what you want to see..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-400"
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Model</Label>
                <Select
                  value={parameters.model}
                  onValueChange={(value) => 
                    setParameters(prev => ({ ...prev, model: value }))
                  }
                >
                  <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    {MODELS.map(model => (
                      <SelectItem key={model} value={model} className="text-white">
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Aspect Ratio</Label>
                <Select
                  onValueChange={(value) => 
                    setParameters(prev => ({
                      ...prev,
                      ...aspectRatios[value as keyof typeof aspectRatios]
                    }))
                  }
                  defaultValue="1:1"
                >
                  <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
                    <SelectValue placeholder="Select aspect ratio" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    <SelectItem value="1:1" className="text-white">1:1</SelectItem>
                    <SelectItem value="16:9" className="text-white">16:9</SelectItem>
                    <SelectItem value="9:16" className="text-white">9:16</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="safe" className="text-white">Safe Mode</Label>
                <Switch
                  id="safe"
                  checked={parameters.safe}
                  onCheckedChange={(checked) =>
                    setParameters(prev => ({ ...prev, safe: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="private" className="text-white">Private</Label>
                <Switch
                  id="private"
                  checked={parameters.private}
                  onCheckedChange={(checked) =>
                    setParameters(prev => ({ ...prev, private: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="enhance" className="text-white">Enhance Prompt</Label>
                <Switch
                  id="enhance"
                  checked={parameters.enhance}
                  onCheckedChange={(checked) =>
                    setParameters(prev => ({ ...prev, enhance: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="nologo" className="text-white">No Logo</Label>
                <Switch
                  id="nologo"
                  checked={parameters.nologo}
                  onCheckedChange={(checked) =>
                    setParameters(prev => ({ ...prev, nologo: checked }))
                  }
                />
              </div>

              <Button 
                className="w-full bg-primary hover:bg-primary/90" 
                onClick={generateImage}
                disabled={!prompt || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate'
                )}
              </Button>
            </div>
          </div>

          <div className="relative bg-zinc-900 rounded-lg overflow-hidden">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : generatedImage ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={generatedImage}
                  alt={prompt}
                  width={parameters.width}
                  height={parameters.height}
                  className="max-w-full max-h-full object-contain"
                />
                <Button
                  className="absolute bottom-4 right-4 bg-primary/80 hover:bg-primary"
                  onClick={() => handleDownload(generatedImage, prompt)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
                Preview will appear here
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

