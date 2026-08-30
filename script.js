const CONFIG = {
  // TROQUE estes valores antes de publicar:
  senha: "2512",
  inicioNamoro: "2025-12-25T00:00:00",
  distanciaKm: 525,
  fotos: [
    "assets/photos/foto1.jpeg","assets/photos/foto2.jpeg","assets/photos/foto3.jpeg",
    "assets/photos/foto4.jpeg","assets/photos/foto5.jpeg","assets/photos/foto6.jpeg"
  ],
  musica: "nossa-musica.mp4"
};

const story = `Eu não sei exatamente em que momento você deixou de ser apenas alguém importante...

e passou a ser a minha pessoa favorita.

Talvez tenha sido nas conversas que duravam horas.
Talvez nas risadas.
Talvez nos pequenos detalhes que você provavelmente nem percebe que eu guardo.

Mas hoje eu sei de uma coisa:

eu escolheria você novamente.

Em qualquer distância.
Em qualquer cidade.
Em qualquer versão da nossa história.`;

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function go(id){
  $$(".screen").forEach(s=>s.classList.remove("active"));
  const target = document.getElementById(id);
  if(target) target.classList.add("active");
  window.scrollTo({top:0,behavior:"smooth"});
}
$$("[data-next]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.next)));

$("#login").addEventListener("click",()=>{
  const value = $("#password").value.trim();
  if(value.toLowerCase() === CONFIG.senha.toLowerCase()){
    $("#password-msg").textContent = "✓ Acesso concedido.";
    setTimeout(()=>go("unlocked"),500);
  }else{
    $("#password-msg").textContent = "Senha incorreta... tente lembrar de algo só nosso. ❤️";
    $("#password").animate([{transform:"translateX(-8px)"},{transform:"translateX(8px)"},{transform:"translateX(0)"}],300);
  }
});
$("#password").addEventListener("keydown",e=>{if(e.key==="Enter")$("#login").click()});

let storyIndex=0;
function typeStory(){
  const el=$("#typed-story"); el.textContent="";
  const tick=()=>{
    el.textContent=story.slice(0,storyIndex++);
    if(storyIndex<=story.length){setTimeout(tick,14)}else $("#story-next").classList.remove("hidden");
  }; tick();
}
new MutationObserver(m=>m.forEach(x=>x.target.classList.contains("active")&&x.target.id==="story"&&typeStory()))
  .observe($("#app"),{subtree:true,attributes:true,attributeFilter:["class"]});

function loadPhotos(){
  const grid=$("#photo-grid");
  grid.innerHTML="";
  CONFIG.fotos.forEach((src,i)=>{
    const img=document.createElement("img");
    img.src=src; img.alt=`Momento ${i+1}`;
    img.onerror=()=>{img.outerHTML=`<div class="photo-placeholder">Coloque foto${i+1}.jpg</div>`};
    grid.appendChild(img);
  });
}
loadPhotos();

function updateCounter(){
  const start=new Date(CONFIG.inicioNamoro);
  const now=new Date();
  let diff=Math.max(0,now-start);
  const sec=Math.floor(diff/1000);
  $("#seconds").textContent=sec%60;
  $("#minutes").textContent=Math.floor(sec/60)%60;
  $("#hours").textContent=Math.floor(sec/3600)%24;
  $("#days").textContent=Math.floor(sec/86400);
}
setInterval(updateCounter,1000); updateCounter();
$("#distance-km").textContent=`distância: ${CONFIG.distanciaKm} km`;

let hp=100, fought=false;
$$("[data-choice]").forEach(btn=>btn.addEventListener("click",()=>{
  const choice=btn.dataset.choice;
  const result=$("#battle-result");
  if(choice==="love"){
    hp=0; $("#hp").style.width="0%"; result.innerHTML="VOCÊ ESCOLHEU AMAR ❤️<br>ATAQUE ESPECIAL: CARINHO<br>DANO: ∞<br><br>VITÓRIA! O amor sempre vence.";
    fought=true;
    $("#battle-next").classList.remove("hidden");
  }else if(choice==="talk"){
    hp=Math.max(0,hp-30); $("#hp").style.width=hp+"%"; result.textContent="Você conversou. A distância perdeu parte da força. 💬";
  }else if(choice==="fight"){
    hp=Math.max(0,hp-20); $("#hp").style.width=hp+"%"; result.textContent="Você lutou bravamente! ⚔️";
  }else{
    result.textContent="Você esperou... e descobriu que o amor também sabe ter paciência. ⌛";
  }
  if(hp===0 && !fought){result.innerHTML="DISTÂNCIA DERROTADA! ❤️<br>O amor sempre encontra um caminho."
    $("#battle-next").classList.remove("hidden");
  }
}));
$("#hp").style.width="100%";

let hearts=0;
function spawnHeart(x,y){
  const h=document.createElement("div"); h.className="floating-heart";
  h.textContent=Math.random()>.5?"💜":"🧡";
  h.style.left=x+"px";h.style.top=y+"px";
  $("#heart-layer").appendChild(h);setTimeout(()=>h.remove(),1500);
}
$("#hearts").addEventListener("click",e=>{
  if(e.target.closest("button")) return;
  hearts++;$("#heart-score").textContent=`Amor coletado: ${hearts}`;
  spawnHeart(e.clientX,e.clientY);
});
const audio=$("#audio"), player=$("#musicPlayer");
audio.src=CONFIG.musica;
function formatTime(sec){if(!Number.isFinite(sec))return "0:00";return Math.floor(sec/60)+":"+String(Math.floor(sec%60)).padStart(2,"0")}
$("#playPause").addEventListener("click",async()=>{try{if(audio.paused)await audio.play();else audio.pause()}catch(e){alert("Confira se a música está em assets/music/nossa-musica.mp3")}});
audio.addEventListener("play",()=>{player.classList.add("playing");$("#playPause").textContent="Ⅱ"});
audio.addEventListener("pause",()=>{player.classList.remove("playing");$("#playPause").textContent="▶"});
audio.addEventListener("loadedmetadata",()=>$("#duration").textContent=formatTime(audio.duration));
audio.addEventListener("timeupdate",()=>{$("#currentTime").textContent=formatTime(audio.currentTime);if(audio.duration)$("#progress").value=audio.currentTime/audio.duration*100});
$("#progress").addEventListener("input",e=>{if(audio.duration)audio.currentTime=e.target.value/100*audio.duration});
$("#volume").addEventListener("input",e=>{audio.volume=Number(e.target.value);audio.muted=false;$("#mute").textContent=Number(e.target.value)===0?"🔇":"🔊"});
$("#mute").addEventListener("click",()=>{audio.muted=!audio.muted;$("#mute").textContent=audio.muted?"🔇":"🔊"});
$("#back10").addEventListener("click",()=>audio.currentTime=Math.max(0,audio.currentTime-10));
$("#forward10").addEventListener("click",()=>audio.currentTime=Math.min(audio.duration||Infinity,audio.currentTime+10));
audio.volume=.85;

$("#secret-star").addEventListener("click",()=>{
  $("#egg-text").textContent="Você encontrou uma memória especial. ⭐ Algumas das coisas mais bonitas da nossa história são justamente as que só nós entendemos.";
  $("#egg-next").classList.remove("hidden");
});
$("#open-chest").addEventListener("click",()=>{
  $("#chest-icon").textContent="🎁";
  $("#chest-msg").textContent="Você encontrou a mensagem que eu guardei para você. ❤️";
  setTimeout(()=>go("letter"),900);
});

const canvas=$("#stars"),ctx=canvas.getContext("2d");
let stars=[];
function resize(){canvas.width=innerWidth*devicePixelRatio;canvas.height=innerHeight*devicePixelRatio;ctx.scale(devicePixelRatio,devicePixelRatio);stars=Array.from({length:Math.min(180,innerWidth/5)},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.5+.2,s:Math.random()*.35+.05}))}
function animate(){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  for(const s of stars){s.y+=s.s;if(s.y>innerHeight)s.y=0;ctx.globalAlpha=.25+Math.random()*.6;ctx.fillStyle="#fff";ctx.fillRect(s.x,s.y,s.r,s.r)}
  requestAnimationFrame(animate);
}
addEventListener("resize",resize);resize();animate();

document.addEventListener("keydown",e=>{
  if(e.key.toLowerCase()==="r"){
    spawnHeart(innerWidth/2,innerHeight/2);
  }
});
