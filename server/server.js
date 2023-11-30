//Imports
import {join, dirname} from 'path';
import http from 'http';
import express from 'express';
import {Server} from 'socket.io';
import { fileURLToPath } from 'url';
import Websocket, {WebSocketServer} from 'ws';

//Custom Imports
import GameManager from './gameManager.js';

//Server Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicPath    = join(__dirname, '/../dist');
const port          = process.env.PORT || 3010;
let app             = express();
let server          = http.createServer(app);
let wss             = new WebSocketServer({server:server});
const io            = new Server({
    allowEIO3: true,
    cors: {origin: true}
});
io.attach(server);
export default io;

//Gamemanager Instance 
let gMng            = new GameManager();
let maxArr          = [];

app.use(express.static(publicPath));
app.use(express.static(__dirname+'../'));

server.listen(port, ()=> {
    console.log(`Server is up on port ${port}.`)
});

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'));
});

app.get('/viewer', (req, res) => {
    res.sendFile(join(__dirname, '../viewer.html'));
});

io.on("connection", (socket) => {
    console.log(socket.id,"connected."); // x8WIv7-mJelg7on_ALbx
    gMng.addGame(socket.id)
    
    socket.on("disconnect",()=>{
        console.log(socket.id,"disconnected");
        gMng.removeGame(socket.id);
    });

    socket.on("viewer",()=>{
        console.log(socket.id,"declared it is viewer. Adding viewer to the list")
        socket.join("viewer");
        gMng.removeGame(socket.id);
    });

    socket.on("dataSent",data=>{
        // console.log("Data recieved from",socket.id)
        gMng.processData(socket.id, data);
    });

    socket.on("merge",data=>{
        // console.log(socket.id,"merged",data);
        maxArr.forEach(ws=>{
            ws.send(JSON.stringify(data));
        });
    });
});

wss.on("connection",(ws,request)=>{
    const ip = request.socket.remoteAddress;
    
    console.log(`Max Client [${ip}]: connected`);

    if (ws.readyState === ws.OPEN) {
        console.log(`Max Client [${ip}]: connection established sucessfully`);
        maxArr.push(ws);
    }

    ws.on("message", (msg) => {
        console.log(`Max Client [${ip}]: ${msg}`);
    });

    ws.on("error", (error) => {
        console.log(`[ERROR]: ${error} [${ip}]`);
    });

    ws.on("close", () => {
        console.log(`Max Client [${ip}]: Disconnected`);
        const i = maxArr.indexOf(ws);
        maxArr.splice(i,1);
    });
});

const dataCycle = async () => {
    io.sockets.emit("reqList");
    let data = gMng.getData();
    // console.log(data, JSON.stringify(data))
    io.to("viewer").emit("viewerData",data);
}

setInterval(dataCycle,100);