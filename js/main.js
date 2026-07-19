// =====================================================
// ELEMENTS
// =====================================================

const cakeButton = document.getElementById("cakeButton");

const instruction = document.getElementById("instruction");

const screen1 = document.getElementById("screen1");

const screen2 = document.getElementById("screen2");

const messageTitle = document.getElementById("messageTitle");

const messageText = document.getElementById("messageText");

const petitionButton = document.getElementById("petitionButton");


// =====================================================
// VARIABLES
// =====================================================

let holdTimer;

let messageTimer;

let isHolding = false;


// =====================================================
// START HOLDING THE CAKE
// =====================================================

function startHolding() {


    if (isHolding) return;


    isHolding = true;


    cakeButton.classList.add("holding");


    instruction.innerHTML = "✨ Keep holding...";


    // Message progression while holding

    messageTimer = setInterval(() => {


        if (instruction.innerHTML.includes("Keep")) {


            instruction.innerHTML =
                "🎈 Almost there...";


        } else {


            instruction.innerHTML =
                "🎉 Ready...";


        }


    }, 1200);



    // Complete after 3 seconds

    holdTimer = setTimeout(() => {


        celebrate();


    }, 3000);


}





// =====================================================
// STOP HOLDING
// =====================================================

function stopHolding() {


    if (!isHolding) return;


    isHolding = false;


    clearTimeout(holdTimer);

    clearInterval(messageTimer);


    cakeButton.classList.remove("holding");


    instruction.innerHTML =
        "Hold the cake.";


}





// =====================================================
// CELEBRATION SEQUENCE
// =====================================================

function celebrate() {


    clearInterval(messageTimer);


    instruction.innerHTML =
        "🥳 Surprise!";


    // First confetti burst

    confetti({

        particleCount:180,

        spread:90,

        origin:{
            x:.2,
            y:.6
        }

    });



    // Second burst

    setTimeout(() => {


        confetti({

            particleCount:180,

            spread:120,

            origin:{
                x:.8,
                y:.6
            }

        });


    },250);




    // Final huge burst

    setTimeout(() => {


        confetti({

            particleCount:300,

            spread:180,

            origin:{
                y:.4
            }

        });


    },500);



    // Move to thank-you screen

    setTimeout(() => {


        transitionToThankYou();


    },1200);


}







// =====================================================
// SECOND SCREEN STORY
// =====================================================

function transitionToThankYou() {


    screen1.classList.add("fadeOut");



    setTimeout(() => {


        screen1.classList.add("hidden");


        screen2.classList.remove("hidden");


        runMessageSequence();



    },800);


}






function runMessageSequence() {


    const messages = [


        {

            title:"🥳 THANK YOU!",

            text:""

        },


        {

            title:"",

            text:
            "Your birthday wishes<br>made Boyd's day."

        },


        {

            title:"⚾",

            text:
            "After decades<br>behind home plate..."

        },


        {

            title:"",

            text:
            "Boyd isn't retiring.<br><br>The rules are making him."

        },


        {

            title:"",

            text:
            "Learn why Boyd should<br>still be behind the plate."

        }



    ];



    let index = 0;



    function showNext(){


        if(index >= messages.length){


            revealButton();

            return;


        }



        messageTitle.innerHTML =
            messages[index].title;


        messageText.innerHTML =
            messages[index].text;



        messageTitle.classList.remove("fadeIn");

        messageText.classList.remove("fadeIn");



        void messageTitle.offsetWidth;



        messageTitle.classList.add("fadeIn");

        messageText.classList.add("fadeIn");



        index++;


        messageTimer = setTimeout(showNext,2500);


    }



    showNext();


}






// =====================================================
// BUTTON REVEAL
// =====================================================

function revealButton(){


    petitionButton.style.opacity="1";


    petitionButton.style.transform=
        "translateY(0)";


}






// =====================================================
// EVENT LISTENERS
// =====================================================


// Desktop

cakeButton.addEventListener(
    "mousedown",
    startHolding
);


cakeButton.addEventListener(
    "mouseup",
    stopHolding
);


cakeButton.addEventListener(
    "mouseleave",
    stopHolding
);



// Mobile

cakeButton.addEventListener(
    "touchstart",
    startHolding
);


cakeButton.addEventListener(
    "touchend",
    stopHolding
);
