import { Helpers } from "@src/shapes/user";
import Helper from "./helper";

type MoverMode = "NONE" | "MOVING" | "ZOOMING";

class Mover extends Helper {
  private currentMode: MoverMode;
  private currentX: number;
  private currentY: number;
  private currentScale: number;
  private isMouseDown: boolean;

  private indicator: HTMLCanvasElement;
  private pencil: CanvasRenderingContext2D;
  private isIndicatorOn: boolean;

  constructor() {
    super(Helpers.MOVER);

    this.currentMode = "NONE";
    this.currentX = 0;
    this.currentY = 0;
    this.currentScale = 1;
    this.isMouseDown = false;

    this.indicator = this.mainDOM.createElement("canvas");
    this.pencil = this.indicator.getContext("2d")!;
    this.isIndicatorOn = false;

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
        this.adjustMovability(false);

        return;
      }

      if (keyEvent.key === "Shift") {
        this.currentMode = "ZOOMING";
        this.attachIndicator();
        this.adjustMovability(true);

        return;
      }

      this.currentMode = "NONE";
      this.removeIndicator();
      this.adjustMovability(false);
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

  private adjustMovability(enable: boolean) {
    this.mainDOM.body.style.overflow = enable ? "hidden" : "scroll";
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
