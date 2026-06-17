/* ==================================================
   공짜로 다 준다고요? — 개인정보 여정 (비주얼노벨 분기판)
   노드 트리 + 타이핑 대사 + 효과음 + 결과/반전 컷 + PDF
   ================================================== */

/* ---------------- NODE TREE ----------------
   각 노드:
   - bg: 배경(시나리오 이미지)
   - speaker: 'mascot' | 'narrator'
   - left/right: 좌우에 세울 이미지(캐릭터)
   - text: 대사창에 타이핑될 글
   - choices: [{t, c(편리함), e(노출도), next}]
   - result: 선택 직후 결과 컷 텍스트(없으면 생략)
   - 'ending' 노드: {ending:true} 로 결말 처리
--------------------------------------------- */
const NODES = {
  start:{
    bg:"images/6 scenario1.png",
    left:"images/3 player avatar.png", right:"images/4 Allmy.png",
    speaker:"mascot",
    text:"반가워! 나는 AllMy야. 가입만 하면 멋진 사진을 만들어 줄게. 시작이 중요하지~ 어디까지 알려줄래?",
    choices:[
      {t:"이름·이메일만 알려주고 시작한다", c:1, e:0, result:"필요한 정보만 딱 주고 가입했다. AllMy가 살짝 시무룩한 표정이다.", next:"a2"},
      {t:"전화번호·관심사까지 다 주고 시작한다", c:3, e:2, result:"많은 정보를 한 번에 넘겼다. 화려한 환영 효과가 쏟아진다!", next:"b2"},
    ]
  },

  /* ---- 신중 루트 ---- */
  a2:{
    bg:"images/7 scenario2.png",
    left:"images/3 player avatar.png", right:"images/4 Allmy.png",
    speaker:"mascot",
    text:"좋아! 그럼 사진이랑 마이크, 위치도 열어줄래? 그래야 더 멋진 결과가 나오거든!",
    choices:[
      {t:"꼭 필요할 때만 1회 허용으로 막는다", c:1, e:0, result:"권한을 최소한으로 닫아 두었다. 안전하지만 AllMy는 아쉬워한다.", next:"friend"},
      {t:"귀찮으니 사진·마이크·위치 다 항상 허용", c:3, e:2, result:"한 번에 다 열어줬다. 편해진 대신 많은 게 새어 나갈 통로가 열렸다.", next:"friend"},
    ]
  },

  /* ---- 과감 루트 ---- */
  b2:{
    bg:"images/7 scenario2.png",
    left:"images/3 player avatar.png", right:"images/5 Allmy variation.png",
    speaker:"mascot",
    text:"역시 통이 크네! 이왕 이렇게 된 거, 사진·마이크·위치 권한도 전부 ‘항상 허용’ 어때? VIP 기능이 기다리고 있어!",
    choices:[
      {t:"잠깐… 너무 많은 것 같아, 권한을 다시 조인다", c:1, e:1, result:"무언가 이상함을 느끼고 멈칫했다. 권한 일부를 다시 닫았다.", next:"friend"},
      {t:"VIP 욕심에 전부 항상 허용한다", c:4, e:3, result:"모든 권한을 활짝 열었다. 프리미엄 기능이 전부 잠금 해제됐다!", next:"friend"},
    ]
  },

  /* ---- 합류 지점: 친구의 부탁 ---- */
  friend:{
    bg:"images/8 scenario3.png",
    left:"images/3 player avatar.png", right:"images/4 Allmy.png",
    speaker:"mascot",
    text:"친구를 초대하고 단체사진을 올리면… 유료 기능을 평생 무료로 줄게! 어때, 솔깃하지?",
    choices:[
      {t:"내 정보만 쓰고 친구 건 올리지 않는다", c:1, e:0, result:"친구의 정보까지 넘기진 않았다. 나의 선택은 나만 책임진다.", next:"recommend"},
      {t:"내 연락처를 동기화해 친구들을 자동 초대", c:3, e:3, result:"연락처를 통째로 넘겨 친구들을 끌어들였다.", next:"recommend"},
      {t:"친구 단체사진·연락처까지 올려 평생 무료!", c:5, e:5, result:"친구들의 얼굴과 연락처까지 전부 업로드했다. VIP 등급 달성!", next:"recommend"},
    ]
  },

  /* ---- 마지막 질문: 추천의 비밀 ---- */
  recommend:{
    bg:"images/9 scenario4.png",
    left:"images/3 player avatar.png", right:"images/5 Allmy variation.png",
    speaker:"mascot",
    text:"어제 네가 검색한 그 신발 어때? 말 안 했는데도 내가 척척 맞히지? 더 정확하게 해줄까?",
    choices:[
      {t:"“어떻게 알았지?” 데이터 공유를 꺼본다", c:1, e:0, result:"섬뜩함을 느끼고 데이터 공유 설정을 껐다.", next:"ENDING"},
      {t:"신기하니까 그냥 둔다", c:2, e:1, result:"편리함에 익숙해져 그냥 두었다.", next:"ENDING"},
      {t:"더 잘 맞춰주길 바라며 추적에 추가 동의", c:3, e:3, result:"‘추적 정확도 향상’에 동의했다. 이제 앱은 나를 너무 잘 안다.", next:"ENDING"},
    ]
  },
};

const ENDINGS = [
  { min:0, max:4, mood:"good", name:"현명한 디지털 시민", img:"images/15 ending1.png",
    desc:"편리함은 조금 적었지만, 내 정보는 거의 새어나가지 않았어요. 뉴스 속 피해자 명단에 내 이름은 없습니다. 무엇을 내어줄지 스스로 판단한 당신은, 이미 현명한 디지털 시민이에요." },
  { min:5, max:9, mood:"mid", name:"아슬아슬했던 사용자", img:"images/16 ending2.png",
    desc:"편리하게 잘 썼지만, 전화번호와 위치 기록이 광고업체로 넘어가 스팸과 표적 광고가 쏟아집니다. 큰 피해는 면했지만 찜찜한 결말이에요. 다음엔 ‘이 정보를 꼭 줘야 할까?’ 한 번만 더 멈춰볼까요?" },
  { min:10, max:99, mood:"bad", name:"편리함의 대가", img:"images/17 ending3.png",
    desc:"가장 화려하게 즐겼지만, 사진·연락처·위치, 친구들 정보까지 모두 팔렸어요. 사칭 계정과 딥페이크 도용까지 등장합니다. 그 많던 ✨편리함은, 사실 내 정보의 가격이었던 거예요. 한 번 넘긴 정보는 되돌리기 어렵다는 걸 기억해요." },
];

const STEP_TITLE = { start:"가입의 순간", a2:"권한 요청", b2:"권한 요청", friend:"친구의 부탁", recommend:"너무 똑똑한 추천" };

/* ---------------- STATE ---------------- */
let current="start", conv=0, exp=0, step=0, log=[], typing=null;

/* ================= SOUND (Web Audio) ================= */
const Sound=(()=>{
  let ctx=null,muted=false;
  function ac(){ if(!ctx){ try{ctx=new (window.AudioContext||window.webkitAudioContext)();}catch(e){} } return ctx; }
  function tone(f,d,t="sine",g=0.18,delay=0){ if(muted)return; const c=ac(); if(!c)return;
    const t0=c.currentTime+delay,o=c.createOscillator(),gn=c.createGain();
    o.type=t;o.frequency.setValueAtTime(f,t0);gn.gain.setValueAtTime(0,t0);
    gn.gain.linearRampToValueAtTime(g,t0+0.012);gn.gain.exponentialRampToValueAtTime(0.0001,t0+d);
    o.connect(gn);gn.connect(c.destination);o.start(t0);o.stop(t0+d+0.02); }
  function arp(b,s,t="triangle",g=0.16,gap=0.08){ s.forEach((x,i)=>tone(b*Math.pow(2,x/12),0.22,t,g,i*gap)); }
  return {
    resume(){const c=ac(); if(c&&c.state==="suspended")c.resume();},
    setMuted(m){muted=m;}, isMuted(){return muted;},
    type(){ tone(660,0.02,"square",0.03); },
    click(){ tone(420,0.08,"square",0.10); },
    select(){ tone(523,0.10,"triangle",0.14); tone(784,0.12,"triangle",0.10,0.06); },
    reward(l){ if(l<=0)arp(392,[0,4],"sine",0.13,0.09); else if(l===1)arp(440,[0,4,7],"triangle",0.15,0.08);
      else if(l===2)arp(523,[0,4,7,12],"triangle",0.16,0.07); else arp(523,[0,4,7,12,16],"sawtooth",0.16,0.06); },
    tick(){ tone(880,0.04,"square",0.06); },
    alert(){ tone(180,0.5,"sawtooth",0.16); tone(140,0.6,"sawtooth",0.12,0.12); },
    endGood(){ arp(523,[0,4,7,12,16,19],"triangle",0.18,0.12); },
    endMid(){ arp(392,[0,3,7],"sine",0.16,0.14); },
    endBad(){ tone(220,0.5,"sawtooth",0.16); tone(160,0.7,"sawtooth",0.14,0.18); tone(110,0.9,"sawtooth",0.12,0.4); }
  };
})();

/* ---------------- SCREEN HELPERS ---------------- */
function show(id){
  ["screen-start","screen-vn","screen-ending"].forEach(s=>document.getElementById(s).classList.toggle("hidden",s!==id));
  const a=document.getElementById(id); a.classList.remove("screen-in"); void a.offsetWidth; a.classList.add("screen-in");
  window.scrollTo({top:0,behavior:"smooth"});
}
function updateMeter(){ const el=document.getElementById("convVal"); el.textContent=conv;
  el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }

/* ---------------- FLOW ---------------- */
function startGame(){
  Sound.resume(); Sound.click();
  current="start"; conv=0; exp=0; step=0; log=[];
  document.getElementById("convVal").textContent=0;
  document.getElementById("tinyExp").textContent="🔒 ?";
  renderNode();
  show("screen-vn");
}

function typeText(str, done){
  const box=document.getElementById("dialogue");
  if(typing) clearInterval(typing);
  box.textContent="";
  let i=0;
  typing=setInterval(()=>{
    box.textContent=str.slice(0,++i);
    if(i%2===0) Sound.type();
    if(i>=str.length){ clearInterval(typing); typing=null; if(done) done(); }
  },28);
  box.onclick=()=>{ if(typing){ clearInterval(typing); typing=null; box.textContent=str; if(done) done(); } };
}

function renderNode(){
  const n=NODES[current];
  step++;
  document.getElementById("stepTag").textContent = "STEP "+step;
  // scene + characters
  const sc=document.getElementById("vnBg"); sc.style.backgroundImage=`url('${n.bg}')`;
  const L=document.getElementById("charLeft"), R=document.getElementById("charRight");
  L.src=n.left||""; L.style.visibility=n.left?"visible":"hidden";
  R.src=n.right||""; R.style.visibility=n.right?"visible":"hidden";
  document.getElementById("speakerName").textContent = (n.speaker==="mascot")?"AllMy":"나";
  // hide choices until text finishes
  const cw=document.getElementById("vnChoices"); cw.innerHTML=""; cw.classList.add("hidden");
  document.getElementById("nextHint").classList.add("hidden");

  typeText(n.text, ()=>renderChoices(n));
}

function renderChoices(n){
  const cw=document.getElementById("vnChoices");
  cw.innerHTML=""; cw.classList.remove("hidden");
  n.choices.forEach((ch,i)=>{
    const b=document.createElement("button");
    b.className="vn-choice"; b.style.animationDelay=(0.07*i)+"s";
    b.textContent=ch.t;
    b.onmouseenter=()=>Sound.click();
    b.onclick=()=>{ Sound.select(); chooseOption(ch,n); };
    cw.appendChild(b);
  });
}

function chooseOption(ch,n){
  conv+=ch.c; exp+=ch.e;
  log.push({step:STEP_TITLE[current]||"선택", choiceText:ch.t, c:ch.c, e:ch.e});
  updateMeter();
  // result cut + reward
  showResult(ch);
}

function showResult(ch){
  const ov=document.getElementById("resultOverlay");
  const box=document.getElementById("resultBox");
  box.classList.toggle("flashy", ch.e>=3);
  document.getElementById("resultImg").src = ch.e>=3 ? "images/13 reward.png" : "images/4 Allmy.png";
  // reward headline by exposure
  let head;
  if(ch.e===0) head="👍 신중한 선택!";
  else if(ch.e<=2) head="✨ 기능 잠금 해제!";
  else if(ch.e<=4) head="🎨 프리미엄 무료 개방!";
  else head="👑 VIP 등급 달성!";
  document.getElementById("resultHead").textContent=head;
  document.getElementById("resultText").textContent=ch.result||"";
  document.getElementById("resultConv").textContent=`편리함 +${ch.c}`;
  ov.classList.remove("hidden");
  Sound.reward(Math.min(3,ch.e));
  if(ch.e>=3) confetti();

  document.getElementById("resultNext").onclick=()=>{
    Sound.click();
    ov.classList.add("hidden");
    if(ch.next==="ENDING") renderEnding();
    else { current=ch.next; renderNode(); }
  };
}

function getEnding(){ return ENDINGS.find(e=>exp>=e.min&&exp<=e.max)||ENDINGS[ENDINGS.length-1]; }

function renderEnding(){
  const end=getEnding();
  document.getElementById("endingImg").src=end.img;
  document.getElementById("endingName").textContent=end.name;
  document.getElementById("endingDesc").textContent=end.desc;
  document.getElementById("tinyExp").textContent=`🔓 ${exp}`;
  show("screen-ending");

  const news=document.querySelector(".news");
  news.classList.remove("shake"); void news.offsetWidth; news.classList.add("shake");
  Sound.alert();

  const fill=document.getElementById("expFill"), num=document.getElementById("expNum");
  fill.style.width="0%"; num.textContent="0";
  setTimeout(()=>{
    fill.style.width=(exp/15*100)+"%";
    if(exp===0){ afterReveal(end); return; }
    let cur=0;
    const t=setInterval(()=>{ cur++; if(cur>exp){clearInterval(t);afterReveal(end);return;} num.textContent=cur; Sound.tick(); },140);
  },700);

  buildReport(end);
}
function afterReveal(end){ if(end.mood==="good"){Sound.endGood();confetti();} else if(end.mood==="mid"){Sound.endMid();} else {Sound.endBad();} }

function restart(){ Sound.click(); startGame(); }

/* ---------------- CONFETTI ---------------- */
function confetti(){
  const colors=["#F6B93B","#E8504F","#7B5BE0","#3B7DED","#4FAE86"];
  const layer=document.getElementById("confetti"); if(!layer)return;
  for(let i=0;i<26;i++){ const p=document.createElement("span"); p.className="confetti-piece";
    p.style.left=Math.random()*100+"%"; p.style.background=colors[i%colors.length];
    p.style.animationDelay=(Math.random()*0.25)+"s"; p.style.transform=`rotate(${Math.random()*360}deg)`;
    layer.appendChild(p); setTimeout(()=>p.remove(),1600); }
}

/* ---------------- MUTE ---------------- */
function toggleMute(){
  const m=!Sound.isMuted(); Sound.setMuted(m);
  const btn=document.getElementById("muteBtn"); btn.textContent=m?"🔇":"🔊";
  btn.setAttribute("aria-label",m?"소리 켜기":"소리 끄기");
  if(!m){ Sound.resume(); Sound.click(); }
}

/* ---------------- REPORT (PDF) ---------------- */
function buildReport(end){
  const today=new Date();
  const dateStr=`${today.getFullYear()}년 ${today.getMonth()+1}월 ${today.getDate()}일`;
  let worst=log[0]; log.forEach(l=>{ if(l.e>worst.e) worst=l; });
  let feedback;
  if(exp===0) feedback="모든 단계에서 정보를 최소한으로만 내어줬어요. 편리함을 조금 포기하더라도 내 정보를 지키는 선택을 했다는 점이 정말 멋집니다. 이 기준을 일상에서도 그대로 유지해 보세요.";
  else feedback=`가장 많은 정보를 내어준 선택은 ‘${worst.step}’ 단계의 “${worst.choiceText}” 였어요(노출도 +${worst.e}). 다음엔 이 순간에 ‘이 기능을 위해 꼭 이 정보까지 줘야 할까?’ 하고 한 번만 멈춰 생각해 보면, 같은 편리함을 더 안전하게 누릴 수 있어요.`;

  const rows=log.map((l,i)=>`
    <div class="r-row"><div class="s">STEP ${i+1}. ${l.step}</div>
      <div class="q">선택: ${l.choiceText}</div>
      <div class="e">이 선택의 정보 노출도 &nbsp;+${l.e}</div></div>`).join("");

  document.getElementById("report").innerHTML=`
    <div class="r-head"><img src="images/4 Allmy.png" alt=""><h2>나의 개인정보 여정 리포트</h2></div>
    <div class="r-meta"><span>이름: <span class="name-line">&nbsp;</span></span><span>${dateStr}</span></div>
    <div class="r-totals">
      <div class="tcard c"><div class="k">최종 편리함</div><div class="v">${conv}</div></div>
      <div class="tcard e"><div class="k">최종 정보 노출도</div><div class="v">${exp} <span style="font-size:16px;color:#B9B2A6;">/15</span></div></div>
    </div>
    ${rows}
    <div class="r-verdict"><div class="vt">결말: ${end.name}</div><div class="vd">${end.desc}</div></div>
    <div class="r-feedback"><b>💡 다음을 위한 한 마디</b><br>${feedback}</div>
    <div class="r-foot">‘공짜로 다 준다고요? — 개인정보 여정’ · AI 윤리 교육 게임</div>`;
}

async function downloadReport(){
  Sound.click();
  const btn=document.getElementById("pdfBtn"); const original=btn.textContent;
  btn.textContent="리포트 만드는 중…"; btn.disabled=true;
  try{
    const canvas=await html2canvas(document.getElementById("report"),{scale:2,backgroundColor:"#ffffff",useCORS:true});
    const imgData=canvas.toDataURL("image/png");
    const { jsPDF }=window.jspdf; const pdf=new jsPDF("p","mm","a4");
    const pageW=210,pageH=297,imgW=pageW,imgH=canvas.height*imgW/canvas.width;
    let left=imgH,pos=0; pdf.addImage(imgData,"PNG",0,pos,imgW,imgH); left-=pageH;
    while(left>0){ pos-=pageH; pdf.addPage(); pdf.addImage(imgData,"PNG",0,pos,imgW,imgH); left-=pageH; }
    pdf.save("나의_개인정보_여정_리포트.pdf");
  }catch(err){ alert("리포트를 만드는 중 문제가 생겼어요. 인터넷 연결을 확인하고 다시 시도해 주세요."); console.error(err); }
  finally{ btn.textContent=original; btn.disabled=false; }
}

window.addEventListener("pointerdown",()=>Sound.resume(),{once:true});
