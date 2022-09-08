import * as PIXI from 'pixi.js';
import { SmoothGraphics as Graphics } from '@pixi/graphics-smooth';
import { W, H } from './config';
import { Container, Sprite } from 'pixi.js';

class ScoreBoard extends PIXI.Application {
    score: PIXI.Text;
    constructor() {
        super();
    }
    add(x:number,y:number) {
        const scoreBoard = new PIXI.Container();
        const bg = PIXI.Sprite.from(PIXI.Texture.WHITE);
        bg.width = 70;
        bg.height = 40;
        bg.tint = 0xff0045;

        this.score = new PIXI.Text("0x", { fontSize: 20 });
        this.score.anchor.set(.5);
        this.score.position.set(35,20)
        scoreBoard.addChild(bg, this.score);
        scoreBoard.position.set(x,y);
        return scoreBoard;
    }
    update(newScore: number) {
        this.score.text = newScore + "x";
    }

}

class Rocket extends PIXI.Application {
    private rocket: Sprite;
    constructor() {
        super();
    }
    add(x:number,y:number) {
        this.rocket = PIXI.Sprite.from("images/rocket.png");
        this.rocket.anchor.set(0, .5);
        this.rocket.width = 70;
        this.rocket.height = 34;
        this.rocket.rotation = -.46;
        this.rocket.position.set(x,y);
        return this.rocket;
    }
    update(x: number, y: number) {
        this.rocket.x = x + 2;
        this.rocket.y = H + y - 2;
    }
}


class Line extends PIXI.Application {
    private graphic = new Graphics();
    private lastX: number = 0;
    private lastY: number = 0;
    constructor() {
        super();
    }
    add(x:number,y:number) {
        this.graphic.lineStyle(3, 0xff0000);
        this.graphic.position.set(x,y);
        return this.graphic;
    }

    update(x: number, y: number) {
        this.graphic.moveTo(this.lastX, this.lastY);
        this.graphic.lineTo(x, y);
        this.lastX = x;
        this.lastY = y;
    }

}


export default class Game extends PIXI.Application {
    private Line: Line = new Line();
    private Rocket: Rocket = new Rocket();
    private scoreBoard:ScoreBoard = new ScoreBoard();
    private scale: number = 1
    constructor(scale) {
        super({
            view: <HTMLCanvasElement>document.querySelector('#canvas'),
            transparent: true,
            width: W * scale,
            height: H * scale
        });
        this.scale = scale;
        document.body.appendChild(this.view)
        this.stage.scale.set(this.scale);
        this.startGame();
    }
    private tickerStage(con: Container, x: number, y: number) {
        this.ticker.add(delta => {

            const difY = Math.floor(Math.random() * 2)
            x = x + 2;
            y = y - difY;

            this.Line.update(x, y);
            this.Rocket.update(x - 7, y + 5);
            this.scoreBoard.update(y*(-1)/100);
            if (x > W / 2) con.x -= 2;
            if (H + y < H / 2) con.y += difY
        })
    }
    private startGame() {
        let x = 0;
        let y = 0;

        const scoreBoard = this.scoreBoard.add(W/2,H/2-100);
        const line = this.Line.add(0,H);
        const rocket = this.Rocket.add(0,0);

        const con = new PIXI.Container();
        con.x = 0;
        con.y = 0;

        con.addChild(line, rocket);
        this.stage.addChild(con,scoreBoard);

        this.tickerStage(con, x, y);
    }
}

function calculateScale(w: number, h: number) {
    const sW = w / W;
    const sH = h / H;
    const s = sW > sH ? sH : sW;
    (window as any).context = new Game(s);
}
calculateScale(900, 520);