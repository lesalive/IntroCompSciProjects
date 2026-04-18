let canvas;
let ctx;
let w = 800;
let h = 450;
const pi=Math.PI;
let state = {
    pause: false,
    follow: false,
    iris: true,
    bColor: 0,
}
let allFlowers = []
let hue = 0;
let intervalFlr;
let intervalFgrowth;
let colorSetNames = ["yellows", "pinks", "blues"]
let colorSets = [
    ["gold", "yellow", "goldenrod", "darkgoldenrod", "rosybrown", "sienna", "burlywood", "peachpuff", "lightsalmon"],
    ["hotpink", "pink", "deeppink", "palevioletred", "mediumvioletred", "rosybrown", "mistyrose", "lavenderblush", "lightcoral"],
    ["cornflowerblue", "blue", "lightskyblue", "deepskyblue", "darkblue", "steelblue", "skyblue", "royalblue", "lightsteelblue"]
]
let beecolors = colorSets[0]
let beeobj = {
    x:w/2,
    y:h/2,
    w:30,
    h:15,
    rd:0,
    angle:0,
    color: 0,
    change: {angle:1, vx:0, vy:0}
}
let beeTrail = []
let intervalBeeTrail;
let pollinators = []
let intervalPollinators =[]
let allSplat = []
let allClouds = []
let cloudobj = {
    x: 0,
    y: 50+randn(50),
    w: 100,
    h: 20,
    rd: 0,
    color: "#eeeeeeff",
    alpha: 1,
    on: false,
    change: {x:1, alpha:0}
}
let rainParticles = []

//-----
document.onkeydown = keydown;
document.getElementById("myCanvas").onmousemove = mousemove;
document.getElementById("myCanvas").onclick = click;

intervalFlr = setInterval( function(){
    if (state.pause){}else
    if (allFlowers.length<12){
        allFlowers.push({
            x: randi(750)+25,
            y: 50,
            size: 10,
            color: hue,
            change: {size: rand(0.2)+1/1400}
        }); 
    }

}, 2000) //adds flowers unless there's more than 12
intervalFgrowth = setInterval(function(){
    if (state.pause){}else{
    for(let i=0; i<allFlowers.length; i++){
        allFlowers[i].y += 1;
        allFlowers[i].size += allFlowers[i].change.size;
    } 
    }   
}, 300) //grows flower height
intervalPollinators = setInterval(function(){
    if (state.pause){}else{
        if (pollinators.length<21){createPollinator();}
        //else clearInterval(intervalPollinators)
    }
}, 3000) //adds small bees until there's 20
intervalBeeTrail = setInterval(function(){
    if (state.pause){}else{
        createTrailBee(beeTrail, pollinators[0]);  
    }

}, 200) //makes bee's pollen trail particles

setUpCanvas();
animationLoop();
pollinators.push(beeobj);
//allClouds.push(cloudobj);

//-----functions
function animationLoop(){
    clearCanvas();
if (state.pause){ text("PAUSED",w/2,h/2); } else{ //if paused

    for(let i=0; i<allSplat.length; i++){ //--splat
        splat(allSplat[i]);
    }
    for(let i =0; i<rainParticles.length; i++){//draws all the rain
        if (rainParticles[i].ground>0){
            for (let j=0; j<allFlowers.length; j++){//checks if rain is near each flower
                detectOnFlowerGround(rainParticles[i], allFlowers[j]);
            }
        } 
        rect(rainParticles[i]);
        updateProperties(rainParticles[i]);
        rainHit(rainParticles[i]); 
    }
    for(let i =0; i<allClouds.length; i++){ //--clouds
        ifRaining(allClouds[i]);            //--makes rain
        rect(allClouds[i]);                 //--draws cloud
        updateProperties(allClouds[i]);
        toriod(allClouds[i]);
        if(allClouds[i].alpha<0){
            allClouds.splice(i, 1);
        } else {
            allClouds[i].color = "hsla(0, 0%, 90%,"+allClouds[i].alpha+")";
        }
    }

    uiDisplay();                            //--UI
    for(let i=0; i<allFlowers.length; i++){ //--flowers
        flower(allFlowers[i]);
        ripe(allFlowers[i]);
    }
    for(let i=0; i<beeTrail.length; i++){ //--bee trail
        circle(beeTrail[i], 6);
        updateProperties(beeTrail[i]);
        if (beeTrail[i].alpha<=0){
            beeTrail.splice(i, 1);
        }
    }

    for(let i=0; i<pollinators.length; i++){ //--bees
        bee(pollinators[i]); //draws
        wiggles(pollinators[i]); //changes angle
        angleMovement(pollinators[i]); //moves bee across page
        toriod(pollinators[i]); //resets position if off screen
        for(let u=0; u<allFlowers.length; u++){ //detects if on flowers
            detectOnFlower(pollinators[i],allFlowers[u]);
        }
    }
}   
    requestAnimationFrame(animationLoop);
}
function keydown(event){ //if _ keys are pressed
    if (event.key == " "){
        if(state.pause){state.pause=false}else{state.pause=true;}
    } else
    if(event.key == "ArrowUp"){
        for(let i=0; i<pollinators.length; i++){
            pollinators[i].y -= 1;
        }
    } else
    if(event.key == "ArrowDown"){
        for(let i=0; i<pollinators.length; i++){
            pollinators[i].y += 1;
        }
    } else
    if(event.key == "ArrowLeft"){
        for(let i=0; i<pollinators.length; i++){
            pollinators[i].x -= 1;
        }
        for(let i=0; i<allClouds.length; i++){
            allClouds[i].x -= 1;
        }
    } else
    if(event.key == "ArrowRight"){
        for(let i=0; i<pollinators.length; i++){
            pollinators[i].x += 1;
        }
        for(let i=0; i<allClouds.length; i++){
            allClouds[i].x += 1;
        }
    }
    if(event.key == "c"){
        allClouds.push({
            x: 0,
            y: 50+randn(50),
            w: 100,
            h: 20,
            rd: 0,
            color: "#eeeeeeff",
            alpha: 1,
            on: false,
            change: {x:randn(2), alpha:0}
            });
        //console.log(allClouds)
    }
}
function click(event){//when mouse is clicked
    if (event.offsetX>10 && event.offsetX<105 && event.offsetY>35 && event.offsetY<50){ //flower color
        if (state.iris){state.iris=false}else{state.iris=true}
    } else
    if (event.offsetX>10 && event.offsetX<105 && event.offsetY>55 && event.offsetY<70){ //bee colorset
        if(state.bColor<2){state.bColor++}else{state.bColor=0}  //change bColor
        beecolors=colorSets[state.bColor];                      //update beecolors to the bColor colorSet
    } else
    if (state.follow){state.follow=false} else {state.follow=true} //switches follow on/off
            
    for(let i =0; i<allClouds.length; i++){ //rain cloud
        if(
            event.offsetX > allClouds[i].x-allClouds[i].w/2 &&
            event.offsetX < allClouds[i].x+allClouds[i].w/2 &&
            event.offsetY > allClouds[i].y-allClouds[i].h/2 &&
            event.offsetY < allClouds[i].y+allClouds[i].h/2
        ){
            allClouds[i].on=true;
        } 
    }

}
function mousemove(event){ //when the cursor moves on the canvas
    let value;
    if (event.offsetY > 400){ //when cursor is at y 400-450...
        for(let i=0; i<allFlowers.length; i++){
            if (state.iris){value=allFlowers[i].x/w*360}else{value=0}
            hue = 360*event.offsetX/w + value;
            allFlowers[i].color = hue;
        }
    }

    cursorBee(pollinators[0], event);
}
function cursorBee(beeobj, event){//makes bee follow cursor
    if(state.follow){ //if pressed down while on canvas
        beeobj.x = event.offsetX; beeobj.y = event.offsetY; //bee follows
        for(let i=0; i<allFlowers.length; i++){             //if moved on flower
            detectOnFlower(beeobj, allFlowers[i]);
        }
    }
}
function detectOnFlower(bee, flower){
    if(
        bee.x+bee.w/2 > flower.x-flower.size &&
        bee.x-bee.w/2 < flower.x+flower.size &&
        bee.y+bee.h/2 > h-flower.y-flower.size &&
        bee.y-bee.h/2 < h-flower.y+flower.size
    ){
        flower.y++;
        flower.size+=flower.change.size;  
    }
}
function ripe(flower){
    let index = allFlowers.indexOf(flower);
    if(flower.size>25 || flower.y>h-50){
        createSplatData(allSplat, allFlowers[index]);
        allFlowers.splice(index, 1);
    }
}
function ifRaining(cloud){
    if (cloud.on==true){            //--if on
        setTimeout(function(){cloud.change.alpha = -1/180;}, 1000) //start cloud fade out after set time
        createRain(cloud); //pushes a new rain particle
    }
}
function detectOnFlowerGround(obj, flower){
    if(
        obj.x+obj.w/2 > flower.x-flower.size &&
        obj.x-obj.w/2 < flower.x+flower.size
    ){
        flower.y+= 0.1;
        flower.size+=0.5*flower.change.size;  
    }
}
//canvas functions
function uiDisplay(){
    let string;
    string = "score: "+allSplat.length;
    text(string, 10, 30);

    ctx.beginPath();
    ctx.fillStyle = "pink";
    ctx.fillRect(10,35,105,15);
    if(state.iris){string="rainbow"} else {string="single"}
    text("🌼color: " + string, 10, 50);

    ctx.beginPath();
    ctx.fillStyle = "pink";
    ctx.fillRect(10,55,105,15);
    string = colorSetNames[state.bColor];
    text("🐝color: "+ string, 10, 70);

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
    o.color = beecolors[o.color];
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
function splat(o){
    ctx.beginPath();
    ctx.fillStyle = "hsla("+o.color+", 100%, 50%, 1)";
    ctx.arc(o.x, o.y, o.size, 0, 2*pi); //main splat
    ctx.fill();
    ctx.beginPath();
    ctx.arc(o.x+o.size, o.y+o.sizesmall, Math.abs(0.7*o.sizesmall), 0, 2*pi); //small splat
    ctx.fill();
    ctx.beginPath();
    ctx.arc(o.x-o.size, o.y-1.5*o.sizesmall, Math.abs(0.5*o.sizesmall), 0, 2*pi);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(o.x+2*o.size, o.y+2*o.sizesmall, Math.abs(0.3*o.sizesmall), 0, 2*pi); //tiny splat
    ctx.fill();
}
function createPollinator(){
    pollinators.push({
        x:0,
        y:50*(randi(8)+1),
        w:12,
        h:6,
        rd:0,
        angle:0,
        color: [randi(9)],
        change: {angle:1, vx: randn(2)*0.5, vy:4,}
    })
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
function createSplatData(array, obj){
    array.push({
        x: obj.x,
        y: h-obj.y,
        size: obj.size,
        color: obj.color,
        sizesmall: randn(obj.size)
    })
}
function createRain(obj){ //creates rain at the location of the cloud obj
    if (obj.alpha>0.5){
        rainParticles.push({
            x: obj.x+randn(obj.w),
            y: obj.y,
            w: 2,
            h: 8,
            color: "lightblue",
            alpha:1,
            rd: 1,
            ground:0,
            change:{x:0, y:2, w:0, h:0, alpha:0}
        })
    }
}
//shape movements
function updateProperties(o1){
    for (key in o1.change){
        o1[key] += o1.change[key];
    }
}
function angleMovement(o){
    var cx = o.change.vx*Math.cos(o.angle*pi/180);
    var cy = o.change.vy*Math.sin(o.angle*pi/180);  
    o.x += cx;
    o.y += cy;
}
function wiggles(o){
    if(o.angle>6){o.change.angle=-1} else if (o.angle<-6){o.change.angle=1}
    o.angle+=o.change.angle;   
}
function rainHit(o){
    let index = rainParticles.indexOf(o);
    if(o.y>=h){//when hit ground
        o.change.y = -1;
        o.ground++
    }
    if(o.ground>0){//once grounded
        o.change.y += 0.1;
        o.change.h = -0.04;
        o.change.alpha = -0.01;
        o.color = "hsla(195, 53%, 79%, "+o.alpha+")";
        if (o.alpha<0){//remove if invisible
            rainParticles.splice(index, 1);
        }
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
