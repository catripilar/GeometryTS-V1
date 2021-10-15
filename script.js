const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const card = document.getElementById('card');
const cardS = document.getElementById('cardS');
let pressT = 1000;
let enemyS = 5;
let score = 0;
let scoreI = 0;
let Cscore = true;
function starG(){
    player = new Player(150,350,50,"black");
    arrayBlocks = [];
    score = 0;
    scoreI = 0;
    enemyS = 5;
    Cscore = true;
    pressT = 1000;
}
function restart(button){card.style.display = "none";button.blur();starG();requestAnimationFrame(animate);}
function aleatorio(min,max){return Math.floor(Math.random()*(max - min + 1))+min;}
function numI(timeI){
    let returnT = timeI;
    if(Math.random() < 0.5){returnT += aleatorio(pressT/3,pressT * 1.5);}
    else{returnT -= aleatorio(pressT/5,pressT / 2);}
    return returnT;
}
function drawScore(){
    ctx.font = "80px Arial";
    ctx.fillStyle = "black";
    let scoreS = score.toString();
    let xOffset = ((scoreS.length - 1) * 20);
    ctx.fillText(scoreS,280 - xOffset,100);
}
class Player{
    constructor(x,y,size,color){
        this.x=x;
        this.y=y;
        this.size=size;
        this.color=color;
        this.jumpH = 12;
        this.shoutJ = false;
        this.jumpC = 0;
        this.spin = 0;
        this.spinI = 90/32;
    }
    rotation(){
        let offsetXP = this.x + (this.size/2);
        let offsetYP = this.y + (this.size/2);
        ctx.translate(offsetXP,offsetYP);
        ctx.rotate(this.spin * Math.PI/180);
        ctx.rotate(this.spinI * Math.PI/180);
        ctx.translate(-offsetXP,-offsetYP);
        this.spin += this.spinI;
    }
    Crotation(){
        let offsetXP = this.x + (this.size/2);
        let offsetYP = this.y + (this.size/2);
        ctx.translate(offsetXP,offsetYP);
        ctx.rotate(-this.spin * Math.PI/180);
        ctx.translate(-offsetXP,-offsetYP);     
    }
    jump(){
        if(this.shoutJ){
            this.jumpC++;
            if(this.jumpC < 15){this.y -= this.jumpH;}
            else if(this.jumpC > 14 && this.jumpC < 19){this.y +=0;}
            else if(this.jumpC < 33){this.y += this.jumpH;}
            this.rotation();
        }
        if(this.jumpC >= 32){this.Crotation();this.spin = 0; this.shoutJ = false;}
    }
    draw(){
        this.jump()
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x,this.y,this.size,this.size);
        if(this.shoutJ) this.Crotation();
    }
}
let player = new Player(150,350,50,"black");
class AvoidBlock{
    constructor(size,speed){
        this.x = canvas.width + size;
        this.y = 400 - size;
        this.size = size;
        this.color = 'red';
        this.slideSpeed = speed;
    }
    draw(){ctx.fillStyle = this.color;ctx.fillRect(this.x,this.y,this.size,this.size);}
    slide(){this.draw();this.x -= this.slideSpeed}
}
let arrayBlocks = [];
function Gblock(){
    let timedalay = numI(pressT);
    arrayBlocks.push(new AvoidBlock(50,enemyS));
    setTimeout(Gblock,timedalay);
}
function chao(){ctx.beginPath();ctx.moveTo(0,400);ctx.lineTo(600,400);ctx.lineWidth = 2;ctx.strokeStyle = 'black';ctx.stroke();}
function colizao(player,block){
    let s1 = Object.assign(Object.create(Object.getPrototypeOf(player)),player);
    let s2 = Object.assign(Object.create(Object.getPrototypeOf(block)),block);
    s2.size = s2.size - 10;s2.x = s2.x + 10;s2.y = s2.y + 10;
    return !(s1.x>s2.x+s2.size || s1.x+s2.size<s2.x || s1.y>s2.y+s2.size || s1.y+s1.size<s2.y)
}
function inPast(player,block){
    return(
        player.x + (player.size/2) > block.x + (block.size/4) &&
        player.x + (player.size/2) > block.x + (block.size/4)*3
    )
}
function shouldI(){
    if(scoreI + 10 === score){
        scoreI = score;enemyS++;
        pressT >= 100 ? pressT -= 100 : pressT = pressT/2;
        arrayBlocks.forEach(block =>{block.slideSpeed = enemyS;});
    }
}
let animationId = null;
function animate(){
    animationId = requestAnimationFrame(animate);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    chao();
    drawScore();
    player.draw();
    shouldI();
    arrayBlocks.forEach((arrayBlock,index) =>{
        arrayBlock.slide();
        if(colizao(player,arrayBlock)){cardS.textContent = score;card.style.display = "block";cancelAnimationFrame(animationId);}
        if(inPast(player,arrayBlock) && Cscore){Cscore = false;score++;}
        if((arrayBlock.x + arrayBlock.size) <= 0){
            setTimeout(() => {
                arrayBlocks.splice(index,1);
            },0);
        }
    });
}
animate();
setTimeout(() =>{Gblock();},numI(pressT));
addEventListener('keydown',e =>{
    if(e.code === "Space"){
        player.jumpC = 0;
        player.shoutJ = true;
        Cscore = true;
    }
});