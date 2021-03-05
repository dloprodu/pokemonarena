import { RenderableShape, RenderableToolbox } from './renderable-shape';

export class Picture extends RenderableShape {
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
    super(toolbox);
  }

  
  public draw(ctx: CanvasRenderingContext2D): Promise<void> {
    return new Promise((resolve) => {
      if (!this.url) {
        resolve();
        return;
      }
  
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, this.x, this.y, this.w, this.h);
        resolve();
      };
      img.onerror = () => {
        resolve();
      };
      img.src = this.url;
    });
  }
}