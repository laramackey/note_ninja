import { Vec2 } from './vec2.js';
import { CONSUMEABLE_ONE, CONSUMEABLE_TWO, GROUND, OBSTACLE, SPACE } from './constants.js';
import { SpriteLoader } from './sprite.js';
import LevelGen from "./levelGen.js";
import { Audio } from "./audio.js"

const WIDTH = 1200;
const HEIGHT = 675;
const TILE_SIZE = 25;
const VIEWPORT_LENGTH_IN_TILES = WIDTH / TILE_SIZE;
const VIEWPORT_HEIGHT_IN_TILES = HEIGHT / TILE_SIZE;

const animationSettings = {
  speed: 15,
  frameSize: new Vec2(50, 100),
};

class Ninja {
  constructor(levelGen) {
    const initialX = WIDTH / 3 - TILE_SIZE / 2;
    const initialY = (HEIGHT / 2) - TILE_SIZE / 2;

    this.position = new Vec2(initialX, initialY);
    this.velocity = new Vec2(0, 0);
    this.gravity = new Vec2(0, 5);
    this.jumpHeight = 4;
    this.isDead = false;

    this.jumpOnNextUpdate = false;
    this.loadAnimations();

    this.levelGen = levelGen;
    this.points = 0;
    this.level = 0;

    this.audio = new Audio();
    this.triggeredGameOver = false;
  }

  loadAnimations() {
    this.animateRun = new SpriteLoader({
      ...animationSettings,
      speed: 3,
      totalFrames: 2,
      xOffSet: 25,
      yOffset: 75
    });
    this.animateRun.load('note-ninja2.png');
  }

  queueJump = () => {
    this.jumpOnNextUpdate = true;
    this.audio.triggerPlayerJump();
  };

  vectorToGrid = (vector) => {
    return ([Math.floor(vector.x / TILE_SIZE), Math.ceil(vector.y / TILE_SIZE)]);
  }

  update(dt, gridStartingXIndex) {
    if (this.jumpOnNextUpdate) {
      if (this.velocity.y == 0) {
        this.velocity.add(new Vec2(0, -1 * this.jumpHeight));
      }
      this.jumpOnNextUpdate = false;
    }

    this.velocity.add(new Vec2(0, this.gravity.y * dt));
    const newPos = new Vec2(this.position.x, this.position.y + this.velocity.y)

    if (!this.isCollided(newPos, gridStartingXIndex)) {
      this.position = newPos;
    } else {
      this.velocity = new Vec2(0, 0);
    }
  }

  triggerDeath = () => {
    this.isDead = true;
    this.audio.stopAudio();
    if (!this.triggeredGameOver) {
      this.audio.gameOverOneshot.play();
      this.triggeredGameOver = true;
    }
  }

  isCollided(newPos, gridStartingXIndex) {
    const grid = this.levelGen.getActiveScope();

    const [gridPosX, gridPosY] = this.vectorToGrid(newPos);

    if (gridPosY < grid.length && gridPosY > 0) {
      const gridValue = grid[gridPosY][gridPosX];
      const upperGridValue = grid[gridPosY - 1][gridPosX];
      if (gridValue === OBSTACLE || upperGridValue === OBSTACLE) {
        this.triggerDeath()
      }
      if ([CONSUMEABLE_ONE, CONSUMEABLE_TWO].includes(gridValue) || [CONSUMEABLE_ONE, CONSUMEABLE_TWO].includes(upperGridValue)) {
        this.points += 10;
        this.audio.playScore();
        document.getElementById('score').innerHTML = this.points.toString().padStart(5, "0");
        grid[gridPosY - 1][gridPosX] = 0;
        grid[gridPosY - 2][gridPosX] = 0;
      }
      return (gridValue === GROUND);
    }
    else if (gridPosY == grid.length) {
      this.triggerDeath();
    }
    else {
      return false;
    }
  }

  draw(ctx) {
    // ctx.fillStyle = '#333';
    // ctx.fillRect(this.position.x, this.position.y, TILE_SIZE, TILE_SIZE);
    this.animateRun.draw(ctx, this.position);
  }
}

class Game {
  constructor(canvas, scale) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.scale(scale, scale);
    this.moveSpeed = 9;
    this.moveGridCountdown = 9;
    this.changeLevelSpeed = 250;
    this.changeLevelCountdown = 250;
    this.currentLevel = 1;
    this.gridStartingXIndex = 0;
    this.shownModal = false;

    this.levelGen = new LevelGen(VIEWPORT_LENGTH_IN_TILES, VIEWPORT_HEIGHT_IN_TILES);
    this.ninja = new Ninja(this.levelGen);
    this.loadAnimations();

    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case "ArrowUp":
          this.ninja.queueJump();
          break;
        case " ":
          this.ninja.queueJump();
          break;
        default:
          break;
      }

      this.ninja.audio.startLoops();
    });
  }

  loadAnimations() {

    const collectableAnimationSettings = {
      speed: 1,
      frameSize: new Vec2(25, 25),
      totalFrames: 100,
    };
    this.animateGreenPad = new SpriteLoader({
      ...collectableAnimationSettings,
    });
    this.animateGreenPad.load('green-pad.png');
    this.animatePinkPad = new SpriteLoader({
      ...collectableAnimationSettings,
    });
    this.animatePinkPad.load('pink-pad.png');
  }

  gameOver = () => {
    const modal = document.getElementById('gameOverModal');
    modal.style.display = 'block';
    this.shownModal = true;
  };

  update = (dt) => {
    this.ninja.update(dt);

    if (this.ninja.isDead) {
      this.gameOver();
    } else {
      if (this.moveGridCountdown === 0) {
        this.levelGen.updateScope();
        this.moveGridCountdown = this.moveSpeed;
      } else {
        this.moveGridCountdown -= 1;
      }
      if (this.changeLevelCountdown === 0) {
        this.changeLevelCountdown = this.changeLevelSpeed
        this.moveSpeed -=1
        this.currentLevel += 1;
        document.getElementById('level').innerHTML = this.currentLevel.toString().padStart(5, "0");
      } else {
        this.changeLevelCountdown -= 1;
      }
    }
  };

  gridToVector = (x, y) => {
    return new Vec2(x * TILE_SIZE, y * TILE_SIZE);
  }

  drawGrid = () => {
    this.ctx.clearRect(0, 0, 1200, 1200);
    const grid = this.levelGen.getActiveScope();
    for (let row = 0; row < grid.length; row++) {
      for (let column = 0; column < VIEWPORT_LENGTH_IN_TILES; column++) {
        const gridVector = this.gridToVector(column, row)

        switch (grid[row][column]) {
          case GROUND:
            this.ctx.fillStyle = '#78AD2C';
            this.ctx.fillRect(gridVector.x, gridVector.y, TILE_SIZE, TILE_SIZE);
            break;
          case OBSTACLE:
            const image = new Image(TILE_SIZE, TILE_SIZE * 2)
            image.src = './Hydrantv3.png'
            this.ctx.drawImage(image, gridVector.x, gridVector.y - TILE_SIZE, TILE_SIZE, TILE_SIZE * 2);
            break;
          case CONSUMEABLE_ONE:
            this.animateGreenPad.draw(this.ctx, gridVector);
            break;
          case CONSUMEABLE_TWO:
            this.animatePinkPad.draw(this.ctx, gridVector);
            break;
        }

      }
    }
  }

  render = () => {
    this.drawGrid();
    this.ninja.draw(this.ctx);
  };

  loop = (last = -1) => {
    const now = Date.now();

    let dt = (now - last) / 1000;

    last = now;

    if (dt > 0.15) {
      dt = 0.15;
    }

    this.update(dt);
    this.render(this.canvas);

    requestAnimationFrame(() => this.loop(last));
  };

  init = () => {
    requestAnimationFrame(this.loop);
  };
}

const scale = window.devicePixelRatio;
const canvas = document.getElementsByTagName('canvas')[0];
canvas.width = Math.floor(WIDTH * scale);
canvas.height = Math.floor(HEIGHT * scale);

const game = new Game(canvas, scale);
game.init();
