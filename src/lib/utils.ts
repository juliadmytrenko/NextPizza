export function isValidImageSrc(src: any) {
    if (!src || typeof src !== "string" || src.trim().length === 0)
      return false;
    return (
      src.startsWith("http://") ||
      src.startsWith("https://") ||
      src.startsWith("/")
    );
  }