import { Page } from "@playwright/test";
import { Jimp, intToRGBA } from "jimp";

export class HelperBase {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  todaysDateWithCurrentTime() {
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    const currentTime = `${hours}${minutes}${seconds}`;

    const todaysDateAndTime = `${year}${month}${day}${currentTime}`;

    return todaysDateAndTime;
  }

  async findBall(
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
}
