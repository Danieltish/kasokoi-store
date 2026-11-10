const ALLOWED_HOSTS = ["res.cloudinary.com", "images.unsplash.com"];

const SUPABASE_HOST_SUFFIX = ".supabase.co";

export function isAllowedImageUrl(value: string) {
  const url = value.trim();

  if (!url) {
    return false;
  }

  if (url.startsWith("/") && !url.startsWith("//")) {
    return true;
  }

  try {
    const parsed = new URL(url);

    if (parsed.protocol !== "https:") {
      return false;
    }

    return (
      ALLOWED_HOSTS.includes(parsed.hostname) ||
      parsed.hostname.endsWith(SUPABASE_HOST_SUFFIX)
    );
  } catch {
    return false;
  }
}
