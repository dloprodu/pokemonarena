import { RenderableToolbox } from './renderable-shape';
import { Rectangle } from './rectangle';

export class Picture extends Rectangle {
  readonly img = new Image();

  constructor(
    public url: string,
    public x: number,
    public y: number,
    public w: number,
    public h: number,
    toolbox: RenderableToolbox = {
      fill: '#8FBC8F'
    }
  ) {
    super(x, y, w, h, toolbox);
  }
  
  public load(): Promise<void> {
    return new Promise((resolve) => {
      this.img.onload = () => {
        resolve();
      };
      this.img.onerror = () => {
        resolve();
      };
      this.img.src = this.url;
    });
  }

  public draw(ctx: CanvasRenderingContext2D): Promise<void> {
    return new Promise((resolve) => {
      if (!this.url) {
        resolve();
        return;
      }
  
      ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
      resolve();
    });
  }
}