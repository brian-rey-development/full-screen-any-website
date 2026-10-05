export async function togglePageFullscreen(): Promise<void> {
  if (document.fullscreenElement) return document.exitFullscreen();
  return document.documentElement.requestFullscreen();
}
