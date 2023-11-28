import Phaser, { GameObjects } from 'phaser';
import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";
const socket = io.connect();

const CENTER_Y = 150;
const CENTER_X = 400;
const WORLD_WIDTH = 500;
const WORLD_HEIGHT = 980 

export default class Demo extends Phaser.Scene {  
  score: number = 0;
  scoreText!: Phaser.GameObjects.Text;
  LastTime: number = 0;
  targetX: number = -1;
  mouseInput: boolean = false;
  currentBall!: Phaser.Physics.Matter.Image;

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
    
    this.scoreText.setText([
      `Score: ${this.score}`
    ])

    if(time/1000 > this.LastTime){
      const bodies = this.matter.intersectRay(151,CENTER_Y+50,649,CENTER_Y+50);  
      if(bodies.length>1){
        this.scene.restart();
      }
      this.LastTime += 1;
    }
    const targetX = this.getTargetX();

    if(this.mouseInput&&this.currentBall.y==CENTER_Y){
      const pointer = this.input.activePointer;
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

    //Game Over Condition Visualizer
    const line = new Phaser.Geom.Line(151,CENTER_Y+50,650,CENTER_Y+50);
    const graphics = this.add.graphics({lineStyle: {width:1, color: 0xffffff}});

    graphics.strokeLineShape(line);

    //Always keep physics active
    this.matter.world.on('sleepstart', (event: any, body: any)=>{
      event.source.gameObject.setAwake();
    });

    this.matter.enableCollisionEventsPlugin();

    //Mouse Control
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

    //Server Controls
    type Point = {
      x:number,
      y:number,
      s:number
    };

    socket.on("reqList",()=>{
      
      let data: Point[] = [];
      const children = this.matter.world.getAllBodies();
      let i = 0;
      children.forEach(child=>{
        const obj = child.gameObject; 
        if(!(obj instanceof Phaser.Physics.Matter.Image))return;
        const entry: Point = {
          x: obj.x,
          y: obj.y,
          s: obj.data.get('scale')
        } 
        data.push(entry)
      })
      // console.log(data);
      socket.emit("dataSent",data);
      // console.log("dataSent");
    });

    //Data
    const text = this.add.text(350, 250, '', { font: '16px Courier', color: '#00ff00' });
    this.scoreText = text;
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

    //merge function
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

        const newScale = scaleA + 1;

        const temp = this.CreateNewBall(midX,midY,scaleA+1);


        const mod = newScale%SCORES.length;
        const mul = ~~(newScale/SCORES.length)+1; 

        this.addScore(SCORES[mod]*mul);

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

  addScore(score = 0){
    this.score += score;
  }
}


const SCORES = [
  24,
  27,
  30,
  32,
  36,
  40,
  45,
  48
]
