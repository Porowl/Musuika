//Imports
import {join, dirname} from 'path';
import http from 'http';
import express from 'express';
import {Server} from 'socket.io';
import { fileURLToPath } from 'url';

//Custom Imports
import GameManager from './gameManager.js';

//Server Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicPath    = join(__dirname, '/../dist');
const port          = process.env.PORT || 3010;
let app             = express();
let server          = http.createServer(app);
const io            = new Server({
    allowEIO3: true,
    cors: {
        origin: true,
        methods: ["GET","POST"]
    },
});
io.attach(server);
export default io;

//Gamemanager Instance 
let gMng            = new GameManager();

app.use(express.static(publicPath));

server.listen(port, ()=> {
    console.log(`Server is up on port ${port}.`)
});

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'));
});

io.on("connection", (socket) => {
    console.log(socket.id,"connected."); // x8WIv7-mJelg7on_ALbx
    gMng.addGame(socket.id)
    
    socket.on("disconnect",()=>{
        console.log(socket.id,"disconnected");
        gMng.removeGame(socket.id);
    });

    socket.on("IAmMax",()=>{
        console.log(socket.id,"declared it is max. Adding max to the list")
        socket.join("max");
    });

    socket.on("dataSent",data=>{
        // console.log("Data recieved from",socket.id)
        gMng.processData(socket.id, data);
    });

    socket.on("merge",data=>{
       io.to("max").emit("merge",data); 
    });
});

const dataCycle = () => {
    // console.log("data requested");
    io.sockets.emit("reqList");
}

setInterval(dataCycle,1000);