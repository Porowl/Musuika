import Phaser, { GameObjects } from 'phaser';

export default class Demo extends Phaser.Scene {
  LastTime: number;

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
      this.CreateNewBall();
    }
  }

  CreateNewBall(x = 100, y = 240, s = 0){
    const newball = this.matter.add.image(x, y, 'ball');

    newball.setDataEnabled();
    if(s == 0) s = Math.floor(Math.random()*3)+1;

    newball.data.set('scale',s);

    newball.setCircle(400);
    newball.setScale(0.02*s);
    newball.setMass(1*s);
    newball.setBounce(0.5);
    newball.setFriction(0.001);
    newball.setFrictionStatic(0.001);

    newball.setOnCollide(pair =>{
      const bodyA = pair.bodyA.gameObject;
      const bodyB = pair.bodyB.gameObject;

      if(!bodyA||!bodyB) return;

      const scaleA = bodyA.data.get('scale');
      const scaleB = bodyB.data.get('scale');

      if(scaleA==scaleB){

        const midX = (bodyA.x + bodyB.x)/2;
        const midY = (bodyA.y + bodyB.y)/2;

        this.CreateNewBall(midX,midY,scaleA+1);

        bodyA.destroy();
        bodyB.destroy();
      }
    });
  }

  create() {
    this.matter.world.setBounds();
    this.matter.enableCollisionEventsPlugin();
  }
}