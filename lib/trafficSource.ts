// lib/trafficSource.ts
// Traqueamento de origem de tráfego (?src=) do quiz V3.
// A origem é capturada na entrada do funil e anexada ao link de checkout da Payt.

const STORAGE_KEY = "trafficSourceV3";

export function captureTrafficSource(): void {
  if (typeof window === "undefined") return;
  const src = new URLSearchParams(window.location.search).get("src");
  if (src && src.trim() !== "") {
    localStorage.setItem(STORAGE_KEY, src.trim());
  }
}

export function getTrafficSource(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
}
