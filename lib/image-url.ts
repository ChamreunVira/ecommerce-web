const PRODUCT_IMAGE_PATH = "/images/products/";

/** Resolve stored filenames, legacy upload paths, and old S3 URLs to the API image endpoint. */
export function getImageUrl(image?: string | null): string {
  if (!image) return "";

  const reference = image.trim();
  if (!reference) return "";
  if (/^(data:|blob:)/i.test(reference)) return reference;

  const apiBaseUrl = (
    process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:8081/api/v1"
  ).replace(/\/+$/, "");
  const imageEndpoint = `${apiBaseUrl}${PRODUCT_IMAGE_PATH}`;

  if (/^https?:/i.test(reference)) {
    try {
      const url = new URL(reference);
      if (url.pathname.includes(PRODUCT_IMAGE_PATH)) return reference;
      if (
        url.hostname.endsWith(".amazonaws.com") ||
        url.pathname.includes("/uploads/")
      ) {
        const filename = url.pathname.split("/").filter(Boolean).at(-1);
        return filename ? `${imageEndpoint}${encodeURIComponent(filename)}` : "";
      }
      return reference;
    } catch {
      return "";
    }
  }

  const filename = reference.replace(/\\/g, "/").split("/").filter(Boolean).at(-1);
  return filename ? `${imageEndpoint}${encodeURIComponent(filename)}` : "";
}
