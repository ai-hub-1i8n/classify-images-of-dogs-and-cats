export function processImageToGrayscale(
  canvas: HTMLCanvasElement,
  size = 100
): number[][][] {
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  const imageData = ctx.getImageData(0, 0, size, size);

  const processedData: number[][][] = [];
  const row: number[][] = [];

  for (let p = 0; p < imageData.data.length; p += 4) {
    const red = imageData.data[p] / 255;
    const green = imageData.data[p + 1] / 255;
    const blue = imageData.data[p + 2] / 255;

    const gray = (red + green + blue) / 3;

    row.push([gray]);

    if (row.length === size) {
      processedData.push([...row]);
      row.length = 0;
    }
  }

  return processedData;
}
