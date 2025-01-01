"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { getImageDataFromLocalStorage, getArchivedImagesFromLocalStorage } from "@/lib/storage"
import { ImageData } from "@/types/image"
import { useSearchParams } from "next/navigation"
import { ImageDialog } from "./imgdialog"
import { CreateDialog } from "./create"

interface ImageGridProps {
  images?: ImageData[]
  containerClassName?: string
  isArchiveView?: boolean
}

export function ImageGrid({ images: propImages, containerClassName = "container max-w-screen-2xl p-5", isArchiveView = false }: ImageGridProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const searchParams = useSearchParams()
  const searchTerm = searchParams.get("search")?.toLowerCase()

  const [images, setImages] = useState<ImageData[]>(propImages || [])

  useEffect(() => {
    if (!propImages) {
      const savedImages = isArchiveView
        ? getArchivedImagesFromLocalStorage()
        : getImageDataFromLocalStorage().filter(image => !image.parameters.private);
      setImages(savedImages);
    }

    const handleNewImage = (event: CustomEvent<ImageData>) => {
      const newImage = event.detail
      if (!newImage.parameters.private) {
        setImages(prevImages => [newImage, ...prevImages])
      }
    }

    document.addEventListener('new-image-created', handleNewImage as EventListener)

    return () => {
      document.removeEventListener('new-image-created', handleNewImage as EventListener)
    }
  }, [propImages, isArchiveView])

  const filteredImages = searchTerm
    ? images.filter(image => 
        image.prompt.toLowerCase().includes(searchTerm) ||
        image.username.toLowerCase().includes(searchTerm)
      )
    : images

  const handleImageClick = (image: ImageData) => {
    setSelectedImage(image)
    setDialogOpen(true)
  }

  const handleRemix = (prompt: string, parameters: ImageData['parameters']) => {
    setDialogOpen(false)
    document.dispatchEvent(new CustomEvent('remix-image', {
      detail: { prompt, parameters }
    }))
  }

  const handleImageAction = (action: 'delete' | 'archive' | 'public') => {
    setImages(prevImages => prevImages.filter(img => img.id !== selectedImage?.id));
    setDialogOpen(false);
  };

  return (
    <>
      <div className={containerClassName}>
        {filteredImages.length === 0 ? (
          <div className="text-center text-zinc-400 py-12">
            No images found. Start creating some!
          </div>
        ) : (
          <div className="columns-1 gap-4 sm:columns-2 xl:columns-4 2xl:columns-5">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="relative mb-4 break-inside-avoid cursor-pointer"
                onMouseEnter={() => setHoveredId(image.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => handleImageClick(image)}
              >
                <Image
                  src={image.imageUrl}
                  alt={image.prompt}
                  width={800}
                  height={600}
                  className="w-full rounded-lg"
                />
                {hoveredId === image.id && (
                  <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/60 to-transparent rounded-lg">
                    <p className="text-white font-medium">{image.username}</p>
                    <p className="text-white/80 text-sm">{image.prompt}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-zinc-800/80 text-white rounded-full text-xs">
                        {image.parameters.model}
                      </span>
                      {image.parameters.safe && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">
                          Safe
                        </span>
                      )}
                      {image.parameters.enhance && (
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                          Enhanced
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <ImageDialog
        image={selectedImage}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onRemix={handleRemix}
        isArchiveView={isArchiveView}
        onImageAction={handleImageAction}
      />
    </>
  )
}

