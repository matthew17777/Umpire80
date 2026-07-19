const cake=document.getElementById("cakeButton");

const instruction=document.getElementById("instruction");

const page1=document.getElementById("page1");

const page2=document.getElementById("page2");

let timer;

let progressTimer;

let holding=false;

function celebrate(){

confetti({

particleCount:180,

spread:90,

origin:{x:.2,y:.6}

});

setTimeout(()=>{

confetti({

particleCount:180,

spread:120,

origin:{x:.8,y:.6}

});

},200);

setTimeout(()=>{

confetti({

particleCount:260,

spread:180,

origin:{y:.45}

});

},400);

instruction.innerHTML="🎉 Surprise!";

page1.classList.add("fadeOut");

setTimeout(()=>{

page1.classList.add("hidden");

page2.classList.remove("hidden");

},800);

}

function start(){

if(holding)return;

holding=true;

cake.classList.add("holding");

let seconds=0;

instruction.innerHTML="✨ Keep holding...";

progressTimer=setInterval(()=>{

seconds++;

if(seconds===1){

instruction.innerHTML="🎈 Keep holding...";

}

if(seconds===2){

instruction.innerHTML="🎉 Almost there...";

}

},1000);

timer=setTimeout(celebrate,3000);

}

function stop(){

if(!holding)return;

holding=false;

clearTimeout(timer);

clearInterval(progressTimer);

cake.classList.remove("holding");

instruction.innerHTML="Hold the cake for 3 seconds";

}

cake.addEventListener("mousedown",start);

cake.addEventListener("mouseup",stop);

cake.addEventListener("mouseleave",stop);

cake.addEventListener("touchstart",start,{passive:true});

cake.addEventListener("touchend",stop);
