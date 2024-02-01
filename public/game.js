const canvas = document.getElementById("canvas");
canvas.tabIndex = 1000;

const pong = (function(cv){

    const canvas = cv;
    const ctx = canvas.getContext("2d");

    let width;
    let height;
    let lastRender = 0;
    let paddleSize = {l:400, w:10};
    let v = 20;
    
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
        ball: {x:0, y:0, radius:20, vx:20, vy:0}

      
    } 
    
    var resize = function() {
        width = window.innerWidth * 2;
        height = window.innerHeight * 2;
        canvas.width = width;
        canvas.height = height;
        console.log(width, height);
        
        state.p1 = {x:50, y:height/2-100, d:0};
        state.p2 = {x:width-50, y:(height/2)-100, d:0};
        state.ball.x = width/2;
        state.ball.y = height/2;

    }
    window.onresize = resize;
    resize();

    
    const draw = () =>{
        ctx.clearRect(0, 0, width, height);
        
        ctx.fillStyle = 'grey';
        ctx.font = '40px Arial';
        
        ctx.fillText(state.score[0]+' | '+state.score[1], (width)/2, (height)/2 );
        //console.log(state.p1.x, state.p1.y, paddleSize.l, paddleSize.w)

        ctx.fillStyle = "red";
    
        ctx.beginPath();
        ctx.arc(state.ball.x, state.ball.y, state.ball.radius, 0, 2* Math.PI);
        ctx.stroke();
        ctx.fill();

        ctx.fillStyle = 'green';
        ctx.fillRect(state.p1.x, state.p1.y, paddleSize.w, paddleSize.l);
        ctx.fillRect(state.p2.x, state.p2.y, paddleSize.w, paddleSize.l);
    }

    const checkCollision = (paddle) =>{
        let ball = state.ball;
        let closestX = Math.max( paddle.x, Math.min(ball.x, paddle.x + paddleSize.w));
        let closestY = Math.max( paddle.y, Math.min(ball.y, paddle.y + paddleSize.l));

        let distanceX = ball.x - closestX;
        let distanceY = ball.y - closestY;

        return Math.sqrt(distanceX**2 + distanceY**2) <= ball.radius;


    }

    const update = () =>{
        //console.log(state.ball.x > width);

        if (checkCollision(state.p1)){
            state.ball.vx = v;
            state.ball.vy = state.p1.d * Math.floor(Math.random() * 5);
        }
        else if(checkCollision(state.p2)){
            state.ball.vx = v*-1;
        }
        else if (state.ball.y < 0) state.ball.vy = Math.abs(state.ball.vy) ;
        else if (state.ball.y > 0) state.ball.vy = Math.abs(state.ball.vy) * -1;
        if (state.ball.x < 0 || state.ball.x > width) {
            console.log("Badaboop")
            state.ball.x = width/2;
            state.ball.y = height/2;
        }



        state.ball.x += state.ball.vx;
        state.ball.y += state.ball.vy;
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
       setState: (newState)=>{
            state = newState;
       },

       input: (x)=>{
        switch (x) {
            case 'P1U':
                state.p1.y += v;
                state.p1.d = -1;
                break;
            case 'P1D':
                state.p1.y -= v;
                state.p1.d = 1;
                break;
            case 'P2U':
                state.p2.y += v;
                state.p1.d = -1;
                break;
            case 'P2D':
                state.p2.y -= v;
                state.p1.d = 1;
                break;            
            default:
                break;
        }
       }

    };
})(canvas);
