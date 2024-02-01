const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

let b = document.getElementsByTagName('body')[0];
let btn = document.createElement('button');
btn.innerHTML = "Ready";
b.appendChild(btn);

//--------------------------------

const config = {    //config for the RTC connection
    iceServers: [
        {
            'urls': 'stun:stun.l.google.com:19302',
        },
    ]
};

let rtcPeerConn;
let dataChannel;

let dataChannelOptions = {
    ordered: false,
    maxPacketLifeTime: 1000,
};

let player;
//----------------------

btn.onclick = async() =>{
    socket.emit('ready');
    rtcPeerConn = new RTCPeerConnection(config);
    console.log(rtcPeerConn)
    rtcPeerConn.addEventListener('connectionstatechange', (event) => {
        if (rtcPeerConn.connectionState === 'connected') {
            console.log("Connected");

        }
        else{
            console.log("not connected")
        }
    });
    
}

socket.on('player_join', async (msg)=>{
    player = "P1";
    dataChannel = rtcPeerConn.createDataChannel('gameInputs', dataChannelOptions);
    datachannelSetup(dataChannel);
    //creating the data channel on p1 side

    const offer = await rtcPeerConn.createOffer();
    await rtcPeerConn.setLocalDescription(offer);
    socket.emit("connectionOffer", offer);
})

socket.on('remote_offer', async (msg)=>{
    player = "P2";
    
    rtcPeerConn.addEventListener('datachannel', (event)=>{
        console.log("Beepboop",event)
        dataChannel = event.channel;
        datachannelSetup(dataChannel);
    })

    rtcPeerConn.setRemoteDescription(new RTCSessionDescription(msg.offer));
    const answer = await rtcPeerConn.createAnswer();
    await rtcPeerConn.setLocalDescription(answer);

    rtcPeerConn.addEventListener('icecandidate', event => {
        if (event.candidate) {
            console.log("emitting p2")
            socket.emit('newIceCandidate', {'candidate': event.candidate});
        }
    });

    socket.emit('connectionAns', answer);
})

socket.on('remote_ans', async (msg)=>{

    const remoteDesc = new RTCSessionDescription(msg.ans);
    await rtcPeerConn.setRemoteDescription(remoteDesc);
    rtcPeerConn.addEventListener('icecandidate', event => {
        if (event.candidate) {
            console.log("emitting p1")
            socket.emit('newIceCandidate', {'candidate': event.candidate});
        }
    });
})

socket.on('remote_icecandidate', async (msg)=>{
    console.log(JSON.stringify(msg.candidate))
    if (msg.candidate) {
        try {
            console.log("received the ice")
            await rtcPeerConn.addIceCandidate(msg.candidate);
        } catch (e) {
            console.log('Error adding received ice candidate', e);
        }
    }

})


function datachannelSetup(event){
    console.log(event);
    dataChannel.addEventListener('open', ()=>{console.log("opened")});
    dataChannel.addEventListener('message', messageHandler);

    //setting up key event handlers only after datachannel setup
    if (player == 'P1'){
        canvas.addEventListener("keydown", keydownListener1);

    }
    else{
        canvas.addEventListener("keydown", keydownListener2)

    }
}

function messageHandler(message){
    let data = message.data;
    console.log(JSON.stringify(data));
    if (player == 'P1'){
        pong.input(data);
        dataChannel.send(JSON.stringify(pong.getState()));
    }
    else{
        pong.setState(JSON.parse(data));
    }

    console.log(data);
}

function keydownListener1(e){
    if (e.code == 'KeyD'){
        pong.input(player+"U");
    }
    else if (e.code == 'KeyA'){
        pong.input(player+"D");
    }
    else if (e.code == 'Escape'){
        console.log('hello')
        document.activeElement.blur();
        game.paused = true;
        console.log(document.activeElement)
    }
    dataChannel.send(JSON.stringify(pong.getState()));
}

function keydownListener2(e){
    if (e.code == 'KeyD'){
        dataChannel.send(player+"U");
    }
    else if (e.code == 'KeyA'){
        dataChannel.send(player+"D");
    }
    else if (e.code == 'Escape'){
        console.log('hello')
        document.activeElement.blur();
        game.paused = true;
        console.log(document.activeElement)
    }
}

//Notes
/**
 * Current management of game state is in a centralized fashion.
 * Player1 holds game state and sends it over to Player2 to update their game state.
 */