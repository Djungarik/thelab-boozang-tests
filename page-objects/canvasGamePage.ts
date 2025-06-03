import { Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class CanvasGamePage extends HelperBase {
  constructor(page: Page) {
    super(page);
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
}
