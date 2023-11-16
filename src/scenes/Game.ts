import Phaser, { GameObjects } from 'phaser';

export default class Demo extends Phaser.Scene {
  LastTime: number = 0;
  targetX: number = -1;
  mouseInput: boolean = false;
  currentBall: any = null;

  constructor() {
    super('GameScene');
    this.LastTime = 0;
  }

  preload() {
    this.load.image('ball', 'assets/ball.png');
  }

  update(time:number, delta:number){
    
    if(time/1000 > this.LastTime){

      const bodies = this.matter.intersectRay(0,50,300,50);
  
      if(bodies.length>0){
        this.scene.restart();
      }
  
      this.LastTime += 1;
    }
    const targetX = this.getTargetX();

    if(this.mouseInput){
      const pointer = this.input.activePointer;
      this.currentBall.setX(pointer.worldX);
    }

    if(targetX >= 0){
      const dir = (targetX-150<0)?-1:1; 
      this.currentBall.setVelocity(dir*3,0);
      if(Math.abs(targetX-this.currentBall.x)<3){
        this.setTargetX(-1);
        this.currentBall.setVelocity(0);
        this.currentBall.setIgnoreGravity(false);
      }
    }
  }


  create() {
    //Replace this with matter container for future purpose
    this.matter.world.setBounds(0,0,300,600);
    
    this.currentBall = this.CreateNewBall(150,100,0);
    //Intersection
    const line = new Phaser.Geom.Line(0,50,300,50);
    const graphics = this.add.graphics({lineStyle: {width:1, color: 0xffffff}});

    graphics.strokeLineShape(line);

    this.matter.world.on('sleepstart', (event: any, body: any)=>{
      event.source.gameObject.setAwake();
    });
    this.matter.enableCollisionEventsPlugin();
    this.input.on('pointerup', (pointer:any) =>
    {
      this.mouseInput = false;
      //TODO: Replace this to relative position
      if(pointer.worldX<300 && this.currentBall.y == 100 ){
        if(this.currentBall==null) return;
        this.setTargetX(pointer.worldX);
      }
    });
    this.input.on('pointerdown', (pointer:any) =>
    {
      this.mouseInput = true;
    });



  }
  
  CreateNewBall(x = 150, y = 100, s = 0){
    const newball = this.matter.add.image(x, y, 'ball');
    var zeroCheck = (s==0);
    newball.setDataEnabled();

    //for new balls
    if(zeroCheck){
      s = (Math.floor(Math.random()*3)+1);
    }

    newball.data.set('scale',s);
    
    newball.setCircle(400);
    newball.setScale(0.02*s);
    newball.setMass(1*s);
    newball.setBounce(0.7);
    newball.setFriction(0.005);
    newball.setFrictionStatic(0.001);
    newball.setSleepEvents(true,true);

    newball.setOnCollide((pair:any) =>{
      const bodyA = pair.bodyA.gameObject;
      const bodyB = pair.bodyB.gameObject;

      if(this.currentBall==bodyA||this.currentBall==bodyB){
        this.currentBall.setIgnoreGravity(false);
        this.targetX = -1;
        this.currentBall = this.CreateNewBall(150,100,0);
      }

      if(!bodyA||!bodyB){
        return;
      }

      const scaleA = bodyA.data.get('scale');
      const scaleB = bodyB.data.get('scale');

      if(scaleA==scaleB){

        const midX = (bodyA.x + bodyB.x)/2;
        const midY = (bodyA.y + bodyB.y)/2;

        const temp = this.CreateNewBall(midX,midY,scaleA+1);

        bodyA.destroy();
        bodyB.destroy();
      }
    });
    if(zeroCheck) newball.setIgnoreGravity(true);
    return newball;
  }

  setTargetX(x=150){
    this.targetX = x;
  }

  getTargetX(){
    return this.targetX;
  }
}