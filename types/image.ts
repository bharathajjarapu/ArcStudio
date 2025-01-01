export interface ImageParameters {
  width: number
  height: number
  seed?: number
  model: string
  nologo: boolean
  private: boolean
  enhance: boolean
  safe: boolean
}

export interface ImageData {
  id: number
  username: string
  imageUrl: string
  prompt: string
  parameters: ImageParameters
  createdAt: string
}
