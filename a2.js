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
var  shape = {
    5 : {
        x:[0,  4.5, 2.5,-2.5,-4.5], //x-coords
        y:[4.5,1.5,  -4,  -4, 1.5], //y-coords
        t: {x:0, y:0, s:5, rd:5, c:40}, //transformations
        color: 0,
        alpha: 0.25,
        change: {x:50, y:40}
    },
    12 : {
        x: [2,1,1,2,4,6,8,9,9,8,6,4],
        y: [2,4,6,8,9,9,8,6,4,2,1,1],
        t: {x:10, y:10, s:40, rd:5},
    },

}
var splat1 = {
    x:700,  //x location
    y:100,  //y location
    w:10,   //shape width
    h:10,   //shape height
    rd:100, //random
    change : {x:-100, y:75, w:10, h:20, rd:1}
}

setUpCanvas();
let wallGradient=cx.createLinearGradient(0,0,800,450); //bg gradient colour
wallGradient.addColorStop(0, "hsla("+huevalue[colorname[randi(9)]]+", 50%, 30%, 1)");
wallGradient.addColorStop(1, "hsla("+huevalue[colorname[randi(9)]]+", 50%, 30%, 1)");
cx.fillStyle = wallGradient;
cx.beginPath();
cx.rect(0,0,w,h);
cx.fill();


shapeArray(shape[5]); //polygon array

for (let i=0; i<5; i++){
    shapeWeb(shape[12]); //web shape
}
for (let i=0;i<5;i++){ //ink splats
    splat(splat1);
    console.log(i);    
}

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
function splat(obj){
    const pi=Math.PI;
    const paintGradient=cx.createLinearGradient(0,0,800,450);
    paintGradient.addColorStop(0, "blue");
    paintGradient.addColorStop(0.5, "purple");
    paintGradient.addColorStop(1, "pink");
    cx.beginPath();
    cx.arc(obj.x, obj.y, obj.w+randn(obj.w), 0, 2*pi); //main splat
    cx.fillStyle = paintGradient;
    cx.fill();
    for (let i=0;i<3;i++){
        cx.beginPath();
        cx.arc(obj.x+randn(obj.rd), obj.y+randn(obj.rd), obj.w*rand(0.7), 0, 2*pi); //small splat
        cx.arc(obj.x+2*randn(obj.rd), obj.y+2*randn(obj.rd), obj.w*rand(0.3), 0, 2*pi); //tiny splat
        cx.fill();
    } 

    obj.x += obj.change.x + randn(w); 
    obj.y += obj.change.y + randn(h);
    obj.w += obj.change.w;
}
function shapeCoord(obj){
    cx.beginPath();
    cx.moveTo(obj.x[0]*obj.t.s + obj.t.x , obj.y[0]*obj.t.s + obj.t.y);
    for (let i=0;i<obj.x.length;i++){
        cx.lineTo(obj.x[i]*obj.t.s +obj.t.x +randn(obj.t.rd), obj.y[i]*obj.t.s +obj.t.y +randn(obj.t.rd));
    }
    cx.closePath();
    cx.strokeStyle = "hsla("+obj.color+", 100%, 30%, 1)";
    cx.fillStyle = "hsla("+obj.color+", 100%, 50%,"+obj.alpha+")";
    cx.stroke();
    cx.fill();
}
function shapeWeb(obj){
    obj.t.x = 50+ randi(500);
    obj.t.y = 50+ rand(200);
    obj.t.s = randi(75);
    cx.beginPath();
    for (let i=0;i<obj.x.length;i++){
        for (let h=0;h<obj.x.length;h++){
            cx.moveTo(obj.x[i]*obj.t.s + obj.t.x , obj.y[i]*obj.t.s + obj.t.y);
            cx.lineTo(obj.x[h]*obj.t.s + obj.t.x, obj.y[h]*obj.t.s + obj.t.y);
            // console.log(i,h)  
        }
    }
    cx.strokeStyle = "hsla("+huevalue[colorname[randi(9)]]+", 50%, 90%, 1)";;
    cx.stroke();
}
function shapeArray(obj){
    obj.color= randi(360);
for (let i=0; i<2000; i++){
    shapeCoord(obj)
    obj.t.x += obj.change.x; //moves rect horizontally on the row
    obj.t.y += randn(10); //adds random vertical shift creating wavy rows
    if (obj.t.x > w+10) { //if row reaches end, next row
        obj.t.x = 0;
        obj.t.y += obj.change.y;
        obj.color += obj.t.c;
        obj.alpha += 0.05;
        obj.t.s --;
    } else if (obj.t.y > h+10){ // if rows fill canvas
        console.log("number of squares ",i);
        break
    }
}
}
//ideas: add background colour. gradient fill, paint splats, disintegrating polygons, curves 