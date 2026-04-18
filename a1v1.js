const canvas=document.getElementById("myCanvas");
const cx=canvas.getContext("2d");
let canvasColor="solid #000";


setUpCanvas();
drawGrass();

function setUpCanvas(){
    canvas.style.border = canvasColor;
    canvas.width = 800;
    canvas.height = 450;
    console.log("canvas setup");
}

function drawGrass(){
    cx.beginPath();    
    cx.rect(0,425,800,25);    
    cx.fillStyle = "green";
    cx.fill();
}

function drawBg(){
    drawGrass();
    cx.beginPath();
    cx.rect(50,110,300,315);
    for (let h=0;h<3;h++){
        for (let i=1; i<6; i++){
        cx.rect(25+i*50,130+h*80,30,50);
    }}
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