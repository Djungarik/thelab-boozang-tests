import { Page } from "@playwright/test";
//import { Eyes } from "@applitools/eyes-playwright";
import { Jimp, intToRGBA } from "jimp";

export class CanvasGamePage {
  readonly page: Page;
  readonly eyes?: any;

  constructor(page: Page, eyes?: any) {
    this.page = page;
    this.eyes = eyes;
  }

  async moveBallToSpecificCoordinates(
    startX: number,
    startY: number,
    targetX: number,
    targetY: number
  ) {
    await this.page.mouse.move(startX, startY);
    await this.page.mouse.down();
    await this.page.mouse.move(targetX, targetY, {
      steps: 20,
    });
    await this.page.mouse.up();
  }

  async getBallCoordinates(
    screenShotPath: string,
    rgbColor: { r: number; g: number; b: number }
  ) {
    const ballCoordinates = await this.findBall(screenShotPath, rgbColor);
    return ballCoordinates;
  }

  async verifyCanvasPage() {
    if (!this.eyes) throw new Error("Eyes not initialized");

    await this.eyes.check({
      fully: true,
      matchLevel: "Layout",
    });

    await this.eyes.close();
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
