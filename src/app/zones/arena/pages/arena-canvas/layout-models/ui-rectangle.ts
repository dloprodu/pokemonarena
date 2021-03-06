import { UIShape, UIToolbox } from './ui-shape';

export class UIRectangle extends UIShape {
  constructor(
    public x: number,
    public y: number,
    public w: number,
    public h: number,
    toolbox: UIToolbox = {
      fill: '#8FBC8F'
    }
  ) {
    super(toolbox);
  }

  public getLeft(): number {
    return this.x;
  }

  public getRight(): number {
    return this.x + this.w;
  }

  public getTop(): number {
    return this.y;
  }

  public getBottom(): number {
    return this.y + this.h;
  }

  public getCenterY(): number {
    return (this.getTop() + this.getBottom()) / 2;
  }

  public getCenterX(): number {
    return (this.getLeft() + this.getRight()) / 2;
  }

  public offset(x: number, y: number): void {
    if (!isNaN(x) && !isNaN(y)) {
      this.x += x;
      this.y += y;
    }
  }

  public toString(): string {
    return (
      '[' + this.x + ', ' + this.y + '] - ' + '(' + this.w + ', ' + this.h + ')'
    );
  }

  public inflate(w: number, h: number): void {
    this.x -= w;
    this.y -= h;
    this.w += 2 * w;
    this.h += 2 * h;
  }

  public getArea(): number {
    return this.w * this.h;
  }

  public getPerimeter(): number {
    return 2 * this.getArea();
  }

  public contains(x: number, y: number): boolean {
    if (x < this.x || y < this.y || x > this.x + this.w || y > this.y + this.h) {
      return false;
    }
    return true;
  }

  public draw(ctx: CanvasRenderingContext2D): Promise<void> {
    return new Promise((resolve) => {
      if (this.w <= 0 || this.h <= 0) {
        resolve();
      }

      if (this.toolbox.fill != null) {
        ctx.fillStyle = this.toolbox.fill;
        ctx.fillRect(this.x, this.y, this.w, this.h);
      }

      if (this.toolbox.stroke != null && this.toolbox.strokeWidth != null) {
        ctx.strokeStyle = this.toolbox.stroke;
        ctx.lineWidth = this.toolbox.strokeWidth;
        ctx.strokeRect(this.x, this.y, this.w, this.h);
      }

      resolve();
    });
  }
}
