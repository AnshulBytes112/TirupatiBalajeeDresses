/**
 * Validates whether a return URL is a safe internal relative path.
 * Prevents open-redirect attacks by rejecting external protocols, protocol-relative URLs,
 * and malicious payloads.
 */
export function getSafeReturnUrl(rawUrl?: string | null, fallback = "/account"): string {
  if (!rawUrl || typeof rawUrl !== "string") {
    return fallback;
  }

  const trimmed = rawUrl.trim();

  // Reject empty string or non-relative paths
  if (!trimmed.startsWith("/")) {
    return fallback;
  }

  // Reject protocol-relative URLs (e.g. "//evil.com")
  if (trimmed.startsWith("//")) {
    return fallback;
  }

  // Reject backslash tricks (e.g. "/\evil.com")
  if (trimmed.startsWith("/\\")) {
    return fallback;
  }

  // Reject URLs with embedded schemes (e.g. "/https://evil.com")
  if (trimmed.includes("://") || trimmed.includes("javascript:")) {
    return fallback;
  }

  return trimmed;
}
