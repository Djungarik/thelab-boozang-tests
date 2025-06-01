import { Jimp, intToRGBA } from "jimp";

export async function findBall(
  path: string,
  targetColor: { r: number; g: number; b: number },
  tolerance = 20
): Promise<{ x: number; y: number } | null> {
  const image = await Jimp.read(path);
  const { width, height } = image.bitmap;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const { r, g, b } = intToRGBA(image.getPixelColor(x, y));
      const distance = Math.sqrt(
        (r - targetColor.r) ** 2 +
          (g - targetColor.g) ** 2 +
          (b - targetColor.b) ** 2
      );

      if (distance < tolerance) {
        return { x, y };
      }
    }
  }

  return null;
}
