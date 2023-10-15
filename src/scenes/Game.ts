import Phaser, { GameObjects } from 'phaser';

export default class Demo extends Phaser.Scene {
  LastTime: number; 
  group;

  constructor() {
    super('GameScene');
    this.LastTime = 0;
  }

  preload() {
    this.load.image('ball', 'assets/ball.png');
  }

  update(time:number, delta:number){
    if(time/1000 > this.LastTime){
      this.LastTime += 1;
      const newball = this.matter.add.image(100, 240, 'ball');
      newball.setCircle(400);
      newball.setScale(Math.random()*0.1);
      newball.setBounce(0.7);
      this.group.push(newball);
    }
  }

  create() {
    this.group = [];

    this.matter.world.setBounds();

    const ball1 = this.matter.add.image(100, 240, 'ball');

    ball1.setScale(Math.random()*0.1);

    ball1.setVelocity(150);

    this.group.push(ball1);
  }
}