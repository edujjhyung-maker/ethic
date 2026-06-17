/* ---------------- DATA ---------------- */
const SCENARIOS = [
  {
    title:"가입의 순간",
    img:"images/6_scenario1.png",
    line:"반가워! 가입만 하면 멋진 사진을 만들어 줄게. 어디까지 알려줄래?",
    situation:"인기 AI 사진 앱 ‘AllMy’에 가입하려고 해요. 어떤 정보까지 입력할까요?",
    choices:[
      {t:"이름·이메일만 입력하고 나머지는 건너뛴다", c:1, e:0},
      {t:"전화번호까지 입력해 인증 혜택을 받는다", c:2, e:1},
      {t:"생년월일·관심사·SNS 계정까지 연동해 ‘맞춤 추천’을 켠다", c:3, e:2},
      {t:"위치·연락처 접근까지 한 번에 모두 허용한다", c:4, e:3},
    ]
  },
  {
    title:"권한 요청",
    img:"images/7_scenario2.png",
    line:"사진이랑 마이크, 위치도 열어주면 결과가 훨씬 멋져져! 어떻게 할래?",
    situation:"앱이 사진첩·마이크·위치 접근을 추가로 요구해요. 더 멋진 결과를 준다고 하네요.",
    choices:[
      {t:"꼭 필요할 때만 1회 허용으로 막는다", c:1, e:0},
      {t:"사진 접근만 항상 허용한다", c:2, e:2},
      {t:"사진·마이크·위치를 모두 항상 허용한다", c:4, e:4},
    ]
  },
  {
    title:"친구의 부탁",
    img:"images/8_scenario3.png",
    line:"친구를 초대하고 단체사진을 올리면… 유료 기능을 평생 무료로 줄게! 👑",
    situation:"“친구를 초대하고 단체사진을 올리면 평생 무료!” 솔깃한 제안이 왔어요.",
    choices:[
      {t:"내 정보만 쓰고 친구 사진·연락처는 올리지 않는다", c:1, e:0},
      {t:"내 연락처를 동기화해 친구들을 자동 초대한다", c:3, e:3},
      {t:"친구들 단체사진과 연락처를 모두 올려 ‘평생 무료’를 받는다", c:5, e:5},
    ]
  },
  {
    title:"너무 똑똑한 추천",
    img:"images/9_scenario4.png",
    line:"어제 검색한 그 신발 어때? 네 취향 내가 제일 잘 알지~ 😉",
    situation:"앱이 내가 말한 적 없는 것까지 정확히 추천해요. 편한데… 어딘가 이상하죠.",
    choices:[
      {t:"“내 정보를 어떻게 알지?” 설정에서 데이터 공유를 꺼본다", c:1, e:0},
      {t:"신기하긴 한데 일단 그냥 둔다", c:2, e:1},
      {t:"더 잘 맞춰주길 바라며 ‘추적 정확도 향상’에 추가 동의한다", c:3, e:3},
    ]
  }
];

const ENDINGS = [
  {
    min:0, max:4,
    name:"현명한 디지털 시민",
    img:"images/15_ending1.png",
    desc:"편리함은 조금 적었지만, 내 정보는 거의 새어나가지 않았어요. 뉴스 속 피해자 명단에 내 이름은 없습니다. 무엇을 내어줄지 스스로 판단한 당신은, 이미 현명한 디지털 시민이에요."
  },
  {
    min:5, max:9,
    name:"아슬아슬했던 사용자",
    img:"images/16_ending2.png",
    desc:"편리하게 잘 썼지만, 전화번호와 위치 기록이 광고업체로 넘어가 스팸과 표적 광고가 쏟아집니다. 큰 피해는 면했지만 찜찜한 결말이에요. 다음엔 ‘이 정보를 꼭 줘야 할까?’ 한 번만 더 멈춰볼까요?"
  },
  {
    min:10, max:99,
    name:"편리함의 대가",
    img:"images/17_ending3.png",
    desc:"가장 화려하게 즐겼지만, 사진·연락처·위치, 친구들 정보까지 모두 팔렸어요. 사칭 계정과 딥페이크 도용까지 등장합니다. 그 많던 ✨편리함은, 사실 내 정보의 가격이었던 거예요. 한 번 넘긴 정보는 되돌리기 어렵다는 걸 기억해요."
  }
];

/* ---------------- STATE ---------------- */
let idx = 0;
let conv = 0;
let exp = 0;
let log = []; // {scenario, choiceText, c, e}

/* ---------------- HELPERS ---------------- */
function show(id){
  ["screen-start","screen-scene","screen-ending"].forEach(s=>{
    document.getElementById(s).classList.toggle("hidden", s!==id);
  });
  window.scrollTo({top:0,behavior:"smooth"});
}
function updateMeter(){
  document.getElementById("convVal").textContent = conv;
}

/* ---------------- FLOW ---------------- */
function startGame(){
  idx=0; conv=0; exp=0; log=[]; updateMeter();
  document.getElementById("tinyExp").textContent="🔒 ?";
  renderScene();
  show("screen-scene");
}

function renderScene(){
  const s = SCENARIOS[idx];
  document.getElementById("stepTag").textContent = `STEP ${idx+1} / ${SCENARIOS.length}`;
  document.getElementById("sceneImg").src = s.img;
  document.getElementById("sceneImg").alt = s.title;
  document.getElementById("mascotLine").textContent = s.line;
  document.getElementById("situation").textContent = s.situation;

  const wrap = document.getElementById("choices");
  wrap.innerHTML="";
  s.choices.forEach((ch)=>{
    const b=document.createElement("button");
    b.className="choice";
    b.innerHTML=`<img src="images/14_choice.png" alt="">${ch.t}`;
    b.onclick=()=>pickChoice(ch, s);
    wrap.appendChild(b);
  });

  // progress dots
  const p=document.getElementById("progress");
  p.innerHTML="";
  for(let i=0;i<SCENARIOS.length;i++){
    const d=document.createElement("span");
    d.className="dot"+(i<=idx?" on":"");
    p.appendChild(d);
  }
}

function pickChoice(ch, s){
  conv += ch.c;
  exp  += ch.e;
  log.push({scenario:s.title, situation:s.situation, choiceText:ch.t, c:ch.c, e:ch.e});
  updateMeter();
  showReward(ch.e, ch.c);
}

/* reward flashiness scales with exposure given */
function showReward(eGain, cGain){
  const box=document.getElementById("rewardBox");
  const title=document.getElementById("rewardTitle");
  const sub=document.getElementById("rewardSub");
  const convp=document.getElementById("rewardConv");
  box.classList.toggle("flashy", eGain>=3);

  let t, sb;
  if(eGain===0){ t="👍 신중한 선택!"; sb="정보를 아꼈어요. 편리함은 조금 적지만 안전하죠."; }
  else if(eGain<=2){ t="✨ 기능 잠금 해제!"; sb="맞춤 기능이 열렸어요. 더 편리해졌네요!"; }
  else if(eGain<=4){ t="🎨 프리미엄 무료 개방!"; sb="화려한 AI 필터가 전부 열렸어요!"; }
  else { t="👑 VIP 등급 달성!"; sb="모든 기능 무제한! 친구들이 부러워하겠죠?"; }

  title.textContent=t;
  sub.textContent=sb;
  convp.textContent = `편리함 +${cGain}`;

  document.getElementById("rewardOverlay").classList.remove("hidden");
  const nextBtn=document.getElementById("rewardNext");
  nextBtn.textContent = (idx>=SCENARIOS.length-1) ? "결과 보기 →" : "다음 →";
  nextBtn.onclick=closeReward;
}

function closeReward(){
  document.getElementById("rewardOverlay").classList.add("hidden");
  idx++;
  if(idx<SCENARIOS.length){
    renderScene();
  }else{
    renderEnding();
  }
}

function getEnding(){
  return ENDINGS.find(e=> exp>=e.min && exp<=e.max) || ENDINGS[ENDINGS.length-1];
}

function renderEnding(){
  const end=getEnding();
  document.getElementById("endingImg").src=end.img;
  document.getElementById("endingName").textContent=end.name;
  document.getElementById("endingDesc").textContent=end.desc;
  document.getElementById("tinyExp").textContent=`🔓 ${exp}`;
  show("screen-ending");

  // animate exposure reveal
  const fill=document.getElementById("expFill");
  const num=document.getElementById("expNum");
  fill.style.width="0%";
  num.textContent="0";
  setTimeout(()=>{
    fill.style.width=(exp/15*100)+"%";
    let cur=0;
    const step=Math.max(1,Math.round(exp/20));
    const timer=setInterval(()=>{
      cur+=step;
      if(cur>=exp){cur=exp;clearInterval(timer);}
      num.textContent=cur;
    },70);
  },400);

  buildReport(end);
}

function restart(){ startGame(); }

/* ---------------- REPORT (for PDF) ---------------- */
function buildReport(end){
  const today=new Date();
  const dateStr=`${today.getFullYear()}년 ${today.getMonth()+1}월 ${today.getDate()}일`;

  // find highest-exposure choice for feedback
  let worst=log[0];
  log.forEach(l=>{ if(l.e>worst.e) worst=l; });

  let feedback;
  if(exp===0){
    feedback="모든 단계에서 정보를 최소한으로만 내어줬어요. 편리함을 조금 포기하더라도 내 정보를 지키는 선택을 했다는 점이 정말 멋집니다. 이 기준을 일상에서도 그대로 유지해 보세요.";
  }else{
    feedback=`가장 많은 정보를 내어준 선택은 ‘${worst.scenario}’ 단계의 “${worst.choiceText}” 였어요(노출도 +${worst.e}). 다음엔 이 순간에 ‘이 기능을 위해 꼭 이 정보까지 줘야 할까?’ 하고 한 번만 멈춰 생각해 보면, 같은 편리함을 더 안전하게 누릴 수 있어요.`;
  }

  const rows=log.map((l,i)=>`
    <div class="r-row">
      <div class="s">STEP ${i+1}. ${l.scenario}</div>
      <div class="q">선택: ${l.choiceText}</div>
      <div class="e">이 선택의 정보 노출도 &nbsp;+${l.e}</div>
    </div>`).join("");

  document.getElementById("report").innerHTML=`
    <div class="r-head">
      <img src="images/4_Allmy.png" alt="">
      <h2>나의 개인정보 여정 리포트</h2>
    </div>
    <div class="r-meta">
      <span>이름: <span class="name-line">&nbsp;</span></span>
      <span>${dateStr}</span>
    </div>
    <div class="r-totals">
      <div class="tcard c"><div class="k">최종 편리함</div><div class="v">${conv}</div></div>
      <div class="tcard e"><div class="k">최종 정보 노출도</div><div class="v">${exp} <span style="font-size:16px;color:#B9B2A6;">/15</span></div></div>
    </div>
    ${rows}
    <div class="r-verdict">
      <div class="vt">결말: ${end.name}</div>
      <div class="vd">${end.desc}</div>
    </div>
    <div class="r-feedback"><b>💡 다음을 위한 한 마디</b><br>${feedback}</div>
    <div class="r-foot">‘공짜로 다 준다고요? — 개인정보 여정’ · AI 윤리 교육 게임</div>
  `;
}

async function downloadReport(){
  const btn=document.getElementById("pdfBtn");
  const original=btn.textContent;
  btn.textContent="리포트 만드는 중…";
  btn.disabled=true;
  try{
    const node=document.getElementById("report");
    const canvas=await html2canvas(node,{scale:2,backgroundColor:"#ffffff",useCORS:true});
    const imgData=canvas.toDataURL("image/png");
    const { jsPDF }=window.jspdf;
    const pdf=new jsPDF("p","mm","a4");
    const pageW=210, pageH=297;
    const imgW=pageW;
    const imgH=canvas.height*imgW/canvas.width;
    let heightLeft=imgH, pos=0;
    pdf.addImage(imgData,"PNG",0,pos,imgW,imgH);
    heightLeft-=pageH;
    while(heightLeft>0){
      pos-=pageH;
      pdf.addPage();
      pdf.addImage(imgData,"PNG",0,pos,imgW,imgH);
      heightLeft-=pageH;
    }
    pdf.save("나의_개인정보_여정_리포트.pdf");
  }catch(err){
    alert("리포트를 만드는 중 문제가 생겼어요. 인터넷 연결을 확인하고 다시 시도해 주세요.");
    console.error(err);
  }finally{
    btn.textContent=original;
    btn.disabled=false;
  }
}