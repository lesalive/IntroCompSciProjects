var canvas;
var ctx;
var w = 800;
var h = 450;
var bg = {
    hue: 175,
    index: 0
}
var o_rect = {
    x: w/4,
    y: h/4,
    w:30,
    h:30,
    color:randi(360),
    alpha:1,
    angle: 45,
    rd:0, //random
    change : {x:1, y:5, w:0, h:0, color:0, alpha:-1/(60*10), rd:0.05}
}
var groupSnow = createData(60);

//----- code
setUpCanvas();
animationLoop();

//----- functions
function animationLoop(){ // main animation
    clearCanvas(); // clears frame
    sky(bg);

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
    // let hue; //blue 175 to 255    
    // let index; 
    bg.hue = 175+80*(Math.sin(bg.index*Math.PI/180)+1)/2; //change hue using sine wave

    ctx.fillStyle = "hsla("+bg.hue+", 90%, 20%, 1)";
    ctx.fillRect(0,0,w,h);
    bg.index++; //add to index
}
function createData(n){ //creates objects for array
    var array=[];
    for (let i=0; i<n; i++){
        array.push({    
            x: randi(w),
            y: h/8,
            w:30,
            h:30,
            color:randi(360),
            alpha:1,
            angle: 45,
            rd:0,
            change : {x:randn(2), y:rand(5)+1, w:-0.01, h:-0.01, color:0, alpha:-1/(60*10), rd:0.05}
        })
    }
    return array
}
function updateProperties(o){ //updates properties for each key in change
    for (key in o.change){
        o[key] += o.change[key];
    }
}
function respawn(o){ //resets position of object
    if (o.y > h){   //if falls off bottom
        o.y = h/8;
    }
    if (o.x > w || o.x < 0){  //if falls off sides
        o.y = h/8;
        o.x = randi(w);
    }
}