const cake=document.getElementById("cakeButton");

const first=document.getElementById("page1");

const second=document.getElementById("page2");

let timer;

let holding=false;

function celebrate(){

    confetti({

        particleCount:300,

        spread:180,

        origin:{y:.6}

    });

    first.classList.add("hidden");

    second.classList.remove("hidden");

}

cake.addEventListener("mousedown",start);

cake.addEventListener("touchstart",start);

cake.addEventListener("mouseup",stop);

cake.addEventListener("mouseleave",stop);

cake.addEventListener("touchend",stop);

function start(){

    if(holding)return;

    holding=true;

    cake.classList.add("growing");

    timer=setTimeout(celebrate,3000);

}

function stop(){

    holding=false;

    cake.classList.remove("growing");

    clearTimeout(timer);

}
