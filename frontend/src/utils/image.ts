const MB = 1024 * 1024

export const AVATAR_MAX_SIZE_BYTES = 25 * MB
export const AVATAR_ALLOWED_TYPES = new Set(['image/jpeg', 'image/png'])
const AVATAR_ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png'])

type AvatarOptimizationOptions = {
  maxDimension?: number
  jpegQuality?: number
}

export function validateAvatarFile(file: File): string | null {
  const normalizedType = file.type.toLowerCase()
  const extension = resolveExtension(file.name)

  const allowedType = AVATAR_ALLOWED_TYPES.has(normalizedType)
  const allowedExtension = AVATAR_ALLOWED_EXTENSIONS.has(extension)

  if (!allowedType && !allowedExtension) {
    return 'Please upload a JPG or PNG image.'
  }

  if (file.size > AVATAR_MAX_SIZE_BYTES) {
    return 'Image size exceeds 25MB. Please choose a smaller image.'
  }

  return null
}

export async function optimizeAvatarImage(
  file: File,
  options: AvatarOptimizationOptions = {},
): Promise<File> {
  const maxDimension = options.maxDimension ?? 1200
  const jpegQuality = options.jpegQuality ?? 0.84

  const imageElement = await loadImage(file)
  const scale = Math.min(1, maxDimension / Math.max(imageElement.width, imageElement.height))

  const targetWidth = Math.max(1, Math.round(imageElement.width * scale))
  const targetHeight = Math.max(1, Math.round(imageElement.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = targetWidth
  canvas.height = targetHeight

  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('Unable to process image in this browser.')
  }

  context.drawImage(imageElement, 0, 0, targetWidth, targetHeight)

  const outputType = file.type.toLowerCase() === 'image/png' ? 'image/png' : 'image/jpeg'
  const firstPassBlob = await canvasToBlob(canvas, outputType, jpegQuality)

  let optimizedBlob = firstPassBlob
  if (outputType === 'image/jpeg' && firstPassBlob.size > AVATAR_MAX_SIZE_BYTES) {
    optimizedBlob = await canvasToBlob(canvas, outputType, 0.72)
  }

  const optimizedFile = new File([optimizedBlob], buildOutputFileName(file.name, outputType), {
    type: outputType,
    lastModified: Date.now(),
  })

  if (optimizedFile.size > AVATAR_MAX_SIZE_BYTES) {
    throw new Error('Image is still larger than 25MB after optimization. Please use a smaller image.')
  }

  if (optimizedFile.size >= file.size && targetWidth === imageElement.width && targetHeight === imageElement.height) {
    return file
  }

  return optimizedFile
}

function buildOutputFileName(originalName: string, mimeType: string): string {
  const baseName = originalName.replace(/\.[^.]+$/, '') || 'avatar'
  const extension = mimeType === 'image/png' ? 'png' : 'jpg'
  return `${baseName}.${extension}`
}

function resolveExtension(fileName: string): string {
  const dotIndex = fileName.lastIndexOf('.')
  if (dotIndex < 0 || dotIndex === fileName.length - 1) {
    return ''
  }

  return fileName.slice(dotIndex + 1).toLowerCase()
}

async function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(image)
    }

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Unable to read selected image.'))
    }

    image.src = objectUrl
  })
}

async function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Image optimization failed.'))
          return
        }
        resolve(blob)
      },
      mimeType,
      quality,
    )
  })
}
