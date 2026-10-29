/** Resolve either a legacy local image reference or an absolute storage URL. */
export function getImageUrl(image?: string | null): string {
  if (!image) return "";

  const reference = image.trim();
  if (/^(https?:|data:|blob:)/i.test(reference)) return reference;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_IMG?.replace(/\/+$/, "");
  const relativePath = reference.replace(/^\/+/, "");
  return baseUrl ? `${baseUrl}/${relativePath}` : relativePath;
}
