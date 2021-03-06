import { UIRectangle } from './ui-rectangle';
import { UIToolbox } from './ui-shape';

export class UILabel extends UIRectangle {
  public radius = 12;

  constructor(
    public text: string,
    x: number,
    y: number,
    w: number,
    h: number,
    toolbox: UIToolbox = {
      stroke: '#556B2F',
      strokeWidth: 4,
      fill: '#FFFACD'
    }
  ) {
    super(x, y, w, h, toolbox);
  }

  public draw(ctx: CanvasRenderingContext2D): Promise<void> {
    return new Promise((resolve) => {
      if (this.w <= 0 || this.h <= 0) {
        resolve();
      }

      const radiusPoints = {
        tl: this.radius,
        tr: 0,
        br: this.radius,
        bl: 0
      };

      ctx.beginPath();
      ctx.moveTo(this.x + radiusPoints.tl, this.y);
      ctx.lineTo(this.x + this.w - radiusPoints.tr, this.y);
      ctx.quadraticCurveTo(this.x + this.w, this.y, this.x + this.w, this.y + radiusPoints.tr);
      ctx.lineTo(this.x + this.w, this.y + this.h - radiusPoints.br);
      ctx.quadraticCurveTo(this.x + this.w, this.y + this.h, this.x + this.w - radiusPoints.br, this.y + this.h);
      ctx.lineTo(this.x + radiusPoints.bl, this.y + this.h);
      ctx.quadraticCurveTo(this.x, this.y + this.h, this.x, this.y + this.h - radiusPoints.bl);
      ctx.lineTo(this.x, this.y + radiusPoints.tl);
      ctx.quadraticCurveTo(this.x, this.y, this.x + radiusPoints.tl, this.y);
      ctx.closePath();

      if (this.toolbox.fill != null) {
        ctx.fillStyle = this.toolbox.fill;
        ctx.fill();
      }

      if (this.toolbox.stroke != null && this.toolbox.strokeWidth != null) {
        ctx.strokeStyle = this.toolbox.stroke;
        ctx.lineWidth = this.toolbox.strokeWidth;
        ctx.stroke();
      }

      this.drawText(ctx);
    });
  }

  public drawText(ctx: CanvasRenderingContext2D): void {
    ctx.font = 'bold 16px Open Sans';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#000000';

    const caption = this.text?.length > 12
      ? `${this.text.substr(0, 9)}...`
      : this.text;

    ctx.fillText(caption?.toUpperCase(), this.x + 6, this.y + (this.h / 2) + ((this.toolbox?.strokeWidth ?? 0) / 2));

    ctx.textAlign = 'end';
    ctx.fillText('100 / 100', this.x + this.w - 6, this.y + (this.h / 2) + ((this.toolbox?.strokeWidth ?? 0) / 2));
  }
}
