const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

let b = document.getElementsByTagName('body')[0];
let btn = document.createElement('button');
btn.innerHTML = "Ready";
b.appendChild(btn);

//--------------------------------

const config = {
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

//----------------------

btn.onclick = async() =>{
    socket.emit('ready');
    rtcPeerConn = new RTCPeerConnection(config);
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
    /*
    dataChannel = rtcPeerConn.createDataChannel('gameInputs', dataChannelOptions);

    dataChannel.onopen = () => {
        console.log(this.label);
    }

    rtcPeerConn.ondatachannel = () => {
        console.log("data channel added")
    }*/
    dataChannel = rtcPeerConn.createDataChannel('gameInputs', dataChannelOptions);
    datachannelSetup(dataChannel);
    //creating the data channel on p1 side

    const offer = await rtcPeerConn.createOffer();
    await rtcPeerConn.setLocalDescription(offer);
    socket.emit("connectionOffer", offer);
})

socket.on('remote_offer', async (msg)=>{

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
    console.log(msg.ans.sdp)
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
}

function messageHandler(message){
    let data = message.data;
    console.log(data);
}