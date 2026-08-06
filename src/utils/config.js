// Use Vite client environment variables.
// Vite exposes only variables prefixed with VITE_ to the browser.
export const API_URL = import.meta.env.VITE_API_URL || '';
export const API_URLS = import.meta.env.VITE_API_URLS || import.meta.env.VITE_API_URL || API_URL || '';
const rawImgUrls = import.meta.env.VITE_IMG_URLS || import.meta.env.IMG_URLS || '';
export const IMG_URLS = rawImgUrls.trim().replace(/\/+$/, '');
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';
const CLOUDINARY_UPLOAD_URL = CLOUDINARY_CLOUD_NAME
  ? `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`
  : '';

const normalizeUrl = (value) => value.trim().replace(/\/+$/, '');
const normalizePath = (value) => value.trim().replace(/^\/+/, '');

export const getImageUrl = (image) => {
  if (!image) return ''
  const trimmed = image.trim()
  if (/^(https?:|data:|blob:)/i.test(trimmed)) return trimmed

  const path = normalizePath(trimmed)
  const base = IMG_URLS || API_URL
  if (!base) return path

  if (path.startsWith('uploads/')) {
    return `${normalizeUrl(base)}/${path}`
  }

  if (path.includes('/')) {
    return `${normalizeUrl(base)}/${path}`
  }

  return `${normalizeUrl(base)}/uploads/${path}`
}

const isCloudinaryPlaceholder = (value) =>
  !value || /your_cloudinary|your_unsigned_upload_preset/i.test(value)

export const uploadImageToCloudinary = async (file) => {
  if (!CLOUDINARY_UPLOAD_URL || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error('Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env.')
  }

  if (isCloudinaryPlaceholder(CLOUDINARY_CLOUD_NAME) || isCloudinaryPlaceholder(CLOUDINARY_UPLOAD_PRESET)) {
    throw new Error('Cloudinary credentials are placeholder values. Update VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET with real Cloudinary settings.')
  }

  const payload = new FormData()
  payload.append('file', file)
  payload.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

  const response = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: 'POST',
    body: payload,
  })

  if (!response.ok) {
    const text = await response.text()
    let message = `Cloudinary upload failed (${response.status}): ${text}`
    if (response.status === 401 || /Unknown API key/i.test(text)) {
      message += ' Check CLOUDINARY_CLOUD_NAME and whether your upload preset is unsigned and valid.'
    }
    throw new Error(message)
  }

  const json = await response.json()
  const imageUrl = json.secure_url || json.url || ''
  if (!imageUrl) {
    throw new Error('Cloudinary upload succeeded but no image URL was returned.')
  }
  return imageUrl
}
