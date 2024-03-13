import express from 'express';
import { createServer } from 'node:http';
import { join } from 'node:path';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'node:url';

const app = express();
const server = createServer(app);
const io = new Server(server)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname)

app.use(express.static(join(__dirname, 'public')));
app.use(express.static(join(__dirname, 'dist')));

app.get('/', (req, res)=> { //defines a route handler '/' that gets called for website home
    res.sendFile(join(__dirname, 'index.html'));
});

// `body` will contain the inbound request body.
app.route("/user")
    .get((req, res, next)=>{
        res.send("GET request called");
    }
)

io.on('connection', (socket)=>{
    console.log('a user connection');
    socket.on('disconnect', ()=>{
        console.log('user disconnected');
    });

    socket.on('ready', async ()=>{
        socket.join('game1');
        let sockets = await io.in('game1').fetchSockets()
        console.log(socket.rooms)
        if (sockets.length == 1){
            
        } 
        else if(sockets.length == 2){
            socket.to('game1').emit("player_join");
             
        }

    });

    socket.on('connectionOffer', (data)=>{
        console.log(`connection offer: ${JSON.stringify(data.sdp)}`)
        socket.to('game1').emit('remote_offer', {'offer':data});

    })

    socket.on('connectionAns', (data)=>{
        console.log(`connection ans: ${JSON.stringify(data.sdp)}`)
        socket.to('game1').emit('remote_ans', {'ans': data});
    })

    socket.on('newIceCandidate', (data)=>{
        //console.log(`new ice: ${JSON.stringify(data.candidate)}`);
        socket.to('game1').emit('remote_icecandidate', {'candidate':data.candidate});
    })

});

server.listen(80, ()=> {
    console.log('server running at http://localhost:80')}
    );
    
  // Global State


