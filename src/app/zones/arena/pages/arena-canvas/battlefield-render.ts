import { Competitor } from '@app/shared/utils/competitor';

import { UIPicture } from './layout-models/ui-picture';
import { UIRectangle } from './layout-models/ui-rectangle';
import { UILabel } from './layout-models/ui-label';

/**
 * Renders the battlefield scenario.
 */
export class BattlefieldRender {
  //#region Fields

  // When it's true, the canvas will be updated
  private valid = false;
  protected ctx!: CanvasRenderingContext2D;

  protected background!: UIPicture;
  protected bounds!: UIRectangle;

  protected player!: UIPicture;
  protected playerDetail!: UILabel;

  protected opponent!: UIPicture;
  protected opponentDetails!: UILabel;

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

    this.canvas.onmousedown = this.handleMouseDown;
    this.canvas.onmouseup = this.handleMouseUp;
    this.canvas.onmousemove = this.handleMouseMove;
    this.canvas.onmouseleave = this.handleMouseLeave;

    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D ;
    this.WIDTH = this.canvas.width;
    this.HEIGHT = this.canvas.height;
  }

  //#endregion

  //#region Methods

  public async init(characters: { player: Competitor | null, opponent?: Competitor | null } | null = null) {
    if (!this.ctx) {
      throw new Error('Canvas context undefined');
    }

    this.valid = false;
    this.WIDTH = this.canvas.width;
    this.HEIGHT = this.canvas.height;

    this.bounds = new UIRectangle(
      0,
      0,
      this.WIDTH,
      this.HEIGHT,
      { fill: '#8FBC8F' }
    );

    this.background = new UIPicture('/assets/images/battlefield.png', 0, 0, 800, 480);

    if (characters?.player != null) {
      this.player = new UIPicture(characters.player.pokemon.sprites.back ?? '', 160, 300, 96, 96);
      this.playerDetail = new UILabel(
        characters.player.pokemon.name ?? '',
        `${characters.player.level} / ${characters.player.maxLevel}`,
        16, 426, 200, 36
      );
    }

    if (characters?.opponent != null) {
      this.opponent = new UIPicture(characters.opponent.pokemon.sprites.front ?? '', 500, 200, 96, 96);
      this.opponentDetails = new UILabel(
        characters.opponent.pokemon.name ?? '',
        `${characters.opponent.level} / ${characters.opponent.maxLevel}`,
        540, 160, 200, 36
      );
    }

    await this.background.load();

    if (characters?.player != null) {
      await this.player.load();
    }

    if (characters?.opponent != null) {
      await this.opponent.load();
    }

    window.requestAnimationFrame(() => this.draw());
  }

  public invalidatePlayerLevel(player: Competitor | null) {
    if (player == null || this.playerDetail == null) {
      return;
    }

    this.playerDetail.note = `${player.level} / ${player.maxLevel}`;
    this.valid = false;
    this.draw();
  }

  public invalidateOpponentLevel(opponent: Competitor | null) {
    if (opponent == null || this.opponentDetails == null) {
      return;
    }

    this.opponentDetails.note = `${opponent.level} / ${opponent.maxLevel}`;
    this.valid = false;
    this.draw();
  }

  public animatePlayer(doneFn?: () => void) {
    this.animate(this.player, 2, 28, 8, doneFn);
  }

  public animateOpponent(doneFn?: () => void) {
    this.animate(this.opponent, 2, 28, 8, doneFn);
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

    if (this.player != null) {
      await this.player.draw(this.ctx);
      this.playerDetail.draw(this.ctx);
    }

    if (this.opponent != null) {
      await this.opponent.draw(this.ctx);
      this.opponentDetails.draw(this.ctx);
    }

    // Add stuff you want drawn on top all the time here
    this.valid = true;

    if (callback) {
      callback();
    }
  }

  public animate(character: UIPicture, jumpsCount = 2, jumpHeight = 28, jumpDecrement = 8, doneFn?: () => void) {
    let dy = -3; // increment
    const source = character.y;

    character.offset(0, dy);

    const checkAnimation = () => {
      if (character.y === source) {
        if (jumpsCount > 1) {
          this.animate(character, jumpsCount - 1, jumpHeight - jumpDecrement, jumpDecrement, doneFn);
        }

        if (doneFn != null) {
          doneFn();
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

  protected handleMouseDown = () => {
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

  protected handleMouseUp = () => {
    // TODO
  }

  protected handleMouseMove = (e: MouseEvent) => {
    // TODO
  }

  protected handleMouseLeave = () => {
    // TODO
  }

  //#endregion
}
