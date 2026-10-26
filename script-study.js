/* โหลดหลัง script-time.js: สุ่มคณะ, ลงทะเบียนเรียนรายเทอม, เลือกโฟกัสรายเดือน */
(()=>{
const FAC=[["วิศวกรรมศาสตร์",.2,["แคลคูลัส 1","ฟิสิกส์วิศวกรรม","เขียนโปรแกรมเบื้องต้น","กลศาสตร์วิศวกรรม","วงจรไฟฟ้า","วัสดุวิศวกรรม"]],
["วิทยาศาสตร์",.15,["เคมีทั่วไป","ชีววิทยาเบื้องต้น","ฟิสิกส์ทั่วไป","โครงสร้างข้อมูล","พีชคณิตเชิงเส้น","ปฏิบัติการวิทยาศาสตร์"]],
["เกษตร",.1,["ปฐพีวิทยา","พืชไร่เบื้องต้น","กีฏวิทยา","สรีรวิทยาพืช","พันธุศาสตร์","การจัดการฟาร์ม"]],
["บริหารธุรกิจ",.05,["การบัญชีเบื้องต้น","การตลาด","เศรษฐศาสตร์จุลภาค","การจัดการองค์การ","การเงินธุรกิจ","กฎหมายธุรกิจ"]],
["มนุษยศาสตร์",.05,["ภาษาอังกฤษเพื่อการสื่อสาร","วรรณกรรมไทย","ปรัชญาเบื้องต้น","ประวัติศาสตร์เอเชีย","ภาษาศาสตร์","จิตวิทยาเบื้องต้น"]],
["ประมง",.1,["ชีววิทยาทางน้ำ","การเพาะเลี้ยงสัตว์น้ำ","คุณภาพน้ำ","นิเวศวิทยาทางน้ำ","จุลชีววิทยา","การแปรรูปสัตว์น้ำ"]],
["สัตวแพทยศาสตร์",.25,["กายวิภาคสัตว์","สรีรวิทยาสัตว์","เภสัชวิทยา","พยาธิวิทยา","โภชนศาสตร์สัตว์","ภูมิคุ้มกันวิทยา"]]],
GE=["ภาษาอังกฤษพื้นฐาน","การคิดเชิงวิพากษ์","สุขภาพและการออกกำลังกาย","ดนตรีและชีวิต","ทักษะดิจิทัล","ศาสตร์แห่งแผ่นดิน"],
FO=[["all","📚 ทุกวิชา"],["fun","🎉 กิจกรรม"],["work","💼 งานพิเศษ"],["rest","😴 พักผ่อน"]],
EF={all:[-1.5,-.5,0,0],course:[-2.5,-1,0,0],fun:[-1.5,4,5,-2],work:[-3,-1,-.5,6],rest:[6,3,0,-.5]},
R=a=>a[Math.floor(Math.random()*a.length)],
gp=s=>s>=80?4:s>=75?3.5:s>=70?3:s>=65?2.5:s>=60?2:s>=55?1.5:s>=50?1:0,
LT=g=>({4:"A",3.5:"B+",3:"B",2.5:"C+",2:"C",1.5:"D+",1:"D",0:"F"})[g];
const st=document.createElement("style");
st.textContent=".focusrow{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px}.focusrow button{padding:6px 12px;border:2px solid var(--line);border-radius:99px;background:#fff;color:var(--pine);font-size:14px;font-weight:700}.focusrow .on{background:var(--sun);border-color:var(--sun)}.crs{padding:10px 0;border-top:1px solid var(--line)}.crs.on{margin:0 -8px;padding:10px 8px;border-radius:10px;background:var(--sun-soft)}.crn{display:flex;justify-content:space-between;gap:8px;margin-bottom:6px;font-size:15px;font-weight:500}.crn b{color:var(--muted);font-size:13px}.crs button{margin-top:6px;padding:2px 10px;border:0;border-radius:99px;background:var(--mint);color:var(--pine);font-size:13px;font-weight:700}";
document.head.appendChild(st);
const p=document.createElement("section");p.className="panel studypanel";
p.innerHTML='<div class="panelhead"><h3>วิชาที่ลงเรียน</h3><span id="fac-name"></span></div><p class="fineprint" style="margin:0 0 8px">เลือกโฟกัสของเดือนนี้ ผลจะมีเมื่อสิ้นเดือน</p><div class="focusrow" id="focus-btns"></div><div id="courses"></div>';
document.querySelector(".stack").insertBefore(p,document.querySelector(".journalpanel"));
FO.forEach(([k,l])=>{const b=document.createElement("button");b.type="button";b.dataset.k=k;b.textContent=l;b.onclick=()=>{if(game&&game.sim&&game.sim.cs){game.sim.focus=k;render()}};$("focus-btns").append(b)});
function render(){const s=game&&game.sim;if(!s||!s.cs)return;
$("focus-btns").querySelectorAll("button").forEach(b=>b.classList.toggle("on",b.dataset.k===s.focus));
$("fac-name").textContent="คณะ"+s.fac.n;
$("courses").replaceChildren(...s.cs.map((c,i)=>{const r=document.createElement("div");r.className="crs"+(s.focus==="course"&&s.fi===i?" on":"");
r.innerHTML='<div class="crn"><span></span><b></b></div><div class="track"><i></i></div><button type="button">โฟกัสวิชานี้</button>';
r.querySelector("span").textContent=c.n;r.querySelector("b").textContent="ความเข้าใจ "+Math.round(c.s)+"%";r.querySelector("i").style.width=clamp(c.s,0,100)+"%";
r.querySelector("button").onclick=()=>{s.focus="course";s.fi=i;render()};return r}))}
function enroll(){const s=game.sim,f=s.fac;
const pick=(a,all,n)=>{const q=(a.length>=n?a:all).slice(),r=[];while(r.length<n&&q.length)r.push(q.splice(Math.floor(Math.random()*q.length),1)[0]);return r};
const ns=pick(f.c.filter(x=>!s.taken.has(x)),f.c,4).map(n=>[n,0]).concat(pick(GE.filter(x=>!s.taken.has(x)),GE,1).map(n=>[n,1]));
return ns.map(([n,x])=>{s.taken.add(n);return{n,s:46+Math.random()*10,g:(x?1:1-f.d)*(.75+Math.random()*.25)}})}
window.KU={
start(){const s=game.sim,f=R(FAC);s.fac={n:f[0],d:f[1],c:f[2]};s.taken=new Set();s.hist=[];s.mark=game.stats.gpa;s.focus="all";s.fi=0;s.cs=enroll();
$("path").textContent=game.path.name+" · "+f[0];
game.last="ระบบสุ่มคณะให้คุณแล้ว: คณะ"+f[0]+" และลงทะเบียนเรียน "+s.cs.length+" วิชาในเทอมแรก";
$("lastnote").hidden=false;$("outcome").textContent=game.last;render()},
month(){const s=game.sim,g=game.stats;if(!s.cs)return;
const k=s.m%12,brk=k>=10,F=s.focus,e=.6+g.energy/250,dc=(i,v)=>{const c=s.cs[i];c.s=clamp(c.s+v*c.g*e,0,100)},all=v=>s.cs.forEach((c,i)=>dc(i,v));
if(!brk){if(F==="all")all(5);else if(F==="course"){all(1.5);dc(s.fi,8)}else all(-.5)}
const a=brk&&(F==="all"||F==="course")?[0,0,0,0]:EF[F];
g.energy=clamp(g.energy+a[0],0,100);g.joy=clamp(g.joy+a[1],0,100);g.friends=clamp(g.friends+a[2],0,100);g.funds=clamp(g.funds+a[3],0,100);render()},
grade(){const s=game.sim,g=game.stats,gs=s.cs.map(c=>gp(c.s)),avg=gs.reduce((x,y)=>x+y)/gs.length;
const t=Math.round(clamp(avg+(g.gpa-s.mark)-(g.energy<25?.15:0),0,4)*100)/100;s.mark=g.gpa;
s.hist.push(s.cs.map((c,i)=>c.n+" "+LT(gs[i])).join(" · "));return t},
term(k){const s=game.sim;s.cs=enroll();s.focus="all";game.last=(k===5?game.last+" · ":"")+"ลงทะเบียนเรียนภาคเรียนใหม่ "+s.cs.length+" วิชา";render()}};
const f1=finish;
finish=function(){f1();document.querySelectorAll(".xs2").forEach(e=>e.remove());const s=game.sim,rows=[["คณะ","คณะ"+s.fac.n]].concat(s.hist.map((h,i)=>["เทอม "+(i+1)+" ("+s.terms[i].toFixed(2)+")",h]));
$("log").prepend(...rows.map(([t,x])=>{const r=document.createElement("div");r.className="logrow xs2";r.innerHTML="<time></time><span></span>";r.firstChild.textContent=t;r.lastChild.textContent=x;return r}))};
$("startform").addEventListener("submit",()=>KU.start());
})();
