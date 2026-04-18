let canvas;
let ctx;
let w = 800;
let h = 450;
let state = {
    mousedown: false,
    iris: true
}
let allFlowers = []
let flr = {
    x: randi(750)+25,
    y: 50,
    size: 10,
    color: 0,
    change: {y:1, size:0.2},
    ripe: false,
}
let intervalFlr;
let beeobj = {
    x:w/2,
    y:h/2,
    w:30,
    h:15,
    rd:0,
    angle:0,
    color: "gold",
    change: {angle:1}
}
let beeTrail = []
let intervalBeeTrail;
//-----
document.onkeydown = keydown;
document.getElementById("myCanvas").onmousedown = mousedown;
document.getElementById("myCanvas").onmouseup = mouseup;
document.getElementById("myCanvas").onmousemove = mousemove;
document.getElementById("myCanvas").onclick = click;

intervalFlr = setInterval( function(){
    if (allFlowers.length<12){
        allFlowers.push({
            x: randi(750)+25,
            y: 50,
            size: 10,
            color: randi(360),
            change: {y:1, size:0.2},
            ripe: false,
        }); 
    }

}, 2000)
intervalBeeTrail = setInterval(function(){
    createTrailBee(beeTrail, beeobj);
}, 200)

setUpCanvas();
animationLoop();

//-----functions
function animationLoop(){
    clearCanvas();
    uiDisplay(); //--UI
    for(let i=0; i<allFlowers.length; i++){ //--flowers
        flower(allFlowers[i]);
    }
    for(let i=0; i<beeTrail.length; i++){ //--bee trail
        circle(beeTrail[i], 6);
        updateProperties(beeTrail[i]);
        if (beeTrail[i].alpha<=0){
            beeTrail.splice(i, 1);
        }
    }
    bee(beeobj); //--bee
    if(beeobj.angle>6){beeobj.change.angle=-1} else if (beeobj.angle<-6){beeobj.change.angle=1}
    beeobj.angle+=beeobj.change.angle;

    requestAnimationFrame(animationLoop);
}
function mousedown(){ //change state.mousedown when mouse is pressed
    state.mousedown = true;
}
function mouseup(){ //change state.mousedown mouse is not pressed
    state.mousedown = false;
}
function keydown(event){ //if _ keys are pressed
    if(event.key == "ArrowUp"){
        for(let i=0; i<allShapes.length; i++){
            allShapes[i].change.y -= 1;
            console.log("up")
        }
    } else
    if(event.key == "ArrowDown"){
        for(let i=0; i<allShapes.length; i++){
            allShapes[i].change.y += 1;
            console.log("down")
        }
    } else
    if(event.key == "ArrowLeft"){
        for(let i=0; i<allShapes.length; i++){
            allShapes[i].change.x -= 1;
            console.log("left")
        }
    } else
    if(event.key == "ArrowRight"){
        for(let i=0; i<allShapes.length; i++){
            allShapes[i].change.x += 1;
            console.log("right")
        }
    }
}
function click(event){//when mouse is clicked
    if (event.offsetX>10 && event.offsetX<105 && event.offsetY>35 && event.offsetY<50){ //state.iris
        if (state.iris){state.iris=false}else{state.iris=true}
    }
}
function mousemove(event){ //when the cursor moves on the canvas
    let value;
    if (event.offsetY > 400){ //when cursor is at y 400-450...
        for(let i=0; i<allFlowers.length; i++){
            if (state.iris){value=allFlowers[i].x/w*360}else{value=0}
            allFlowers[i].color = 360*event.offsetX/w + value;
        }
    }

    if(state.mousedown){ //if pressed down while on canvas, bee follows
        beeobj.x = event.offsetX;
        beeobj.y = event.offsetY;
    }
}
function createDataCursor(num, array, e){//creates new object at location of cursor
    for (let i=0; i<num; i++){
        array.push({
            x: e.offsetX,
            y: e.offsetY,
        })
    }
}
//canvas functions
function uiDisplay(){
    let string;
    ctx.beginPath();
    ctx.fillStyle = "pink";
    ctx.fillRect(10,35,105,15);
    if(state.iris){string="rainbow"} else {string="single"}
    text("🌼color: " + string, 10, 50);
}
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
function text(string, x, y){
    ctx.beginPath();
    ctx.fillStyle = "green";
    ctx.font = "12px Verdana";
    ctx.fillText(string, x, y);
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
function bee(o){
    let x=o.x, y=o.y, w=o.w, h=o.h, color=o.color, angle=o.angle;
    rect(o);
    o.w*=1/3;
    o.color="black";
    rect(o);
    o.w*=3/2;
    o.h*=1/3;
    o.angle+=45+o.change.angle*5;
    o.color="aliceblue";
    o.y-=h/4;
    rect(o)
    o.w=w, o.h=h, o.color=color, o.angle=angle, o.y=y;
}
function rect(o){
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
    ctx.fillStyle = o.color;
    ctx.fill();

    ctx.restore(); //restore saved canvas
}
function circle(o, sides){
    let oneDegree = Math.PI/180;
    let angle = 0;
    let cx = o.r*Math.cos(angle*oneDegree);
    let cy = o.r*Math.sin(angle*oneDegree);

    ctx.beginPath();
    ctx.moveTo(o.x+cx+randn(o.rd), o.y+cy+randn(o.rd));
    for(let i=0; i<sides; i++){
        angle += 360/sides;
        cx = o.r*Math.cos(angle*oneDegree);
        cy = o.r*Math.sin(angle*oneDegree);
        ctx.lineTo(o.x+cx+randn(o.rd), o.y+cy+randn(o.rd));
    }
    ctx.fillStyle = "hsla("+o.color+", 100%, 50%,"+o.alpha+")";
    ctx.fill();
}
function createTrailBee(array, obj){
    array.push({
        x: obj.x,
        y: obj.y,
        r:5,
        color: 50,
        alpha: 0.9,
        rd: 0,
        change: {x:0, y:0.5, w:0, r:0, alpha:-0.9/(60), rd:0.1}
    })
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
