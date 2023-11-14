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
    
    while(time/1000 > this.LastTime){

      const bodies = this.matter.intersectRay(0,50,300,50);
  
      if(bodies.length>0){
        this.scene.restart();
      }
  
      this.LastTime += 1;
      // this.CreateNewBall();
    }
  }

  CreateNewBall(x = 150, y = 100, s = 0){
    const newball = this.matter.add.image(x, y, 'ball');

    newball.setDataEnabled();
    if(s == 0) s = (Math.floor(Math.random()*3)+1);

    newball.data.set('scale',s);

    newball.setCircle(400);
    newball.setScale(0.02*s);
    newball.setMass(1*s);
    newball.setBounce(0.7);
    newball.setFriction(0.005);
    newball.setFrictionStatic(0.001);
    newball.setSleepEvents(true,true);

    newball.setOnCollide(pair =>{
      const bodyA = pair.bodyA.gameObject;
      const bodyB = pair.bodyB.gameObject;

      if(!bodyA||!bodyB){
        return;
      }

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
    return newball;
  }


  create() {
    //Replace this with matter container for future purpose
    this.matter.world.setBounds(0,0,300,600);
    
    //Intersection
    const line = new Phaser.Geom.Line(0,50,300,50);
    const graphics = this.add.graphics({lineStyle: {width:1, color: 0xffffff}});

    graphics.strokeLineShape(line);

    this.matter.world.on('sleepstart', (event, body)=>{
      event.source.gameObject.setAwake();
    });
    this.matter.enableCollisionEventsPlugin();
    this.input.on('pointerup', pointer =>
    {
      this.CreateNewBall(pointer.worldX,100,0);
    });



  }
}