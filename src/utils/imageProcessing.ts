// utils/imageProcessing.js
export function resampleCanvas(
  sourceCanvas: HTMLCanvasElement,
  targetWidth: number,
  targetHeight: number,
  targetCanvas: HTMLCanvasElement
) {
  const sourceCtx = sourceCanvas.getContext("2d") as CanvasRenderingContext2D;
  const targetCtx = targetCanvas.getContext("2d") as CanvasRenderingContext2D;

  targetCtx.drawImage(
    sourceCanvas,
    0,
    0,
    sourceCanvas.width,
    sourceCanvas.height,
    0,
    0,
    targetWidth,
    targetHeight
  );
}

export function processImageToGrayscale(canvas: HTMLCanvasElement, size = 100) {
  const ctx = canvas.getContext("2d");
  const imageData = ctx!.getImageData(0, 0, size, size)

  const processedData = [];
  const row = [];

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

  return [processedData];
}
