const canvas=document.getElementById("myCanvas");
const cx=canvas.getContext("2d");
let canvasColor="solid #000";
let firecount=0;


setUpCanvas();
drawGrass();

function setUpCanvas(){
    canvas.style.border = canvasColor;
    canvas.width = 800;
    canvas.height = 450;
    let x = getX();
    let y = getY();
    console.log("canvas setup; drawing position: "+x+", "+y);
}

function getX(){
    return document.getElementById("inputx").value*100+50;
}
function getY(){
    const Ymap=[5,4,3,2,1,0];
    let z=Ymap[document.getElementById("inputy").value];
    return z*80+25;
}
function rand(){
   return Math.random();
}

function drawGrass(){
    cx.beginPath();    
    cx.rect(0,425,800,25);    
    cx.fillStyle = "green";
    cx.fill();
}

function drawBg(){
    cx.beginPath();
    cx.rect(50,100,300,325);
    cx.fillStyle="slategrey"
    cx.fill();
    cx.stroke();
    cx.beginPath();
    for (let h=0;h<3;h++){
        for (let i=1; i<6; i++){
        cx.rect(25+i*50,130+h*80,30,50);
    }}
    cx.fillStyle="whitesmoke"
    cx.fill();
    cx.stroke();
}

function drawGrid(){
    cx.beginPath();
    for (let x=0;x<6;x++){
        cx.moveTo(0,25+x*80);
        cx.lineTo(800,25+x*80);
    }
    for (let y=0;y<8;y++){
        cx.moveTo(50+y*100,0);
        cx.lineTo(50+y*100,450);
    }
    cx.stroke();

}

function drawFire(){
    let s=15;
    let r;
    x=getX();
    y=getY();
    const fireColor=["red","orange","yellow"];
    for (let i=1;i<4;i++){ 
        r=rand()*s;
        cx.beginPath();
        cx.moveTo(x,y);
        cx.quadraticCurveTo(x-3*s+r,y-0,x-3*s-r,y-3*s);
        r=rand()*s;
        cx.quadraticCurveTo(x-1*s-r,y-2.5*s-r,x-2*s+r,y-5*s-r);
        r=rand()*s;
        cx.quadraticCurveTo(x+1*s+r,y-5*s-r,x+1*s+r,y-2.5*s-r);
        r=rand()*s;
        cx.quadraticCurveTo(x+2*s+r,y-2.5*s-r,x+2*s+r,y-3*s-r);
        r=rand()*s;
        cx.quadraticCurveTo(x+3*s+r,y+r,x,y);
        cx.fillStyle =fireColor[i-1];
        cx.fill();
        cx.stroke();
        s=s-5
    }
    console.log("fire at "+x+", "+y);
}