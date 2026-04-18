var canvas;
var ctx;
var w = 800;
var h = 450;
var state = {
    mousedown: false
}
var allShapes = []
var flr = {
    x: w/2,
    y: 50, //height
    size: 10,
    color: 0,
}
//-----
document.onkeydown = keydown;
// document.getElementById("myCanvas").onmousedown = mousedown;
// document.getElementById("myCanvas").onmouseup = mouseup;
document.getElementById("myCanvas").onmousemove = mousemove;

setUpCanvas();
animationLoop();

//-----functions
function animationLoop(){
    clearCanvas();
    // for(var i=0; i<allShapes.length; i++){
    //     rect(allShapes[i]);
    //     updateProperties(allShapes[i]);
    //     toriod(allShapes[i]);
    // }
    flower(flr);
    requestAnimationFrame(animationLoop);
}
function mousedown(){ //when mouse is pressed
    state.mousedown = true;
}
function mouseup(){ //when mouse is not pressed
    state.mousedown = false;
}
function keydown(event){ //if _ keys are pressed
    if(event.key == "ArrowUp"){
        for(var i=0; i<allShapes.length; i++){
            allShapes[i].change.y -= 1;
            console.log("up")
        }
    } else
    if(event.key == "ArrowDown"){
        for(var i=0; i<allShapes.length; i++){
            allShapes[i].change.y += 1;
            console.log("down")
        }
    } else
    if(event.key == "ArrowLeft"){
        for(var i=0; i<allShapes.length; i++){
            allShapes[i].change.x -= 1;
            console.log("left")
        }
    } else
    if(event.key == "ArrowRight"){
        for(var i=0; i<allShapes.length; i++){
            allShapes[i].change.x += 1;
            console.log("right")
        }
    }
}
function click(event){//when mouse is clicked
    createData(1, allShapes);
}
function mousemove(event){ //when the cursor moves on the canvas
    if (event.offsetY > 400){ //when cursor is at y 400-450...
        flr.color = 360*event.offsetX/w;
    }
    if(state.mousedown){ //if pressed down while on canvas
        createDataCursor(1, allShapes, event);
    }
}
function createDataCursor(num, array, e){//creates new object at location of cursor
    for (var i=0; i<num; i++){
        array.push({
            x: e.offsetX,
            y: e.offsetY,
            w: 10,
            h: 10,
            color: 260,
            alpha: 0.75,
            rd: 0,
            change: {x:0, y:0, w:0, h:0, color:0, alpha:0, rd:0}
        })
    }
}
//canvas functions
function setUpCanvas(){
    canvas = document.getElementById("myCanvas");
    canvas.style.border = "2px solid #4089deff";
    canvas.width = w;
    canvas.height = h;
    ctx = canvas.getContext("2d");
    console.log("canvas setup");
}
function clearCanvas(){
    ctx.clearRect(0,0,w,h);
}
// random functions
function randn(range){
    let result = Math.random()*range - range/2;
    return result;
}
function randi(range){
    let iresult = Math.floor(Math.random()*range);
    return iresult;
}
function rand(range){
    let iresult = Math.random()*range;
    return iresult;
}
// shapes
function flower(o){
    let y = h-o.y;

    ctx.beginPath();    //---stem
    ctx.moveTo(o.x, h);
    ctx.lineTo(o.x, y);
    ctx.strokeStyle = "green";
    ctx.stroke();

    ctx.beginPath();    //---petals
    ctx.arc(o.x, y, o.size, 0, 2*Math.PI);
    ctx.fillStyle = "hsla("+o.color+", 95%, 65%, 1)";
    ctx.fill();
    
    ctx.beginPath();    //---center
    ctx.arc(o.x, y, o.size/3, 0, 2*Math.PI);
    ctx.fillStyle = "brown";
    ctx.fill();

}
function rect(obj){
    obj.x = obj.x - obj.w/2;
    obj.y = obj.y - obj.h/2;
    ctx.beginPath();
    ctx.moveTo(obj.x+   randn(obj.rd), obj.y+randn(obj.rd));
    ctx.lineTo(obj.x+obj.w+randn(obj.rd), obj.y+randn(obj.rd));
    ctx.lineTo(obj.x+obj.w+randn(obj.rd), obj.y+obj.h+randn(obj.rd));
    ctx.lineTo(obj.x+   randn(obj.rd), obj.y+obj.h+randn(obj.rd));
    ctx.closePath();
    ctx.strokeStyle = "hsla("+obj.color+", 100%, 30%, 1)";
    ctx.fillStyle = "hsla("+obj.color+", 100%, 50%,"+obj.alpha+")";
    //cx.stroke();
    ctx.fill();
    obj.x = obj.x + obj.w/2;
    obj.y = obj.y + obj.h/2;
}
function circle(o, sides){
    var oneDegree = Math.PI/180;
    var angle = 0;
    var cx = o.r*Math.cos(angle*oneDegree);
    var cy = o.r*Math.sin(angle*oneDegree);

    ctx.beginPath();
    ctx.moveTo(o.x+cx+randn(o.rd), o.y+cy+randn(o.rd));
    for(var i=0; i<sides; i++){
        angle += 360/sides;
        cx = o.r*Math.cos(angle*oneDegree);
        cy = o.r*Math.sin(angle*oneDegree);
        ctx.lineTo(o.x+cx+randn(o.rd), o.y+cy+randn(o.rd));
    }
    ctx.fillStyle = "hsla("+o.color+", 100%, 50%,"+o.alpha+")";
    ctx.fill();
}
function createData(num, array){//pushes new objects to array
    for (var i=0; i<num; i++){
        array.push({
            x: w/2,
            y: h/2,
            w: 50,
            h: 50,
            color: 260,
            alpha: 0.75,
            rd: 0,
            change: {x:0, y:0, w:0, h:0, color:0, alpha:0, rd:0}
        })
    }
}
//shape movements
function updateProperties(o1){
    for (key in o1.change){
        o1[key] += o1.change[key];
    }
}
function bounce(o){
    if(o.x>w || o.x<0){
        o.change.x *= -1;
    } else
    if (o.y>h || o.y<0){
        o.change.y *= -1;
    }
}
function bounce_angle(o){
    if (o.x>w || o.x<0){
        o.angle += 180 -2*o.angle;
    }
    if (o.y>h || o.y<0){
        o.angle += 360 -2*o.angle;
    }
}
function toriod(o){
    if (o.x>w){
        o.x =0;
    } else
    if (o.x<0){
        o.x =w;
    } else
    if (o.y>h){
        o.y =0;
    } else
    if (o.y<0){
        o.y =h;
    }
}
