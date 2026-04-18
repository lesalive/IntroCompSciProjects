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
    x:400,  //x location
    y:225,  //y location
    w:50,   //shape width
    h:10,   //shape height
    color:0,
    alpha:0.25,
    rd:100,
    change : {x:20, y:20, w:0.5, h:20, color:40, alpha:0, rd:1}
}

var shape12 = {
    x: [2,1,1,2,4,6,8,9,9,8,6,4,2], //x-coordinates
    y: [2,4,6,8,9,9,8,6,4,2,1,1,2], //y-coordinates
    t: {x:10, y:10, s:10}   //transform properties
}

setUpCanvas();
let wallGradient=cx.createLinearGradient(0,0,800,450);
wallGradient.addColorStop(0, "hsla("+huevalue[colorname[randi(9)]]+", 50%, 30%, 1)");
wallGradient.addColorStop(1, "hsla("+huevalue[colorname[randi(9)]]+", 50%, 30%, 1)");
cx.fillStyle = wallGradient;
cx.beginPath();
cx.rect(0,0,w,h);
cx.fill();

splat(o1);
shapeCoord(shape12);

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
    cx.arc(obj.x, obj.y, obj.w, 0, 2*pi); //main splat
    cx.fillStyle = paintGradient;
    cx.fill();
    for (i=0;i<3;i++){
        cx.beginPath();
        cx.arc(obj.x+randn(obj.rd), obj.y+randn(obj.rd), obj.w*rand(0.7), 0, 2*pi); //small splat
        cx.arc(obj.x+2*randn(obj.rd), obj.y+2*randn(obj.rd), obj.w*rand(0.3), 0, 2*pi); //tiny splat
        cx.fill();
    } 
    console.log(o1);
    //change
    o1.x += o1.change.x; 
    o1.y += o1.change.y;
}

function shapeCoord(obj){
    cx.beginPath();
    cx.moveTo(obj.x[0]*obj.t.s + obj.t.x , obj.y[0]*obj.t.s + obj.t.y);
    for (i=0;i<obj.x.length;i++){
        cx.lineTo(obj.x[i]*obj.t.s + obj.t.x, obj.y[i]*obj.t.s + obj.t.y);
    }
    cx.stroke();
}
//ideas: add background colour. gradient fill, paint splats, disintegrating polygons, curves 