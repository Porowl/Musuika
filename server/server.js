import {join, dirname} from 'path';
import http from 'http';
import express from 'express';
import {Server} from 'socket.io';
import { fileURLToPath } from 'url';
import GameManager from './gameManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicPath    = join(__dirname, '/../dist');
const devPath       = join(__dirname, '/../');
const port          = process.env.PORT || 3010;
let app             = express();
let server          = http.createServer(app);
const io            = new Server(server);
export default io;
let gMng     = new GameManager();



app.use(express.static(publicPath));
app.use(express.static(devPath));
server.listen(port, ()=> {
    console.log(`Server is up on port ${port}.`)
});

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'));
});

io.on("connection", (socket) => {
    console.log(socket.id,"connected."); // x8WIv7-mJelg7on_ALbx
    gMng.addGame(socket.id)
    
    socket.on("dataSent",data=>{
        // console.log("Data recieved from",socket.id)
        gMng.processData(socket.id, data);
    })
});



const dataCycle = () => {
    // console.log("data requested");
    io.sockets.emit("reqList");
}

setInterval(dataCycle,1000);