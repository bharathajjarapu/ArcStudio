"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Archive } from 'lucide-react'
import { ImageGrid } from "./imggrid"
import { ImageData } from "@/types/image"
import { getArchivedImagesFromLocalStorage } from "@/lib/storage"

export function ArchiveDialog() {
  const [open, setOpen] = useState(false)
  const [archivedImages, setArchivedImages] = useState<ImageData[]>([])

  useEffect(() => {
    if (open) {
      const images = getArchivedImagesFromLocalStorage()
      setArchivedImages(images)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Archive className="h-5 w-5 text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] sm:max-h-[80vh] bg-background border-zinc-800 overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-white">Archived Images</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[calc(80vh-80px)]">
          <ImageGrid images={archivedImages} containerClassName="p-4" isArchiveView={true} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

