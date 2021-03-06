export class UIToolbox {
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
}

export abstract class UIShape {
  constructor(
    public toolbox: UIToolbox = {
      stroke: '#000000',
      strokeWidth: 1,
      fill: '#8FBC8F'
    }
  ) {
  }

  public abstract draw(ctx: CanvasRenderingContext2D): Promise<void>;
}
