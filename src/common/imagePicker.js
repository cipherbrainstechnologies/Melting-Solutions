/**
 * Normalizes expo-image-picker results across SDK versions (legacy `cancelled` + `uri` vs `canceled` + `assets`).
 */
export function getImagePickerUri(result) {
  if (!result) return null;
  if (result.canceled || result.cancelled) return null;
  if (result.assets && result.assets.length > 0) {
    return result.assets[0].uri || null;
  }
  return result.uri || null;
}
