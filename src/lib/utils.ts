const REDIRECT_ORIGIN = "http://localhost";

export function getSafeRedirect(value: string | undefined): string | null {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\")
  ) {
    return null;
  }

  const url = new URL(value, REDIRECT_ORIGIN);
  if (url.origin !== REDIRECT_ORIGIN) return null;

  return `${url.pathname}${url.search}${url.hash}`;
}
