import * as PIXI from 'pixi.js';

const app = new PIXI.Application({
    background: '#1099bb',
    resizeTo: window,
});

document.body.appendChild(app.view);

const ball = PIXI.Sprite.from('assets/ball1.png')

app.stage.addChild(ball);
ball.anchor.set(0.5);

ball.x = app.screen.width/2;
ball.y = app.screen.height/2;