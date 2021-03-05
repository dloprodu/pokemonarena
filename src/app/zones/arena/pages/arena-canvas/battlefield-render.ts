import { Picture } from './layout-models/picture';
import { Rectangle } from './layout-models/rectangle';
import { Label } from './layout-models/label';

/**
 * Renders the battlefield scenario.
 */
export class BattlefieldRender {
  //#region Fields

  // When it's true, the canvas will be updated
  private valid = false;
  protected ctx!: CanvasRenderingContext2D;

  protected background!: Picture;
  protected bounds!: Rectangle;

  protected player!: Picture;
  protected playerDetail!: Label;

  protected opponent!: Picture;
  protected opponentDetails!: Label;

  protected WIDTH: number;
  protected HEIGHT: number;

  //#endregion

  //#region Constructor

  constructor(
    protected canvas: HTMLCanvasElement,
  ) {
    if (!canvas) {
      throw new ReferenceError();
    }

    this.canvas.onmousedown = this.handle_mouseDown;
    this.canvas.onmouseup = this.handle_mouseUp;
    this.canvas.onmousemove = this.handle_mouseMove;
    this.canvas.onmouseleave = this.handle_mouseLeave;

    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D ;
    this.WIDTH = this.canvas.width;
    this.HEIGHT = this.canvas.height;
  }

  //#endregion

  //#region Methods

  public async init() {
    if (!this.ctx) {
      throw 'Canvas context undefined';
    }

    this.WIDTH = this.canvas.width;
    this.HEIGHT = this.canvas.height;

    this.bounds = new Rectangle(
      0,
      0,
      this.WIDTH,
      this.HEIGHT,
      { fill: '#8FBC8F' }
    );

    this.background = new Picture('/assets/images/battlefield.png', 0, 0, 800, 480);

    this.player = new Picture('/assets/images/pikachu_back.png', 160, 300, 96, 96);
    this.playerDetail = new Label('Pikachu', 16, 426, 200, 36);

    this.opponent = new Picture('/assets/images/ditto_front.png', 500, 200, 96, 96);
    this.opponentDetails = new Label('DITTO', 540, 160, 200, 36);

    await this.background.load();
    await this.player.load();
    await this.opponent.load();

    window.requestAnimationFrame(() => this.draw());
  }

  public animatePlayer() {
    this.animate(this.player);
  }

  public animateOpponent() {
    this.animate(this.opponent);
  }

  //#endregion

  //#region Helpers

  protected async draw(callback?: () => void) {
    if (this.valid || !this.ctx) {
      return;
    }

    this.ctx?.clearRect(0, 0, this.WIDTH, this.HEIGHT);

    this.bounds.draw(this.ctx);
    await this.background.draw(this.ctx);
    await this.player.draw(this.ctx);
    await this.opponent.draw(this.ctx);
    this.playerDetail.draw(this.ctx);
    this.opponentDetails.draw(this.ctx);

    // Add stuff you want drawn on top all the time here
    this.valid = true;

    if (callback) callback();
  }

  public animate(character: Picture, jumpsCount = 2, jumpHeight = 28, jumpDecrement = 8) {
    let dy = -3; // increment
    const source = character.y;

    character.offset(0, dy);

    const checkAnimation = () => {
      if (character.y === source) {
        if (jumpsCount > 1) {
          this.animate(character, jumpsCount - 1, jumpHeight - jumpDecrement);
        }
        return;
      }

      if (source - character.y >= jumpHeight) {
        dy *= -1;
      }

      character.offset(0, dy);
      
      this.valid = false;
      this.draw(() => window.requestAnimationFrame(checkAnimation));
    };

    window.requestAnimationFrame(checkAnimation);
  }

  //#endregion

  //#region Event Handlers

  protected handle_mouseDown = () => {
    switch (this.canvas.style.cursor) {
      case 'move':
      case 'nw-resize':
      case 'n-resize':
      case 'ne-resize':
      case 'e-resize':
      case 'se-resize':
      case 's-resize':
      case 'sw-resize':
      case 'w-resize':
        // TODO
        break;

      default:
        break;
    }
  }

  protected handle_mouseUp = () => {
    // TODO
  }

  protected handle_mouseMove = (e: MouseEvent) => {
    // TODO
  }

  protected handle_mouseLeave = () => {
    // TODO
  }

  //#endregion
}
