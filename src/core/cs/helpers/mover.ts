import { MajorHelpers } from "@src/core/types";
import Helper from "./helper";
import Logger from "../logger/logger";

type MoverMode = "NONE" | "MOVING" | "ZOOMING";

class Mover extends Helper {
  private currentMode: MoverMode;
  private currentX: number;
  private currentY: number;
  private currentScale: number;

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

    this.isMouseDown = false;

    this.init();
  }

  private init() {
    this.initializeIndicator();

    this.mainDOM.addEventListener("keyup", () => {
      this.currentMode = "NONE";
      this.removeIndicator();
    });

    this.mainDOM.addEventListener("keydown", keyEvent => {
      if (keyEvent.key === "Alt") {
        this.currentMode = "MOVING";
        this.attachIndicator();
        this.removeUnmoveability();

        return;
      }

      if (keyEvent.key === "Shift") {
        this.currentMode = "ZOOMING";
        this.attachIndicator();
        this.makeBodyUnmovable();

        return;
      }

      this.currentMode = "NONE";
      this.removeIndicator();
      this.removeUnmoveability();
    });

    this.mainDOM.addEventListener("wheel", wheelEvent => {
      if (this.currentMode === "ZOOMING") {
        this.zoomMainDOM(wheelEvent.deltaY);
        return;
      }
    });

    this.mainDOM.addEventListener("mousemove", movingMouseEvent => {
      if (this.currentMode === "NONE" || this.currentMode === "ZOOMING" || !this.isMouseDown)
        return;

      if (this.currentMode === "MOVING") {
        this.moveMainDOM(movingMouseEvent.movementX, movingMouseEvent.movementY);
        return;
      }
    });

    this.mainDOM.addEventListener("mousedown", () => {
      this.isMouseDown = true;

      if (this.currentMode === "MOVING") {
        this.mainDOM.body.style.border = "solid white 2px";
        return;
      }

      if (this.currentMode === "ZOOMING") {
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

  private makeBodyUnmovable() {
    this.mainDOM.body.style.overflow = "hidden";
  }

  private removeUnmoveability() {
    this.mainDOM.body.style.overflow = "scroll";
  }

  private attachIndicator() {
    if (this.isIndicatorOn) return;

    this.mainDOM.body.appendChild(this.indicator);
    this.isIndicatorOn = true;
    this.mainDOM.body.style.border = "solid white 2px";
  }

  private removeIndicator() {
    this.indicator.remove();
    this.isIndicatorOn = false;
    this.mainDOM.body.style.border = "none";
  }

  private moveMainDOM(deltaX: number, deltaY: number) {
    this.currentX += deltaX;
    this.currentY += deltaY;

    this.apply();
  }

  private zoomMainDOM(amount: number) {
    this.currentScale += amount / 3000;

    this.apply();
  }

  private apply() {
    this.mainDOM.body.style.transform = `translate(${this.currentX}px, ${this.currentY}px) scale(${this.currentScale})`;
  }
}

export default Mover;
