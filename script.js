const overlay=document.getElementById("overlay");
const main=document.getElementById("main");
const bgVideo=document.getElementById("bg");
const music=document.getElementById("bg-music");
const typed=document.getElementById("typewriter");
const volumeSlider=document.getElementById("volume-slider");
const volumeLabel=document.getElementById("volume-label");

let entered=false;

music.volume=.4;
volumeLabel.textContent="40%";

/* ENTRY */
overlay.addEventListener("click",async()=>{
    if(entered) return;
    entered=true;

    document.body.classList.remove("locked");

    overlay.style.opacity="0";
    setTimeout(()=>overlay.remove(),700);

    bgVideo.style.opacity="1";

    try{await bgVideo.play();}catch{}
    try{await music.play();}catch{}

    main.classList.add("visible");
    document.getElementById("volume-box").classList.add("visible");

    typeEffect();
});

/* Volume */
volumeSlider.addEventListener("input",()=>{
    music.volume=volumeSlider.value/100;
    volumeLabel.textContent=`${volumeSlider.value}%`;
});

/* Typewriter */
let i=0;
const text=typed.dataset.text;
function typeEffect(){
    if(i<text.length){
        typed.innerHTML+=text[i];
        i++;
        setTimeout(typeEffect,75);
    }
}
