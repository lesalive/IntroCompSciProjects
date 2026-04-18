var canvas;
var ctx;
var w = 800;
var h = 450;
var o_rect = {
    x: w/4,
    y: h/4,
    w:50,
    h:50,
    color:randi(360),
    alpha:0.75,
    angle: 45,
    rd:50,
    change : {x:5, y:0, w:0, h:0, color:0, alpha:0, rd:0}
}
//----- code
setUpCanvas();
rect(o_rect);
//animationLoop();

//----- functions
function animationLoop(){ // main animation
    clearCanvas(); // clears frame


    requestAnimationFrame(animationLoop);
}

function setUpCanvas(){ // sets up canvas
    canvas = document.getElementById("myCanvas");
    canvas.style.border = "2px solid #4089deff";
    canvas.width = w;
    canvas.height = h;
    ctx = canvas.getContext("2d");
    console.log("canvas setup");
}
function clearCanvas(){ // clears canvas
    ctx.clearRect(0,0,w,h);
}
function randn(range){ //random integer
    let result = Math.random()*range - range/2;
    return result;
}
function randi(range){ //random whole number
    let iresult = Math.floor(Math.random()*range);
    return iresult;
}
function rand(range){ //random float
    let iresult = Math.random()*range;
    return iresult;
}
function rect(o){ // draws rectangle shape
    var x=0, y=0;
    x = x -o.w/2;
    y = y -o.h/2;
    ctx.save(); //save canvas
    ctx.translate(o.x,o.y); //move canvas context to object x,y position
    ctx.rotate(o.angle*Math.PI/180); //rotate canvas by angle

    ctx.beginPath();
    ctx.moveTo(x+   randn(o.rd), y+randn(o.rd)); //point 1
    ctx.lineTo(x+o.w+randn(o.rd), y+randn(o.rd)); //line p1 to p2
    ctx.lineTo(x+o.w+randn(o.rd), y+o.h+randn(o.rd)); //line p2 to p3
    ctx.lineTo(x+   randn(o.rd), y+o.h+randn(o.rd)); //line p3 to p4
    ctx.closePath();                                //close shape, line p4 to p1
    ctx.strokeStyle = "hsla("+o.color+", 100%, 30%, 1)";
    ctx.fillStyle = "hsla("+o.color+", 100%, 50%,"+o.alpha+")";
    //cx.stroke();
    ctx.fill();

    ctx.restore(); //restore saved canvas
}