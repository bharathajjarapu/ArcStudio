import { ImageData } from "@/types/image"

const STORAGE_KEY = "pollinations-image-data"
const ARCHIVED_STORAGE_KEY = "pollinations-archived-image-data"

export function saveImageDataToLocalStorage(imageData: ImageData) {
  if (imageData.parameters.private) {
    saveArchivedImageDataToLocalStorage(imageData)
  } else {
    const existing = getImageDataFromLocalStorage()
    localStorage.setItem(STORAGE_KEY, JSON.stringify([imageData, ...existing]))
  }
}

export function getImageDataFromLocalStorage(): ImageData[] {
  if (typeof window === "undefined") return []
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved ? JSON.parse(saved) : []
}

export function saveArchivedImageDataToLocalStorage(imageData: ImageData) {
  const existing = getArchivedImagesFromLocalStorage()
  localStorage.setItem(ARCHIVED_STORAGE_KEY, JSON.stringify([imageData, ...existing]))
}

export function getArchivedImagesFromLocalStorage(): ImageData[] {
  if (typeof window === "undefined") return []
  const saved = localStorage.getItem(ARCHIVED_STORAGE_KEY)
  return saved ? JSON.parse(saved) : []
}

export function deleteImageFromLocalStorage(imageId: number, isArchived: boolean) {
  const storageKey = isArchived ? ARCHIVED_STORAGE_KEY : STORAGE_KEY;
  const images = isArchived ? getArchivedImagesFromLocalStorage() : getImageDataFromLocalStorage();
  const updatedImages = images.filter(image => image.id !== imageId);
  localStorage.setItem(storageKey, JSON.stringify(updatedImages));
}

export function archiveImage(imageData: ImageData) {
  const publicImages = getImageDataFromLocalStorage();
  const updatedPublicImages = publicImages.filter(image => image.id !== imageData.id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPublicImages));

  const archivedImages = getArchivedImagesFromLocalStorage();
  localStorage.setItem(ARCHIVED_STORAGE_KEY, JSON.stringify([imageData, ...archivedImages]));
}

export function makeImagePublic(imageData: ImageData) {
  const archivedImages = getArchivedImagesFromLocalStorage();
  const updatedArchivedImages = archivedImages.filter(image => image.id !== imageData.id);
  localStorage.setItem(ARCHIVED_STORAGE_KEY, JSON.stringify(updatedArchivedImages));

  const publicImages = getImageDataFromLocalStorage();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([imageData, ...publicImages]));
}

