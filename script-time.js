/* โหลดหลัง script-addon.js: เวลาเดินจริง 1 เดือน = 7 วินาที, เกรดออกหลังจบเทอม, สุ่มคนในมหาลัย, ตั้งจำนวนปีได้ */
(()=>{
const MO=["ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค.","ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค."],
LB={joy:"ความสุข",energy:"พลังใจ",friends:"เพื่อน",funds:"เงิน"},
NM=["ใบตอง","เมฆ","พลอย","ภู","แพรว","ต้น","มะลิ","ก้อง","น้ำฝน","ธีร์","ฟ้า","เอิร์ธ"],
RL=["เพื่อนร่วมห้อง","รุ่นพี่ปี 4","รุ่นน้องปี 1","อาจารย์ที่ปรึกษา","เพื่อนชมรม","เพื่อนร่วมกลุ่ม","พี่จากหอพัก"],
PL=["โรงอาหาร","ห้องสมุดกลาง","ใต้ต้นนนทรี","หน้าตึกคณะ","ลานหน้าหอ","ป้ายรถราง"],
AMB=["วันธรรมดาในแคมปัส เรียน กินข้าว แล้วเดินผ่านต้นนนทรีเหมือนทุกวัน","เสียงรถรางวิ่งผ่านหน้าตึก ขณะที่คุณทบทวนบทเรียนและปล่อยให้เวลาเดินไป","ห้องสมุดกลางเงียบสงบ มีแต่เสียงพลิกหน้ากระดาษและพัดลมหมุนเบา ๆ","เพื่อน ๆ ทยอยเดินผ่านพร้อมแก้วกาแฟ วันนี้ยังไม่มีอะไรเร่งด่วน","แสงบ่ายส่องผ่านทางเดินหน้าคณะ คุณมีเวลาหายใจก่อนเรื่องใหม่จะเข้ามา"],
EY=[0,1,1,1,2,2,2,3,3,4,4],FIN=11,
R=a=>a[Math.floor(Math.random()*a.length)],
yr=()=>Math.floor(game.sim.m/12)+1,mm=()=>game.sim.m%12,tm=()=>mm()<5?1:2,oldRT=renderTurn;
const st=document.createElement("style");
st.textContent=".simbar{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:14px}.simbar button{min-height:36px;padding:0 14px;border:2px solid #ffffff55;border-radius:99px;background:transparent;color:#fff;font-weight:700;font-size:15px}.simbar .on{background:var(--sun);border-color:var(--sun);color:var(--pine)}.simopts{display:flex;gap:12px;flex-wrap:wrap}.simopts select{display:block;height:50px;padding:0 10px;border:2px solid var(--line);border-radius:12px;background:#fbfdf9;font-size:16px}";
document.head.appendChild(st);
const mt=document.querySelector(".meta span");if(mt)mt.textContent="◷ 1 เดือน = 7 วินาที · ปรับความเร็วได้";
const o=document.createElement("div");o.className="simopts";
o.innerHTML='<div><label for="yrs">ช่วงเวลา</label><select id="yrs"><option value="1">1 ปี</option><option value="2">2 ปี</option><option value="3">3 ปี</option><option value="4" selected>4 ปี</option></select></div><div><label for="spd0">ความเร็ว</label><select id="spd0"><option value="0.5">ช้า 0.5×</option><option value="1" selected>ปกติ 1×</option><option value="2">เร็ว 2×</option><option value="4">เร็วมาก 4×</option></select></div>';
const f=$("startform");f.insertBefore(o,f.querySelector("button"));
const bar=document.createElement("div");bar.className="simbar";bar.innerHTML='<button type="button" id="pause"></button>';
bar.firstChild.onclick=()=>{if(game&&game.sim){game.sim.paused=!game.sim.paused;hud()}};
[0.5,1,2,4].forEach(v=>{const b=document.createElement("button");b.type="button";b.className="spd";b.dataset.v=v;b.textContent=v+"×";b.onclick=()=>{if(game&&game.sim){game.sim.spd=v;hud()}};bar.append(b)});
document.querySelector(".storybar").append(bar);
function hud(){const s=game.sim,k=mm();
$("semester").textContent="ปี "+yr()+" · "+MO[k]+" · "+(k<5?"เทอม 1":k<10?"เทอม 2":"ปิดเทอม");
$("counter").textContent="เดือน "+Math.min(s.m+1,s.T)+" / "+s.T;
$("progress").style.width=(s.m+s.acc/7000)/s.T*100+"%";
document.querySelectorAll(".spd").forEach(b=>b.classList.toggle("on",+b.dataset.v===s.spd));
$("pause").textContent=s.paused?"▶ เล่นต่อ":"⏸ หยุดเวลา"}
function chips(){const b=$("lastnote"),old=b.querySelector(".chips");if(old)old.remove();
const d=game.delta||{},ks=Object.keys(d);if(!ks.length)return;
const c=document.createElement("div");c.className="chips";
ks.forEach(k=>{const v=d[k],e=document.createElement("span");e.className="chip "+(v>0?"up":"down");e.textContent=LB[k]+" "+(v>0?"+":"−")+Math.abs(Math.round(v));c.append(e)});b.append(c)}
function idle(){const k=mm();
$("chapter").textContent=k<5?"ภาคเรียนที่ 1":k<10?"ภาคเรียนที่ 2":"ปิดเทอม";
$("event-title").textContent=MO[k]+" · ชีวิตดำเนินต่อไป";$("event-body").textContent=R(AMB);
$("choices").replaceChildren();$("lastnote").hidden=!game.last;$("outcome").textContent=game.last||"";
chips();updateStats();renderJournal();hud()}
function showEvent(i){const s=game.sim;s.ev=i;s.used[i]=(s.used[i]||0)+1;game.turn=i;oldRT();hud();
$("event-body").textContent=R(NM)+" ("+R(RL)+") เดินเข้ามาทักที่"+R(PL)+"\n\n"+$("event-body").textContent}
function pick(){const s=game.sim,f=s.m/s.T;let c=[];
for(let i=1;i<=10;i++)if(Math.abs(f-(EY[i]-.5)/4)<.3)c.push(i);
if(!c.length)c=[1,2,3,4,5,6,7,8,9,10];
const mn=Math.min(...c.map(i=>s.used[i]||0));return R(c.filter(i=>(s.used[i]||0)===mn))}
function grade(){const s=game.sim,g=game.stats,t=window.KU?KU.grade():Math.round(clamp(g.gpa+(g.energy-50)/300,0,4)*100)/100;
s.terms.push(t);s.cum=Math.round(s.terms.reduce((a,b)=>a+b)/s.terms.length*100)/100;
game.last="🎓 ผลเกรดภาคเรียนที่ "+s.terms.length+" ออกแล้ว: "+t.toFixed(2)+" · เกรดเฉลี่ยสะสม "+s.cum.toFixed(2);game.delta={}}
function month(){const s=game.sim,g=game.stats,brk=mm()>=10;
g.energy=clamp(g.energy+(brk?2.5:-1),0,100);g.funds=clamp(g.funds-(brk?.4:.8),0,100);g.joy=clamp(g.joy-.3,0,100);
if(window.KU)KU.month();s.m++;game.points.push({joy:g.joy,energy:g.energy});
const k=mm();if(k===5||k===10)grade();if(window.KU&&(k===0||k===5))KU.term(k);
if(s.m===s.T-1)showEvent(FIN);
else if(Math.random()<(k>=10?.2:.35))showEvent(pick());
else idle()}
choose=function(i){const s=game.sim,m=events[s.ev],c=m.o[i],b4={...game.stats};
Object.entries(c[3]).forEach(([k,v])=>game.stats[k]=k==="gpa"?Math.round(clamp(game.stats[k]+v,0,4)*100)/100:clamp(game.stats[k]+v,0,100));
const d={};Object.keys(c[3]).forEach(k=>{if(k==="gpa")return;const x=game.stats[k]-b4[k];if(Math.abs(x)>=.5)d[k]=x});
game.history.push({year:yr(),term:tm(),title:m.t,choice:c[1]});game.last=c[4];game.delta=d;
const fin=s.ev===FIN;s.ev=null;
if(fin){s.done=true;finish()}else idle()};
const us=updateStats;
updateStats=function(){us();if(game&&game.sim){const s=game.sim;$("gpa").textContent=s.cum==null?"—":s.cum.toFixed(2);
const sm=document.querySelector(".gpa small");if(sm)sm.textContent=s.cum==null?"ประกาศหลังจบเทอมแรก":"อัปเดตเมื่อจบแต่ละเทอม"}};
const fin0=finish;
finish=function(){game.stats.gpa=game.sim.cum;fin0();
document.querySelectorAll(".xs").forEach(e=>e.remove());
const fs=document.querySelector(".finalstats");
[["ความสุข","joy"],["พลังใจ","energy"],["เพื่อนและกิจกรรม","friends"],["เงินใช้ได้","funds"]].forEach(([l,k])=>{const d=document.createElement("div");d.className="finalstat xs";d.innerHTML="<span></span><strong></strong>";d.firstChild.textContent=l;d.lastChild.textContent=Math.round(game.stats[k])+"%";fs.append(d)});
const h=document.createElement("div");h.className="logrow xs";h.innerHTML="<time>เกรดรายเทอม</time><span></span>";
h.lastChild.textContent=game.sim.terms.map(x=>x.toFixed(2)).join(" → ");$("log").prepend(h);
const Y=game.sim.Y;[...$("graph").querySelectorAll("text")].filter(t=>/^Y\d$/.test(t.textContent)).forEach((t,i)=>{if(i>=Y)t.remove();else t.setAttribute("x",(38+i*424/Y).toFixed(0))})};
f.addEventListener("submit",()=>{const Y=+$("yrs").value;
game.sim={m:0,T:12*Y,Y,acc:0,spd:+$("spd0").value,paused:false,ev:null,used:{},terms:[],cum:null,done:false};
showEvent(0)});
setInterval(()=>{if(!game||!game.sim||game.sim.done||game.sim.ev!=null||game.sim.paused||$("game").hidden)return;
const s=game.sim;s.acc+=100*s.spd;if(s.acc>=7000){s.acc-=7000;month()}if(!s.done&&s.ev==null)hud()},100);
})();