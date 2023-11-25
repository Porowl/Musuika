const path          = require('path');
const http          = require('http');
const express       = require('express');
const socketIO      = require('socket.io');

const publicPath    = path.join(__dirname, '/../dist');
const port          = process.env.PORT || 3010;
let app             = express();
let server          = http.createServer(app);
let io              = socketIO(server);

app.use(express.static(publicPath));
server.listen(port, ()=> {
    console.log(`Server is up on port ${port}.`)
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

io.on("connection", (socket) => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});