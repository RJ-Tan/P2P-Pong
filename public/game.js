const canvas = document.getElementById("canvas");
canvas.tabIndex = 1000;

const pong = (function(cv){

    const canvas = cv;
    const ctx = canvas.getContext("2d");

    let width;
    let height;
    let lastRender = 0;
    let paddleSize = {l:400, w:10};
    
    let paddle1 = {
        x: 50,
        y: (height /2 ) - 100,
        d: 0,
    }
    
    let paddle2 = {
        x: width - 50,
        y: (height / 2) - 100,
        d: 0,
    }
    let state = {
        score: [0,0],
        paused: false,
        //p1: {x:50, y:height/2-100, d:0},
        //p2: {x:width-50, y:(height/2)-100, d:0},
        p1: {x:0,y:0,d:0},
        p2: {x:0,y:0,d:0},

      
    } 
    
    var resize = function() {
        width = window.innerWidth * 2;
        height = window.innerHeight * 2;
        canvas.width = width;
        canvas.height = height;
        console.log(width, height);
        
        state.p1 = {x:50, y:height/2-100, d:0};
        state.p2 = {x:width-50, y:(height/2)-100, d:0};

    }
    window.onresize = resize;
    resize();

    
    const draw = () =>{
        ctx.clearRect(0, 0, width, height);
        
        ctx.fillStyle = 'grey';
        ctx.font = '40px Arial';
        
        ctx.fillText(state.score[0]+' | '+state.score[1], (width)/2, (height)/2 );
        console.log(state.p1.x, state.p1.y, paddleSize.l, paddleSize.w)
        ctx.fillStyle = 'green';
        ctx.fillRect(state.p1.x, state.p1.y, paddleSize.w, paddleSize.l);
        ctx.fillRect(state.p2.x, state.p2.y, paddleSize.w, paddleSize.l);
    }

    const update = () =>{

    }

    const loop = (timestamp) =>{
        var progress = (timestamp - lastRender);
        update(progress);
        draw();

        lastRender = timestamp;

        window.requestAnimationFrame(loop);
    }
    window.requestAnimationFrame(loop);

    return {
       getState: ()=>{
        return state;
       },

       input: (x)=>{
        switch (x) {
            case 'P1U':
                state.p1.y
                break;
            case 'P1D':

                break;
            case 'P2U':

                break;
            case 'P2D':

                break;            
            default:
                break;
        }
       }

    };
})(canvas);

function keydownListener(e){
    if (e.code == 'KeyD'){
        paddle1.moveY(20);
        paddle1.d = 1;
    }
    else if (e.code == 'KeyA'){
        paddle1.moveY(-20);
        paddle1.d = -1;
    }
    else if (e.code == 'Escape'){
        console.log('hello')
        document.activeElement.blur();
        game.paused = true;
        console.log(document.activeElement)
    }
}
canvas.addEventListener("keydown", keydownListener);