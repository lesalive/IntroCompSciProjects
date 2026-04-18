var canvas;
var cx;
var w = 800;
var h = 450;
var x = 400, y = 225;
var colorname = ["red","orange","yellow","green","cyan","blue","indigo","violet","pink"];
var huevalue = {
    red:0,
    orange:40,
    yellow:80,
    green:120,
    cyan:160,
    blue:200,
    indigo:240,
    violet:280,
    pink:320
}
var o1 = {
    x:0,
    y:10,
    w:10,
    h:10,
    color:0,
    alpha:0.25,
    rd:0,
    change : {x:12, y:12, w:0.5, h:20, color:40, alpha:0, rd:1}
}
setUpCanvas();
splat(o1);

function setUpCanvas(){
    canvas = document.getElementById("myCanvas");
    canvas.style.border = "2px solid #4089deff";
    canvas.width = w;
    canvas.height = h;
    cx = canvas.getContext("2d");
    console.log("canvas setup");
}
function randi(range){ //random pos integer
    let iresult = Math.floor(Math.random()*range);
    return iresult;
}
function rand(range){ //random pos decimal
    let result = Math.random()*range;
    return result;
}
function randn(range){ //random neg & pos number
    let result = Math.random()*range - range/2;
    return result;
}
function rect(obj){ //lined rectangle Shape
    obj.x = obj.x - obj.w/2;
    obj.y = obj.y - obj.h/2;
    cx.beginPath();
    cx.moveTo(obj.x+   randn(obj.rd), obj.y+randn(obj.rd));
    cx.lineTo(obj.x+obj.w+randn(obj.rd), obj.y+randn(obj.rd));
    cx.lineTo(obj.x+obj.w+randn(obj.rd), obj.y+obj.h+randn(obj.rd));
    cx.lineTo(obj.x+   randn(obj.rd), obj.y+obj.h+randn(obj.rd));
    cx.closePath();
    cx.strokeStyle = "hsla("+obj.color+", 100%, 30%, 1)";
    cx.fillStyle = "hsla("+obj.color+", 100%, 50%,"+obj.alpha+")";
    cx.stroke();
    cx.fill();
    obj.x = obj.x + obj.w/2;
    obj.y = obj.y + obj.h/2;
}
function splat(obj){
    const pi=Math.PI;
    const paintGradient=cx.createLinearGradient(0,0,800,450);
    paintGradient.addColorStop(0, "blue");
    paintGradient.addColorStop(0.5, "purple");
    paintGradient.addColorStop(1, "pink");
    cx.beginPath();
    cx.arc(obj.x+randn(obj.rd), obj.y+randn(obj.rd), obj.w, 0, 2*pi);
    cx.fillStyle = paintGradient;
    cx.fill();
}

//ideas: add background colour. gradient fill, paint splats, disintegrating polygons, curves 