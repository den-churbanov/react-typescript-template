export const getRelativeCoordinates = (
  e: MouseEvent | { x: number, y: number },
  container: EventTarget | HTMLElement,
  xFrom: 'right' | 'left' = 'left'
) => {
  const rect = (container as HTMLElement).getBoundingClientRect();

  return {
    x: e.x - rect[xFrom],
    y: e.y - rect.top
  }
}