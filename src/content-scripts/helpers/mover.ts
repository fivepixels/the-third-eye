/**
 * Copyright 2024 Seol SO
 * SPDX-License-Identifier: MIT
 * Helper - Mover
 */

type MoverMode = "NONE" | "MOVING" | "ZOOMING";

class Mover {
  private currentMode: MoverMode;
  private currentX: number;
  private currentY: number;
  private currentScale: number;
  private isMouseDown: boolean;

  private indicator: HTMLCanvasElement;
  private pencil: CanvasRenderingContext2D;
  private isIndicatorOn: boolean;

  constructor() {
    this.currentMode = "NONE";
    this.currentX = 0;
    this.currentY = 0;
    this.currentScale = 1;
    this.isMouseDown = false;

    this.indicator = document.createElement("canvas");
    this.pencil = this.indicator.getContext("2d")!;
    this.isIndicatorOn = false;

    this.init();
  }

  onInitializing(): void {
    this.initializeIndicator();
  }

  private init() {
    document.addEventListener("keyup", () => {
      this.currentMode = "NONE";
      this.removeIndicator();
    });

    document.addEventListener("keydown", (keyEvent) => {
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

      if (keyEvent.key === "r") {
        this.currentMode = "NONE";
        this.removeIndicator();
        this.adjustMovability(false);

        this.currentX = 0;
        this.currentY = 0;
        this.currentScale = 1;

        this.apply();

        return;
      }

      this.currentMode = "NONE";
      this.removeIndicator();
      this.adjustMovability(false);
    });

    document.addEventListener("wheel", (wheelEvent) => {
      if (this.currentMode === "ZOOMING") {
        this.zoomMainDOM(wheelEvent.deltaY);
        return;
      }
    });

    document.addEventListener("mousemove", (movingMouseEvent) => {
      if (
        this.currentMode === "NONE" ||
        this.currentMode === "ZOOMING" ||
        !this.isMouseDown
      )
        return;

      if (this.currentMode === "MOVING") {
        this.moveMainDOM(
          movingMouseEvent.movementX,
          movingMouseEvent.movementY,
        );
        return;
      }
    });

    document.addEventListener("mousedown", () => {
      this.isMouseDown = true;

      if (this.currentMode === "MOVING") {
        document.body.style.border = "solid white 2px";
        return;
      }

      if (this.currentMode === "ZOOMING") {
        return;
      }
    });

    document.addEventListener("mouseup", () => {
      this.isMouseDown = false;

      if (this.currentMode === "MOVING") {
        document.body.style.border = "none";

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
    document.body.style.overflow = enable ? "hidden" : "scroll";
  }

  private attachIndicator() {
    if (this.isIndicatorOn) return;

    document.body.appendChild(this.indicator);
    this.isIndicatorOn = true;
    document.body.style.border = "solid white 2px";
  }

  private removeIndicator() {
    this.indicator.remove();
    this.isIndicatorOn = false;
    document.body.style.border = "none";
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
    document.body.style.transform = `translate(${this.currentX}px, ${this.currentY}px) scale(${this.currentScale})`;
  }
}

export default Mover;
