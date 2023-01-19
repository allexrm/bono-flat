
let bono = document.querySelector('#bono');
let pote_racao = document.querySelector('#pote-racao');
let fome_progress = document.querySelector("#fome-progress");
let fome=0;

const area = {
    min_left: 1,
    max_left: 90,
    min_top: 6,
    max_top: 22
}

function onLoad(){
    // Inicia o movimento do Bono Virtual
    move();
}

// Moving
let move_timeout = null;
function move(){
    stop_moving();
    //Checa se está comendo
    if (bono.classList.contains('comendo')) return;

    let x=0;
    let y=0;
    if (toy){
        x = posToy.destX;
        y = posToy.destY;
    } else 
    if (fome > 33 && pote_racao.classList.contains('cheio')) {
        x = 4;
        y = 75;
        bono.style.left = `${x}vw`;
        bono.style.top = `${y}vh`;
        startEating();
        return;
    } else {
        x = area.min_left + Math.random()*(area.max_left - area.min_left);
        y = area.min_top + Math.random()*(area.max_top - area.min_top);    
    }
    bono.style.left = `${x}vw`;
    bono.style.top = `${y}vw`;
    start_moving();
}
function stop_moving(){
    clearInterval(move_timeout);
}
function start_moving(){
    move_timeout = setTimeout(move, 3000+Math.round(Math.random()*7000));
}


//State controll
const states = ['calmo','agitado','puto'];
function setState(state){
    bono.classList.remove('calmo','agitado','puto');
    bono.classList.add(state);
}


//Toys
let toy=null;
let posToy={x:0,y:0,destX:0,destY:0}

function startDraggingToy(e){
    e = e || window.event;
    e.preventDefault();

    toy = e.target.parentNode;

    posToy.x = e.clientX;
    posToy.y = e.clientY;

    document.onmouseup = stopDraggingToy;
    // call a function whenever the cursor moves:
    document.onmousemove = draggToy;
}

function stopDraggingToy(e){
    document.onmouseup = null;
    document.onmousemove = null;
    toy = null;
    move();

    setState('calmo');
}

function draggToy(e){
    e = e || window.event;
    e.preventDefault();

    x = posToy.x - e.clientX;
    y = posToy.y - e.clientY;

    posToy.destX = ((toy.offsetLeft - x)*100)/window.innerWidth;
    posToy.destY = ((toy.offsetTop - y)*100)/window.innerWidth;

    if ((toy.offsetLeft - x) < 0 ) return;
    if ((toy.offsetTop - y) < 0 ) return;

    toy.style.left = posToy.destX + "vw";
    toy.style.top = posToy.destY + "vw";

    posToy.x = e.clientX;
    posToy.y = e.clientY;
    setState('agitado');
}

document.querySelectorAll('.toy i').forEach(item => {
    item.addEventListener('mousedown', startDraggingToy);
});

//Ração
document.querySelector(".pacote-racao").addEventListener('dragstart', e=>{
    console.log("dragging");
}, false);
document.querySelector(".pote").addEventListener('dragenter', e=>{
    e.target.classList.add("cheio");
    if (fome > 33) move();

}, false);
document.querySelector(".pote").addEventListener('drop', e=>{
    console.log("dropped");
}, false);

//fome
let fome_timeout=null;
let fome_inc=1;
function setIntervalToUpdateHungry(interval){
    clearInterval(fome_timeout);
    fome_timeout = setInterval(updateHungry, interval);
}
function updateHungry(){
    fome += fome_inc;
    fome = (fome > 100) ? 100 : fome;
    fome = (fome < 0) ? 0 : fome;

    let color = 'blueviolet';
    color = (fome > 33) ? 'rgb(247 159 0)' : color;
    if (fome > 66){
        color = '#af0111';
        bono.classList.add('fome');
    }

    fome_progress.innerHTML = `${fome}%`;
    fome_progress.style.width = `${fome}%`;
    fome_progress.style.backgroundColor = color;

    if (fome==0) finishEating();
}
function startEating(){
    bono.classList.add('comendo');
    fome_inc = -1;
    setIntervalToUpdateHungry(500);
}
function finishEating(){
    bono.classList.remove('comendo','fome');
    pote_racao.classList.remove('cheio');
    fome_inc = 1;
    setIntervalToUpdateHungry(1000);
    move();
}
setIntervalToUpdateHungry(1000);


//Carinho
document.querySelector('.bono .cabeca').addEventListener('mouseenter', e=>{
    stop_moving()
    bono.classList.add('carinho');
});

document.querySelector('.bono .cabeca').addEventListener('mouseleave', e=>{
    start_moving()
    bono.classList.remove('carinho');
});