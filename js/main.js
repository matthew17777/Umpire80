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
let shakeInterval;
let messageTimer;
let isHolding = false;
let hasExploded = false; // The fix for the bug!

let holdTime = 0;
const maxHoldTime = 3000; // 3 seconds total
const tickRate = 50; // Runs 20 times a second for a fast shake

// =====================================================
// START HOLDING THE CAKE
// =====================================================
function startHolding(e) {
    if (e && e.cancelable) e.preventDefault(); // Prevents mobile scrolling issues
    
    // If they are already holding it or it already exploded, do nothing
    if (isHolding || hasExploded) return;

    isHolding = true;
    holdTime = 0;

    cakeButton.classList.add("holding");
    instruction.innerHTML = "✨ Keep holding...";

    // Progressive Shake Engine
    shakeInterval = setInterval(() => {
        holdTime += tickRate;

        // Update messages based on time elapsed
        if (holdTime < 1200) {
            instruction.innerHTML = "✨ Keep holding...";
        } else if (holdTime < 2400) {
            instruction.innerHTML = "🎈 Almost there...";
        } else {
            instruction.innerHTML = "🎉 Ready...";
        }

        // Calculate how intense the shake is (ramps up exponentially)
        let intensity = Math.pow((holdTime / maxHoldTime), 3) * 35; 
        // Calculate the balloon expansion (grows by up to 40%)
        let currentScale = 1 + (holdTime / maxHoldTime) * 0.4;

        // Create random violent movements
        const randomX = (Math.random() - 0.5) * 2 * intensity;
        const randomY = (Math.random() - 0.5) * 2 * intensity;

        // Push data to CSS variables
        cakeButton.style.setProperty('--shake-x', `${randomX}px`);
        cakeButton.style.setProperty('--shake-y', `${randomY}px`);
        cakeButton.style.setProperty('--scale', currentScale);

        // Explode when time is up!
        if (holdTime >= maxHoldTime) {
            celebrate();
        }

    }, tickRate);
}

// =====================================================
// STOP HOLDING
// =====================================================
function stopHolding() {
    // If it already exploded, ignore this function so we don't break the story!
    if (!isHolding || hasExploded) return;

    isHolding = false;
    
    // Stop the shake math
    clearInterval(shakeInterval);

    // Reset the cake visually
    cakeButton.classList.remove("holding");
    cakeButton.style.setProperty('--shake-x', '0px');
    cakeButton.style.setProperty('--shake-y', '0px');
    cakeButton.style.setProperty('--scale', '1');

    instruction.innerHTML = "Hold the cake.";
}

// =====================================================
// CELEBRATION SEQUENCE
// =====================================================
function celebrate() {
    // Lock the sequence so user clicks don't break anything anymore
    hasExploded = true; 
    
    clearInterval(shakeInterval);
    
    // Reset cake to center
    cakeButton.classList.remove("holding");
    cakeButton.style.setProperty('--shake-x', '0px');
    cakeButton.style.setProperty('--shake-y', '0px');
    cakeButton.style.setProperty('--scale', '1');

    instruction.innerHTML = "🥳 Surprise!";

    // First confetti burst
    confetti({
        particleCount: 180,
        spread: 90,
        origin: { x: .2, y: .6 }
    });

    // Second burst
    setTimeout(() => {
        confetti({
            particleCount: 180,
            spread: 120,
            origin: { x: .8, y: .6 }
        });
    }, 250);

    // Final huge burst
    setTimeout(() => {
        confetti({
            particleCount: 300,
            spread: 180,
            origin: { y: .4 }
        });
    }, 500);

    // Move to thank-you screen
    setTimeout(() => {
        transitionToThankYou();
    }, 1200);
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
    }, 800);
}

function runMessageSequence() {
    const messages = [
        { title: "🥳 THANK YOU!", text: "" },
        { title: "", text: "Your birthday wishes<br>made Boyd's day." },
        { title: "⚾", text: "After decades<br>behind home plate..." },
        { title: "", text: "Boyd isn't retiring.<br><br>The rules are making him." },
        { title: "", text: "Learn why Boyd should<br>still be behind the plate." }
    ];

    let index = 0;

    function showNext() {
        if (index >= messages.length) {
            revealButton();
            return;
        }

        messageTitle.innerHTML = messages[index].title;
        messageText.innerHTML = messages[index].text;

        messageTitle.classList.remove("fadeIn");
        messageText.classList.remove("fadeIn");

        // Force browser to recalculate so the animation restarts smoothly
        void messageTitle.offsetWidth;

        messageTitle.classList.add("fadeIn");
        messageText.classList.add("fadeIn");

        index++;
        
        // Timer for the next slide
        messageTimer = setTimeout(showNext, 2500);
    }

    showNext();
}

// =====================================================
// BUTTON REVEAL
// =====================================================
function revealButton() {
    petitionButton.style.opacity = "1";
    petitionButton.style.transform = "translateY(0)";
}

// =====================================================
// EVENT LISTENERS
// =====================================================

// Desktop
cakeButton.addEventListener("mousedown", startHolding);
cakeButton.addEventListener("mouseup", stopHolding);
cakeButton.addEventListener("mouseleave", stopHolding);

// Mobile - using `{ passive: false }` to ensure preventDefault() works to stop scrolling
cakeButton.addEventListener("touchstart", startHolding, { passive: false });
cakeButton.addEventListener("touchend", stopHolding);
cakeButton.addEventListener("touchcancel", stopHolding);
