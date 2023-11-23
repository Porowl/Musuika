import Phaser, { GameObjects } from 'phaser';
// import { Socket } from 'socket.io';

const CENTER_Y = 200;
const CENTER_X = 400;
const WORLD_WIDTH = 500;
const WORLD_HEIGHT = 980 

export default class Demo extends Phaser.Scene {
  LastTime: number = 0;
  targetX: number = -1;
  mouseInput: boolean = false;
  currentBall!: Phaser.Physics.Matter.Image;
  // socket = io();

  constructor() {
    super('GameScene');
    this.LastTime = 0;
  }

  preload() {
    for(let i = 1; i<12;i++){
      this.load.image(`ball${i}`, `assets/ball${i}.png`);
    }
  }

  update(time:number, delta:number){
    
    if(time/1000 > this.LastTime){

      const bodies = this.matter.intersectRay(251,50,549,50);  
      if(bodies.length>0){
        this.scene.restart();
      }
      this.LastTime += 1;
    }
    const targetX = this.getTargetX();

    if(this.mouseInput&&this.currentBall.y==CENTER_Y){
      const pointer = this.input.activePointer;
      // const x = pointer.worldX-CENTER_X+WORLD_WIDTH/2;
      // if(x>0&&x<WORLD_WIDTH)
      //   this.currentBall.setX(pointer.worldX);
      const x = pointer.worldX-CENTER_X+WORLD_WIDTH/2;
      if(x>0 && x<WORLD_WIDTH && this.currentBall.y == CENTER_Y ){
        if(this.currentBall==null) return;
        this.setTargetX(pointer.worldX);
      }
    }

    if(targetX >= 0){
      const dir = (targetX-this.currentBall.x<0)?-1:1; 
      this.currentBall.setVelocity(dir*5,0);
      if(Math.abs(targetX-this.currentBall.x)<5){
        this.currentBall.setX(targetX);
        if(this.mouseInput) return;
        this.setTargetX(-1);
        this.currentBall.setVelocity(0);
        this.currentBall.setIgnoreGravity(false);
      }
    }
  }


  create() {
    //Replace this with matter container for future purpose

    this.matter.world.setBounds(150,0,WORLD_WIDTH,WORLD_HEIGHT);
    
    this.currentBall = this.CreateNewBall();
    //Intersection
    const line = new Phaser.Geom.Line(251,50,549,50);
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
      const x = pointer.worldX-CENTER_X+WORLD_WIDTH/2;
      if(x>0 && x<WORLD_WIDTH && this.currentBall.y == CENTER_Y ){
        if(this.currentBall==null) return;
        this.setTargetX(pointer.worldX);
      }
    });
    this.input.on('pointerdown', (pointer:any) =>
    {
      this.mouseInput = true;
    });
  }
  
  CreateNewBall(x = CENTER_X, y = CENTER_Y, s = 0): Phaser.Physics.Matter.Image{
    var zeroCheck = (s==0);
    if(zeroCheck){
      s = (Math.floor(Math.random()*3)+1);
    }
    
    const newball = this.matter.add.image(x, y, `ball${s}`);
    newball.setDataEnabled();

    newball.data.set('scale',s);
    
    newball.setCircle();
    newball.setScale(0.05*s);
    newball.setMass(1*s);
    newball.setBounce(0.5);
    newball.setFriction(0.001);
    newball.setFrictionStatic(0.001);
    newball.setSleepEvents(true,true);

    newball.setOnCollide((pair:any) =>{
      const bodyA = pair.bodyA.gameObject;
      const bodyB = pair.bodyB.gameObject;

      if(this.currentBall==bodyA||this.currentBall==bodyB){
        if(this.currentBall.y<=CENTER_Y) return;
        this.currentBall.setIgnoreGravity(false);
        this.targetX = -1;
        this.currentBall = this.CreateNewBall();
      }

      //failcheck... make it better TODO
      if(!(bodyA instanceof Phaser.Physics.Matter.Image && bodyB instanceof Phaser.Physics.Matter.Image)) return; 

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