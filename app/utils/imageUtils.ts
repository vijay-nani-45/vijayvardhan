/**
 * Utility function to get image URL with fallback
 * @param imageUrl The primary image URL to use
 * @param fallbackUrl The fallback image URL to use if the primary fails
 * @param hasError Whether the primary image has failed to load
 * @returns The appropriate image URL to use
 */
export const getImageUrl = (imageUrl: string, fallbackUrl = "/placeholder.svg", hasError = false): string => {
  if (hasError || !imageUrl) {
    return fallbackUrl
  }
  return imageUrl
}

/**
 * Validates if a string is a valid URL
 * @param url The URL to validate
 * @returns Boolean indicating if the URL is valid
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch (e) {
    return false
  }
}
