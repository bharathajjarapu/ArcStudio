"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, Repeat, Archive, Trash, Globe } from 'lucide-react'
import Image from "next/image"
import { ImageData } from "@/types/image"
import { deleteImageFromLocalStorage, archiveImage, makeImagePublic } from "@/lib/storage"

interface ImageDialogProps {
  image: ImageData | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onRemix?: (prompt: string, parameters: ImageData['parameters']) => void
  isArchiveView?: boolean
  onImageAction: (action: 'delete' | 'archive' | 'public') => void
}

export function ImageDialog({ image, open, onOpenChange, onRemix, isArchiveView = false, onImageAction }: ImageDialogProps) {
  if (!image) return null

  const handleDownload = async () => {
    try {
      const response = await fetch(image.imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${image.prompt.slice(0, 30)}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Failed to download image:', error)
    }
  }

  const handleDelete = () => {
    deleteImageFromLocalStorage(image.id, isArchiveView)
    onImageAction('delete')
    onOpenChange(false)
  }

  const handleArchive = () => {
    archiveImage(image)
    onImageAction('archive')
    onOpenChange(false)
  }

  const handleMakePublic = () => {
    makeImagePublic(image)
    onImageAction('public')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] sm:max-h-[80vh] bg-background border-zinc-800 overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-white">Image Details</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative w-full h-full flex items-center justify-center bg-zinc-900 rounded-lg overflow-hidden">
            <Image
              src={image.imageUrl}
              alt={image.prompt}
              width={image.parameters.width}
              height={image.parameters.height}
              className="max-w-full max-h-[60vh] object-contain"
            />
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-medium">{image.username}</h3>
              <p className="text-zinc-400 text-sm mt-1">{image.prompt}</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-white font-medium">Parameters</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-zinc-400">Model</div>
                <div className="text-white">{image.parameters.model}</div>
                <div className="text-zinc-400">Size</div>
                <div className="text-white">{image.parameters.width}x{image.parameters.height}</div>
                <div className="text-zinc-400">Safe Mode</div>
                <div className="text-white">{image.parameters.safe ? 'On' : 'Off'}</div>
                <div className="text-zinc-400">Enhanced</div>
                <div className="text-white">{image.parameters.enhance ? 'Yes' : 'No'}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                className="flex-1"
                variant="secondary"
                onClick={() => onRemix?.(image.prompt, image.parameters)}
              >
                <Repeat className="w-4 h-4 mr-2" />
                Remix
              </Button>
              <Button
                className="flex-1"
                variant="secondary"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              {isArchiveView ? (
                <Button
                  className="flex-1"
                  variant="secondary"
                  onClick={handleMakePublic}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Make Public
                </Button>
              ) : (
                <Button
                  className="flex-1"
                  variant="secondary"
                  onClick={handleArchive}
                >
                  <Archive className="w-4 h-4 mr-2" />
                  Archive
                </Button>
              )}
              <Button
                className="flex-1"
                variant="destructive"
                onClick={handleDelete}
              >
                <Trash className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

