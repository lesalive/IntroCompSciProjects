var canvas;
var ctx;
var w = 800;
var h = 450;
var bg = {
    hue: 175,
    index: 1,
    alpha:0.0,
    ending: false
}
var o_rect = {
    x: 0,
    y: h/2,
    w:70,
    h:70,
    color:randi(360),
    alpha:1,
    angle: 0,
    rd:0,
    change : {x:0, y:0, w:0, h:0, alpha:0, angle:1, rd:0}
}
var groupSnow = createData(60);
let snowCondition = false;
var o_cloud = {
    x: w/2,
    y: h/8,
    s: 10,
    alpha: 1,
    change : {x:5, y:0, s:0, alpha:0}
}
var groupClouds = createDataClouds(5);
let cloudFade = false;
//----- code
setUpCanvas();
animationLoop();
setTimeout(function(){ // set time for snow to start
    snowCondition = true;
    console.log(snowCondition);
}, 4000)
setTimeout(function(){  // snow fades out after set time
    for (let i=0; i<groupSnow.length; i++){
        groupSnow[i].change.alpha = -1/(60*15); //alpha reduces to fade out after 15s
        groupSnow[i].change.w = -0.01;
        groupSnow[i].change.h = -0.01;          // width height reduces
    }
}, 10000)
setTimeout(function(){ // set time for clouds to fade out after set time
    for (var i=0; i<groupClouds.length; i++){
        groupClouds[i].change.alpha = -1/(60*3); 
    }

}, 20000)
setTimeout(function(){ //set time for bg to fade out
    bg.ending = true;
}, 25000)
//----- functions
function animationLoop(){ // main animation
    clearCanvas(); // clears frame
    sky(bg);
    if (snowCondition){
        for (let i=0; i<groupSnow.length; i++){ //---snow ----
            rect(groupSnow[i]);                 //draw shape
            updateProperties(groupSnow[i]);     //update properties by change
            respawn(groupSnow[i]);              //resets position if off canvas

            if (groupSnow[i].alpha < 0){        //remove if alpha is invisible
                groupSnow.splice(i, 1);
            } else
            if (groupSnow[i].rd > 10 || groupSnow[i].rd < 0){ //reverse random change
                groupSnow[i].change.rd *= -1;
            }
        }
    }
    
    for (let i=0; i<groupClouds.length; i++){ //----clouds----
        clouds(groupClouds[i]);               //draw
        updateProperties(groupClouds[i]);     //update
        respawnClouds(groupClouds[i]);        //respawn
    }


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
    ctx.fillStyle = "hsla("+o.color+", 50%, 90%,"+o.alpha+")";
    //cx.stroke();
    ctx.fill();

    ctx.restore(); //restore saved canvas
}
function sky(bg){ //changes colour of sky   
    ctx.fillStyle = "hsla("+bg.hue+", 90%, 20%, "+bg.alpha+")";
    ctx.fillRect(0,0,w,h);
    bg.index++; //add to index
    bg.hue = 175+80*(Math.sin(bg.index*Math.PI/180)+1)/2; //change hue using sine wave
    if (bg.ending==true){bg.alpha -= 1/(60*2);} else      //fade out
    if (bg.alpha<1){bg.alpha += 1/(60*2);}                //fade in

}
function createData(n){ //creates objects for snow array
    var array=[];
    for (let i=0; i<n; i++){
        array.push({    
            x: randi(w),
            y: h/8,
            w:10,
            h:10,
            color:randi(360),
            alpha:0,
            angle: 45,
            rd:0,
            change : {x:randn(2), y:rand(5)+1, w:20/(60*6), h:20/(60*6), alpha:1/(60*6), rd:0.05}
        })
    }
    return array
}
function updateProperties(o){ //updates properties for each key in change
    for (key in o.change){
        o[key] += o.change[key];
    }
}
function respawn(o){ //resets position of falling snow
    if (o.y > h){   //if falls off bottom
        o.y = h/8;
    }
    if (o.x > w || o.x < 0){  //if falls off sides
        o.y = h/8;
        o.x = randi(w);
    }
}
function clouds(o){ //draws cloud shape
    ctx.beginPath();
    ctx.arc(o.x-3*o.s, o.y+2*o.s, 2*o.s, 0, 2*Math.PI); //4=(x+3)^{2}+(y+2)^{2}
    ctx.arc(o.x      , o.y      , 3*o.s, 0, 2*Math.PI); //9=(x)^2+(y)^2
    ctx.arc(o.x+3*o.s, o.y+2*o.s, 2*o.s, 0, 2*Math.PI); //4=(x-3)^{2}+(y+2)^{2}
    ctx.arc(o.x-5*o.s, o.y+1*o.s, 1*o.s, 0, 2*Math.PI); //2=(x+5)^{2}+(y+1)^{2}
    ctx.arc(o.x+4*o.s, o.y, 2*o.s, 0, 2*Math.PI); //4=(x-4)^{2}+(y+0)^{2}
    ctx.arc(o.x+6*o.s, o.y+1*o.s, 1*o.s, 0, 2*Math.PI); //2=(x-6)^{2}+(y+1)^{2}
    ctx.fillStyle = "hsla(0, 0%, 9"+o.light+"%,"+o.alpha+")"
    ctx.fill();
}
function createDataClouds(n){
    var array=[];
    for (let i=0; i<n; i++){
        array.push({
            x: -70,
            y: h/8,
            s: 10+randi(5),
            light: randi(10),
            alpha: 0,
            change : {x:randn(5), y:0, s:0, alpha: 1/(60*10)}
        })
    }
    return array
}
function respawnClouds(o){
    if (o.x > w+7*o.s){
        o.x = 0-7*o.s;
    } else 
    if (o.x < 0-7*o.s){
        o.x = w+7*o.s;
    }
}