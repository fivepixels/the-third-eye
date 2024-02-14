import { MajorHelpers } from "@src/core/types";
import Helper from "./helper";
import Logger from "../logger/logger";

type MoverMode = "NONE" | "MOVING" | "ZOOMING";
type Point = {
  x: number;
  y: number;
};

class Mover extends Helper {
  private currentMode: MoverMode;
  private currentX: number;
  private currentY: number;
  private currentScale: number;

  private firstPoint: Point;

  private indicator: HTMLCanvasElement;
  private pencil: CanvasRenderingContext2D;
  private isIndicatorOn: boolean;

  private isMouseDown: boolean;

  constructor(logger: Logger) {
    super(
      MajorHelpers.MOVER,
      "The helper mover is the main helper for partially blind people who cannot see a part of their vision. You can use this helper by pressing the command or control key on your keyboard and dragging it with the mouse pointer. If you do that, you will be able to see the whole screen moving, following along with your pointer.",
      logger
    );

    this.indicator = this.mainDOM.createElement("canvas");
    this.pencil = this.indicator.getContext("2d")!;
    this.isIndicatorOn = false;

    this.currentMode = "NONE";

    this.currentX = 0;
    this.currentY = 0;

    this.currentScale = 1;

    this.firstPoint = {
      x: 0,
      y: 0
    };

    this.isMouseDown = false;

    this.init();
  }

  private init() {
    this.initializeIndicator();

    /*
     * Shift + Pressed Pointer Moving - Zoom in and out
     * Alt + Pressed Pointer Moving - Moving the whole page
     */

    this.mainDOM.addEventListener("keyup", () => {
      this.currentMode = "NONE";
      this.removeIndicator();
    });

    this.mainDOM.addEventListener("keydown", keyEvent => {
      if (keyEvent.key === "Alt") {
        this.currentMode = "MOVING";
        this.attachIndicator();
        return;
      }

      if (keyEvent.key === "Shift") {
        this.currentMode = "ZOOMING";
        this.attachIndicator();
        return;
      }

      this.currentMode = "NONE";
    });

    this.mainDOM.addEventListener("mousemove", movingMouseEvent => {
      if (this.currentMode === "NONE" || !this.isMouseDown) return;

      if (this.currentMode === "MOVING") {
        this.moveMainDOM(movingMouseEvent.movementX, movingMouseEvent.movementY);
        return;
      }

      if (this.currentMode === "ZOOMING") {
        this.zoomMainDOM(movingMouseEvent.clientX, movingMouseEvent.clientY);
        return;
      }
    });

    this.mainDOM.addEventListener("mousedown", mouseDownEvent => {
      this.isMouseDown = true;

      if (this.currentMode === "MOVING") {
        this.mainDOM.body.style.border = "solid white 2px";
        return;
      }

      if (this.currentMode === "ZOOMING") {
        this.firstPoint = {
          x: mouseDownEvent.clientX,
          y: mouseDownEvent.clientY
        };

        return;
      }
    });

    this.mainDOM.addEventListener("mouseup", () => {
      this.isMouseDown = false;

      if (this.currentMode === "MOVING") {
        this.mainDOM.body.style.border = "none";

        return;
      }

      if (this.currentMode === "ZOOMING") {
        this.firstPoint = {
          x: 0,
          y: 0
        };

        return;
      }
    });
  }

  private initializeIndicator() {
    this.indicator.style.display = "absolute";
    this.indicator.style.position = "fixed";
    this.indicator.style.left = "0px";
    this.indicator.style.top = "0px";
    this.indicator.style.width = "100%";
    this.indicator.style.height = "100%";

    this.indicator.width = window.innerWidth * 2;
    this.indicator.height = window.innerHeight * 2;

    this.pencil.scale(2, 2);
  }

  private attachIndicator() {
    if (this.isIndicatorOn) return;

    this.mainDOM.body.appendChild(this.indicator);
    this.isIndicatorOn = true;
  }

  private removeIndicator() {
    this.indicator.remove();
    this.isIndicatorOn = false;
  }

  private moveMainDOM(deltaX: number, deltaY: number) {
    this.currentX += deltaX;
    this.currentY += deltaY;

    this.apply();
  }

  private zoomMainDOM(finalX: number, finalY: number) {
    const actualXDiff = this.firstPoint.x - finalX;
    const actualYDiff = this.firstPoint.y - finalY;

    const positiveXDifference = actualXDiff < 0 ? -actualXDiff : actualXDiff;
    const positiveYDifference = actualYDiff < 0 ? -actualYDiff : actualYDiff;

    const distance = Math.sqrt(positiveXDifference ** 2 + positiveYDifference ** 2) / 1000 + 1;

    this.currentScale = distance;

    this.apply();
  }

  private apply() {
    this.mainDOM.body.style.transform = `translate(${this.currentX}px, ${this.currentY}px) scale(${this.currentScale})`;
  }
}

export default Mover;
