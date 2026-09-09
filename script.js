const memories = [
  { name: "cuando vino a la casa de mis abuelos.jpg", description: "Un recuerdo especial de cuando vino a la casa de mis abuelos." },
  { name: "foto con mi perro oddy.jpg", description: "Un momento con Oddy que también forma parte de nuestra historia." },
  { name: "Foto de la casa de minecraft.jpg", description: "Nuestra construcción dentro de Minecraft." },
  { name: "foto graciosa de los dos.jpg", description: "Una de esas fotos que nos hacen reír cada vez que la vemos." },
  { name: "nuestra primera historia juntos.jpg", description: "Un recuerdo de nuestra primera historia juntos." },
  { name: "primera juntada.jpg", description: "Nuestra primera juntada." },
  { name: "primera mascota en miecraft.jpg", description: "Nuestra primera mascota en Minecraft." },
  { name: "segunda vez que vino a casa.jpg", description: "La segunda vez que vino a casa." },
  { name: "Te amo morocha colorada cartel de minecraft.jpg", description: "Un mensaje de amor dentro de nuestro mundo de Minecraft." },
  { name: "ultima foto que nos sacamos.jpg", description: "La última foto que nos sacamos." }
];

const loadingScreen = document.querySelector("#loadingScreen");
const startScreen = document.querySelector("#startScreen");
const world = document.querySelector("#world");
const loadingFill = document.querySelector("#loadingFill");
const enterBtn = document.querySelector("#enterBtn");
const exploreBtn = document.querySelector("#exploreBtn");
const backBtn = document.querySelector("#backBtn");
const memoryGrid = document.querySelector("#memoryGrid");
const progressBar = document.querySelector("#progressBar");
const progressText = document.querySelector("#progressText");
const chestBtn = document.querySelector("#chestBtn");
const secretMessage = document.querySelector("#secretMessage");
const musicBtn = document.querySelector("#musicBtn");
const bgMusic = document.querySelector("#bgMusic");
const lightbox = document.querySelector("#lightbox");
const lightboxImg = document.querySelector("#lightboxImg");
const lightboxTitle = document.querySelector("#lightboxTitle");
const lightboxLabel = document.querySelector("#lightboxLabel");
let currentPhoto = 0;
let musicOn = false;

const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const photoPath = file => "fotos/" + encodeURIComponent(file).replace(/%2F/g, "/");

function renderMemories(){
  memoryGrid.innerHTML = memories.map((m,i) => `
    <article class="memory-card" data-index="${i}">
      <div class="memory-photo">
        <img src="${photoPath(m.name)}" alt="${esc(m.name)}" loading="lazy"
             onerror="this.style.opacity='.15'; this.insertAdjacentHTML('afterend','<div style=&quot;position:absolute;inset:0;display:grid;place-items:center;padding:20px;text-align:center;font-weight:800&quot;>Falta colocar esta foto en la carpeta <b>fotos</b>.</div>')">
      </div>
      <div class="memory-info">
        <h3>${esc(removeExt(m.name))}</h3>
        <p>${esc(m.description)}</p>
        <button class="photo-btn" type="button">🔎 VER RECUERDO</button>
      </div>
    </article>
  `).join("");

  document.querySelectorAll(".memory-card").forEach(card=>{
    card.querySelector(".photo-btn").addEventListener("click",()=>openPhoto(Number(card.dataset.index)));
    card.querySelector("img").addEventListener("click",()=>openPhoto(Number(card.dataset.index)));
  });
}
function removeExt(name){return name.replace(/\.[^/.]+$/,"")}

function openPhoto(index){
  currentPhoto=index;
  const m=memories[currentPhoto];
  lightboxImg.src=photoPath(m.name);
  lightboxImg.alt=m.name;
  lightboxTitle.textContent=removeExt(m.name);
  lightboxLabel.textContent=`RECUERDO ${currentPhoto+1} / ${memories.length}`;
  lightbox.classList.remove("hidden");
  document.body.style.overflow="hidden";
}
function closePhoto(){
  lightbox.classList.add("hidden");
  document.body.style.overflow="";
}
function changePhoto(step){
  currentPhoto=(currentPhoto+step+memories.length)%memories.length;
  openPhoto(currentPhoto);
}

function updateProgress(){
  const memoriesTop=document.querySelector("#memories").getBoundingClientRect().top + window.scrollY;
  const max=Math.max(document.body.scrollHeight-window.innerHeight,1);
  const pct=Math.min(100,Math.max(0,Math.round((window.scrollY/max)*100)));
  progressBar.style.width=pct+"%";
  progressText.textContent=pct+"%";
}
function createParticles(){
  const holder=document.querySelector("#particles");
  for(let i=0;i<28;i++){
    const p=document.createElement("span");
    p.textContent=Math.random()>.5?"♥":"✦";
    p.style.position="fixed"; p.style.left=Math.random()*100+"vw"; p.style.top=Math.random()*100+"vh";
    p.style.zIndex="60"; p.style.pointerEvents="none"; p.style.opacity=(.2+Math.random()*.45).toFixed(2);
    p.style.fontSize=(8+Math.random()*12)+"px";
    p.style.animation=`floatParticle ${5+Math.random()*6}s linear ${-Math.random()*8}s infinite`;
    holder.appendChild(p);
  }
}
const style=document.createElement("style");
style.textContent="@keyframes floatParticle{0%{transform:translateY(20px) rotate(0);opacity:0}20%{opacity:.5}100%{transform:translateY(-110px) rotate(180deg);opacity:0}}";
document.head.appendChild(style);

function startWorld(){
  startScreen.classList.add("hidden");
  world.classList.remove("hidden");
  window.scrollTo({top:0,behavior:"instant"});
  createParticles();
  updateProgress();
}
enterBtn.addEventListener("click",startWorld);
exploreBtn.addEventListener("click",()=>document.querySelector("#memories").scrollIntoView({behavior:"smooth"}));
backBtn.addEventListener("click",()=>document.querySelector("#worldTop").scrollIntoView({behavior:"smooth"}));

chestBtn.addEventListener("click",()=>{
  chestBtn.classList.toggle("open");
  secretMessage.classList.toggle("hidden");
  if(!secretMessage.classList.contains("hidden")) secretMessage.scrollIntoView({behavior:"smooth",block:"center"});
});

musicBtn.addEventListener("click", async ()=>{
  if (musicOn) {
    bgMusic.pause();
    musicOn = false;
    musicBtn.textContent = "🎵 Música";
    return;
  }

  try {
    // Esperamos a que el navegador termine de cargar el archivo.
    if (bgMusic.readyState < 2) {
      bgMusic.load();
      await new Promise((resolve, reject) => {
        const ok = () => { cleanup(); resolve(); };
        const fail = () => { cleanup(); reject(new Error("No se pudo cargar el MP3")); };
        const cleanup = () => {
          bgMusic.removeEventListener("canplay", ok);
          bgMusic.removeEventListener("error", fail);
        };
        bgMusic.addEventListener("canplay", ok, {once:true});
        bgMusic.addEventListener("error", fail, {once:true});
      });
    }

    bgMusic.volume = 0.35;
    await bgMusic.play();
    musicOn = true;
    musicBtn.textContent = "🔊 Silenciar";
  } catch (error) {
    console.error("Error con la música:", error);
    musicBtn.textContent = "❌ Revisá cancion.mp3";
    setTimeout(() => {
      musicBtn.textContent = "🎵 Música";
    }, 3000);
  }
});

document.querySelector("#closeLightbox").addEventListener("click",closePhoto);
document.querySelector("#prevPhoto").addEventListener("click",()=>changePhoto(-1));
document.querySelector("#nextPhoto").addEventListener("click",()=>changePhoto(1));
lightbox.addEventListener("click",e=>{if(e.target===lightbox)closePhoto()});
document.addEventListener("keydown",e=>{
  if(lightbox.classList.contains("hidden"))return;
  if(e.key==="Escape")closePhoto();
  if(e.key==="ArrowLeft")changePhoto(-1);
  if(e.key==="ArrowRight")changePhoto(1);
});

let touchStartX=0;
lightbox.addEventListener("touchstart",e=>touchStartX=e.changedTouches[0].screenX,{passive:true});
lightbox.addEventListener("touchend",e=>{
  const dx=e.changedTouches[0].screenX-touchStartX;
  if(Math.abs(dx)>50)changePhoto(dx<0?1:-1);
},{passive:true});

window.addEventListener("scroll",()=>{
  updateProgress();
  document.querySelectorAll(".memory-card").forEach(card=>{
    if(card.getBoundingClientRect().top < window.innerHeight*.88) card.classList.add("visible");
  });
},{passive:true});

renderMemories();

let progress=0;
const timer=setInterval(()=>{
  progress+=10;
  loadingFill.style.width=progress+"%";
  if(progress>=100){
    clearInterval(timer);
    setTimeout(()=>{
      loadingScreen.classList.add("hidden");
      startScreen.classList.remove("hidden");
    },350);
  }
},120);
