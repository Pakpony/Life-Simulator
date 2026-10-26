/* สอบรายวิชา เกรด กิจกรรม เนื้อเรื่อง ความสำเร็จ และฉากจบ */
(() => {
  const $ = id => document.getElementById(id);
  const examMonths = [2, 4, 7, 9];
  const examNames = {
    2: "สอบกลางภาค · ตุลาคม",
    4: "สอบปลายภาค · ธันวาคม",
    7: "สอบกลางภาค · มีนาคม",
    9: "สอบปลายภาค · พฤษภาคม"
  };

  const prepOptions = [
    { name: "ซื้อชีทสรุป", cost: 180, boost: 5, icon: "📝" },
    { name: "ติวกับเพื่อน", cost: 300, boost: 7, icon: "👥" },
    { name: "จ้างติวเตอร์", cost: 650, boost: 12, icon: "🎓" }
  ];

  const extraActivities = [
    { id: "library", icon: "📚", name: "อ่านหนังสือที่ห้องสมุด", detail: "เพิ่มความเข้าใจวิชาเป้าหมาย", cost: 0, study: 5, joy: 0, energy: 1, friends: 0 },
    { id: "notes", icon: "🗒️", name: "ซื้อชีทสรุป", detail: "ทบทวนบทเรียนให้เข้าใจขึ้น", cost: 150, study: 6, joy: 0, energy: 0, friends: 0 },
    { id: "movie", icon: "🎬", name: "ดูหนังกับเพื่อน", detail: "พักใจและเพิ่มความสุข", cost: 400, study: 0, joy: 7, energy: 2, friends: 4 },
    { id: "sport", icon: "🏸", name: "เล่นกีฬา", detail: "เติมพลังและคลายเครียด", cost: 100, study: 0, joy: 4, energy: 7, friends: 2 },
    { id: "volunteer", icon: "🤝", name: "ทำกิจกรรมอาสา", detail: "พบเพื่อนใหม่และช่วยชุมชน", cost: 250, study: 0, joy: 5, energy: -2, friends: 7 },
    { id: "market", icon: "🍜", name: "เดินตลาดกับเพื่อน", detail: "ลองร้านใหม่ในมหาวิทยาลัย", cost: 280, study: 0, joy: 5, energy: 0, friends: 5 }
  ];

  const stories = [
    {
      title: "รุ่นพี่ชวนเข้ากลุ่มติว",
      text: "รุ่นพี่คณะเดียวกันชวนคุณอ่านหนังสือด้วยกันก่อนสอบ กลุ่มนี้มีชีทสรุปและแบ่งกันอธิบายเนื้อหา",
      choices: [
        { label: "เข้ากลุ่มติว", money: -120, study: 7, joy: 2, friends: 4, energy: -1 },
        { label: "อ่านเองที่ห้องสมุด", money: 0, study: 4, joy: 0, friends: 0, energy: 2 }
      ]
    },
    {
      title: "ชมรมอาสากำลังหาคนช่วย",
      text: "ชมรมชวนคุณไปช่วยจัดกิจกรรมให้ชุมชนใกล้มหาวิทยาลัย คุณมีเวลาว่างหนึ่งวันพอดี",
      choices: [
        { label: "ไปช่วยงาน", money: -180, study: 0, joy: 5, friends: 7, energy: -2 },
        { label: "ช่วยประชาสัมพันธ์แทน", money: 0, study: 0, joy: 2, friends: 3, energy: 1 }
      ]
    },
    {
      title: "งานดนตรีที่ลานกิจกรรม",
      text: "เพื่อนส่งโปสเตอร์งานดนตรีมาให้ดู บัตรราคาไม่แพง แต่พรุ่งนี้คุณมีเรียนเช้า",
      choices: [
        { label: "ไปฟังดนตรีด้วยกัน", money: -350, study: 0, joy: 8, friends: 5, energy: -2 },
        { label: "พักผ่อนแล้วค่อยนัดกันใหม่", money: 0, study: 0, joy: 1, friends: 1, energy: 5 }
      ]
    },
    {
      title: "อาจารย์เปิดห้องแล็บพิเศษ",
      text: "อาจารย์ชวนเข้าฟังสาธิตในห้องแล็บ คุณจะได้เห็นเนื้อหาที่เรียนถูกนำไปใช้จริง",
      choices: [
        { label: "ไปช่วยเตรียมอุปกรณ์", money: 0, study: 6, joy: 2, friends: 2, energy: -3 },
        { label: "ขอเอกสารกลับมาอ่าน", money: 0, study: 3, joy: 0, friends: 0, energy: 1 }
      ]
    },
    {
      title: "ตลาดนัดนนทรี",
      text: "ตลาดนัดในมหาวิทยาลัยมีทั้งของกินและงานทำมือ เพื่อนชวนคุณไปเดินหลังเลิกเรียน",
      choices: [
        { label: "ช่วยเพื่อนขายของ", money: 300, study: 0, joy: 3, friends: 4, energy: -2 },
        { label: "ซื้อของกินแล้วเดินเล่น", money: -250, study: 0, joy: 6, friends: 3, energy: 1 }
      ]
    },
    {
      title: "รุ่นน้องขอคำแนะนำ",
      text: "รุ่นน้องปีหนึ่งถามวิธีปรับตัวกับวิชาเรียน คุณนึกถึงตัวเองในวันแรกที่เพิ่งเข้ามา",
      choices: [
        { label: "ชวนไปคุยและแนะนำทีละเรื่อง", money: -100, study: 0, joy: 4, friends: 6, energy: -1 },
        { label: "ส่งโน้ตที่เคยทำไว้ให้", money: 0, study: 2, joy: 2, friends: 3, energy: 0 }
      ]
    },
    {
      title: "เพื่อนชวนกลับบ้านช่วงหยุดยาว",
      text: "เพื่อนชวนกลับบ้านด้วยกัน เป็นโอกาสได้พักจากหอและเปลี่ยนบรรยากาศ",
      choices: [
        { label: "ไปด้วยกัน", money: -700, study: 0, joy: 7, friends: 3, energy: 8 },
        { label: "อยู่หอพักและจัดตารางอ่านหนังสือ", money: 0, study: 4, joy: 0, friends: 0, energy: 3 }
      ]
    },
    {
      title: "โปรเจกต์กลุ่มเริ่มไม่ลงตัว",
      text: "สมาชิกในกลุ่มเห็นไม่ตรงกันเรื่องแบ่งงาน ขณะที่วันส่งงานใกล้เข้ามา",
      choices: [
        { label: "นัดคุยและแบ่งงานใหม่", money: 0, study: 4, joy: 2, friends: 5, energy: -2 },
        { label: "รับงานเพิ่มเพื่อให้งานเสร็จทัน", money: 0, study: 5, joy: -2, friends: -1, energy: -5 }
      ]
    }
  ];

  const achievements = [
    { id: "first_exam", icon: "📝", name: "ก้าวแรกในห้องสอบ", check: s => s.examRecords.length >= 1 },
    { id: "exam_ace", icon: "🏅", name: "คะแนนสอบโดดเด่น", check: s => s.examRecords.some(e => e.score >= 85) },
    { id: "exam_four", icon: "📚", name: "ผ่านสนามสอบ 4 ครั้ง", check: s => s.examRecords.length >= 4 },
    { id: "story_four", icon: "🌱", name: "มีส่วนร่วมกับแคมปัส", check: s => s.storyCount >= 4 },
    { id: "activity_four", icon: "🎨", name: "ลองใช้ชีวิตหลายแบบ", check: s => s.activityKinds.length >= 4 },
    { id: "saver", icon: "💰", name: "นักวางแผนการเงิน", check: s => s.cash >= 20000 },
    { id: "friends", icon: "💚", name: "มีเพื่อนอยู่ข้าง ๆ", check: () => game.stats.friends >= 80 },
    { id: "honors", icon: "🎓", name: "ผลการเรียนยอดเยี่ยม", check: s => (s.cum || game.stats.gpa) >= 3.5 }
  ];

  const style = document.createElement("style");
  style.textContent = `
    .upgrade-panel{margin-top:14px}
    .upgrade-panel[hidden]{display:none!important}
    .exam-box,.story-box{margin:10px 0;padding:14px;border-radius:16px;background:#fff7d9;border:1px solid #edcf73}
    .exam-box h4,.story-box h4{margin:0 0 5px;color:#745800;font:800 17px var(--serif)}
    .exam-box p,.story-box p{margin:0 0 10px;font-size:14px;line-height:1.6;color:#4c493d}
    .exam-select{width:100%;height:44px;padding:0 10px;border:1px solid var(--line);border-radius:10px;background:white}
    .prep-grid,.story-choices,.extra-activity-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}
    .upgrade-btn{padding:10px;border:1px solid var(--line);border-radius:12px;background:white;color:var(--pine);font:700 13px inherit;cursor:pointer}
    .upgrade-btn:hover:not(:disabled){border-color:var(--sun);background:#fffbea}
    .upgrade-btn:disabled{opacity:.5;cursor:not-allowed}
    .upgrade-btn small{display:block;margin-top:3px;color:var(--muted);font-weight:400}
    .achievement-list{display:grid;gap:6px;margin:8px 0 0;padding:0;list-style:none}
    .achievement-list li{padding:7px 9px;border-radius:10px;background:#f2f4ef;color:#89938c;font-size:13px}
    .achievement-list li.earned{background:var(--sun-soft);color:#735800;font-weight:700}
    .story-box{background:#eef6eb;border-color:#c8ddc4}
    .story-box h4{color:var(--pine)}
    .upgrade-title{margin:16px 0 6px;color:var(--pine);font:800 17px var(--serif)}
    .extra-result{margin-top:14px}
    @media(max-width:560px){.prep-grid,.story-choices,.extra-activity-grid{grid-template-columns:1fr}}
  `;
  document.head.append(style);

  const panel = document.createElement("section");
  panel.className = "panel upgrade-panel";
  panel.id = "upgrade-panel";
  panel.hidden = true;
  panel.innerHTML = `
    <div class="panelhead"><h3>สอบและชีวิตในแคมปัส</h3><span>EXAM · STORY · BADGES</span></div>
    <div class="exam-box" id="exam-action" hidden>
      <h4 id="exam-title"></h4>
      <p id="exam-instructions"></p>
      <select class="exam-select" id="exam-subject"></select>
      <div class="prep-grid" id="exam-prep"></div>
      <button class="upgrade-btn" id="take-exam" type="button" style="width:100%;margin-top:8px"></button>
    </div>
    <div class="story-box" id="story-action" hidden>
      <h4 id="story-title"></h4>
      <p id="story-text"></p>
      <div class="story-choices" id="story-choices"></div>
    </div>
    <h4 class="upgrade-title">กิจกรรมเพิ่มเติม</h4>
    <div class="extra-activity-grid" id="extra-activities"></div>
    <h4 class="upgrade-title">ความสำเร็จ</h4>
    <ul class="achievement-list" id="achievement-list"></ul>
  `;

  const stack = document.querySelector(".stack");
  const journal = document.querySelector(".journalpanel");
  if (stack && journal) stack.insertBefore(panel, journal);

  const extraButtons = extraActivities.map((item, index) => {
    const button = document.createElement("button");
    button.className = "upgrade-btn";
    button.type = "button";
    button.innerHTML = "<strong></strong><small></small>";
    button.querySelector("strong").textContent =
      item.icon + " " + item.name + " · ฿" + item.cost;
    button.querySelector("small").textContent = item.detail;
    button.onclick = () => doExtraActivity(index);
    return button;
  });
  $("extra-activities").append(...extraButtons);

  const prepButtons = prepOptions.map((item, index) => {
    const button = document.createElement("button");
    button.className = "upgrade-btn";
    button.type = "button";
    button.innerHTML = "<strong></strong><small></small>";
    button.querySelector("strong").textContent = item.icon + " " + item.name;
    button.querySelector("small").textContent = "฿" + item.cost + " · เพิ่มความพร้อม";
    button.onclick = () => prepareExam(index);
    return button;
  });
  $("exam-prep").append(...prepButtons);

  function addMoney(sim, label, amount) {
    sim.cash = Math.round((sim.cash + amount) * 100) / 100;
    sim.moneyLog ??= [];
    sim.moneyLog.unshift({ label, amount });
    sim.moneyLog = sim.moneyLog.slice(0, 12);
  }

  function currentCourse(sim) {
    return sim.cs && sim.cs[sim.fi] ? sim.cs[sim.fi] : null;
  }

  function examOpen(sim) {
    return examMonths.includes(sim.m % 12) && !sim.examDone[sim.m];
  }

  function prepareExam(index) {
    const sim = game && game.sim;
    if (!sim || !examOpen(sim) || sim.ev != null) return;

    const option = prepOptions[index];
    const course = currentCourse(sim);
    if (!course || sim.cash < option.cost) return;

    sim.examPrepCount[sim.m] ??= 0;
    if (sim.examPrepCount[sim.m] >= 2) return;

    addMoney(sim, option.name, -option.cost);
    sim.examPrepCount[sim.m]++;

    sim.examPrep[sim.m] ??= {};
    sim.examPrep[sim.m][course.n] =
      (sim.examPrep[sim.m][course.n] || 0) + option.boost;

    course.s = clamp(course.s + option.boost, 0, 100);
    game.stats.energy = clamp(game.stats.energy - 1, 0, 100);

    if (typeof updateStats === "function") updateStats();
    update();
  }

  function takeExam() {
    const sim = game && game.sim;
    if (!sim || !examOpen(sim) || sim.ev != null || sim.cash < 100) return;

    const course = currentCourse(sim);
    if (!course) return;

    addMoney(sim, "ค่าสอบและอุปกรณ์", -100);

    const prep = (sim.examPrep[sim.m] || {})[course.n] || 0;
    const difficulty = (1 - (course.g || 1)) * 6;
    const energyBonus = (game.stats.energy - 50) * 0.12;
    const random = Math.random() * 10 - 5;
    const score = clamp(
      Math.round(course.s + prep * 0.25 + energyBonus - difficulty + random),
      0,
      100
    );

    course.s = clamp(Math.round(course.s * 0.6 + score * 0.4), 0, 100);
    sim.examRecords.push({
      year: Math.floor(sim.m / 12) + 1,
      month: sim.m % 12,
      course: course.n,
      score
    });
    sim.examDone[sim.m] = true;
    game.last = "สอบ " + course.n + " ได้ " + score + " คะแนน";

    if (score >= 85) unlock("exam_ace");

    sim.paused = false;
    const pauseButton = $("pause");
    if (pauseButton) pauseButton.textContent = "⏸ หยุดเวลา";

    if (typeof updateStats === "function") updateStats();
    update();
  }

  $("take-exam").onclick = takeExam;

  function doExtraActivity(index) {
    const sim = game && game.sim;
    if (!sim || sim.ev != null || sim.activityDone || sim.done) return;

    const item = extraActivities[index];
    if (sim.cash < item.cost) return;

    addMoney(sim, item.name, -item.cost);
    sim.activityDone = true;
    sim.activityKinds ??= [];
    if (!sim.activityKinds.includes(item.id)) sim.activityKinds.push(item.id);

    const course = currentCourse(sim);
    if (item.study && course) course.s = clamp(course.s + item.study, 0, 100);

    game.stats.joy = clamp(game.stats.joy + item.joy, 0, 100);
    game.stats.energy = clamp(game.stats.energy + item.energy, 0, 100);
    game.stats.friends = clamp(game.stats.friends + item.friends, 0, 100);
    game.last = "กิจกรรม: " + item.name + " · ใช้เงิน ฿" + item.cost;

    if (typeof updateStats === "function") updateStats();
    update();
  }

  function unlock(id) {
    const sim = game && game.sim;
    if (!sim) return;
    sim.achievements ??= [];
    if (!sim.achievements.includes(id)) sim.achievements.push(id);
  }

  function checkAchievements(sim) {
    achievements.forEach(item => {
      if (item.check(sim)) unlock(item.id);
    });
  }

  function renderAchievements(sim) {
    const list = $("achievement-list");
    list.replaceChildren(...achievements.map(item => {
      const li = document.createElement("li");
      const earned = (sim.achievements || []).includes(item.id);
      li.classList.toggle("earned", earned);
      li.textContent = (earned ? "✓ " : "○ ") + item.icon + " " + item.name;
      return li;
    }));
  }

  function examUpdate(sim) {
    const box = $("exam-action");
    const active = examOpen(sim) && sim.ev == null && !sim.done;

    if (active && !sim.examPauseShown[sim.m]) {
      sim.examPauseShown[sim.m] = true;
      sim.paused = true;
      const pauseButton = $("pause");
      if (pauseButton) pauseButton.textContent = "▶ เล่นต่อ";
    }

    box.hidden = !active;
    if (!active) return;

    const courseSelect = $("exam-subject");
    const key = sim.cs.map(course => course.n).join("|");

    if (courseSelect.dataset.key !== key) {
      courseSelect.dataset.key = key;
      courseSelect.replaceChildren(...sim.cs.map((course, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = course.n + " · เข้าใจ " + Math.round(course.s) + "%";
        return option;
      }));
    }

    courseSelect.value = String(sim.fi || 0);
    $("exam-title").textContent = examNames[sim.m % 12];
    $("exam-instructions").textContent =
      "เลือกวิชาที่จะสอบ จะทบทวนหรือซื้อตัวช่วยก่อนก็ได้ สอบได้หนึ่งวิชาต่อช่วงสอบ";

    courseSelect.onchange = () => {
      sim.fi = Number(courseSelect.value);
      sim.focus = "course";
      update();
    };

    const count = sim.examPrepCount[sim.m] || 0;
    prepButtons.forEach((button, index) => {
      button.disabled =
        sim.cash < prepOptions[index].cost || count >= 2;
    });

    $("take-exam").disabled = sim.cash < 100;
    $("take-exam").textContent =
      sim.cash < 100 ? "เงินไม่พอสำหรับค่าสอบ (฿100)" : "✍️ เข้าสอบ · ใช้ ฿100";
  }

  function showStory(sim) {
    const card = $("story-action");
    const story = sim.storyActive;
    card.hidden = !story;
    if (!story) return;

    $("story-title").textContent = "📖 " + story.title;
    $("story-text").textContent = story.text;

    const buttons = story.choices.map((choice, index) => {
      const button = document.createElement("button");
      button.className = "upgrade-btn";
      button.type = "button";
      button.disabled = choice.money < 0 && sim.cash < -choice.money;
      button.textContent =
        choice.label + (choice.money ? " · " + (choice.money > 0 ? "+" : "−") + "฿" + Math.abs(choice.money) : "");
      button.onclick = () => chooseStory(index);
      return button;
    });

    const host = $("story-choices");
    const key = story.title + sim.m;
    if (host.dataset.key !== key) {
      host.dataset.key = key;
      host.replaceChildren(...buttons);
    }
  }

  function chooseStory(index) {
    const sim = game && game.sim;
    const story = sim && sim.storyActive;
    if (!sim || !story) return;

    const choice = story.choices[index];
    if (choice.money < 0 && sim.cash < -choice.money) return;

    if (choice.money) addMoney(sim, choice.label, choice.money);

    const course = currentCourse(sim);
    if (choice.study && course) course.s = clamp(course.s + choice.study, 0, 100);

    ["joy", "energy", "friends"].forEach(key => {
      game.stats[key] = clamp(game.stats[key] + (choice[key] || 0), 0, 100);
    });

    game.history.push({
      year: Math.floor(sim.m / 12) + 1,
      term: sim.m % 12 < 5 ? 1 : 2,
      title: story.title,
      choice: choice.label
    });

    sim.storyCount++;
    sim.storyActive = null;
    sim.paused = false;
    $("story-choices").dataset.key = "";

    const pauseButton = $("pause");
    if (pauseButton) pauseButton.textContent = "⏸ หยุดเวลา";

    if (typeof updateStats === "function") updateStats();
    update();
  }

  function maybeStartStory(sim) {
    const month = sim.m % 12;
    if (
      sim.done ||
      sim.ev != null ||
      sim.storyActive ||
      examMonths.includes(month) ||
      sim.m === 0 ||
      sim.m % 3 !== 1 ||
      sim.storySeen[sim.m]
    ) return;

    sim.storySeen[sim.m] = true;

    let unused = stories
      .map((story, index) => ({ story, index }))
      .filter(item => !sim.storyUsed.includes(item.index));

    if (!unused.length) {
      sim.storyUsed = [];
      unused = stories.map((story, index) => ({ story, index }));
    }

    const picked = unused[Math.floor(Math.random() * unused.length)];
    sim.storyUsed.push(picked.index);
    sim.storyActive = picked.story;
    sim.paused = true;

    const pauseButton = $("pause");
    if (pauseButton) pauseButton.textContent = "▶ เล่นต่อ";
  }

  function finishExtras(sim) {
    if (!sim.done) return;

    checkAchievements(sim);

    const g = game.stats;
    let ending = {
      label: "เส้นทางของคุณ",
      title: "หนึ่งชีวิต หลายเรื่องราว",
      desc: "คุณสร้างความทรงจำและเลือกเส้นทางของตัวเองตลอดช่วงชีวิตมหาวิทยาลัย"
    };

    if (g.gpa >= 3.7) {
      ending = {
        label: "ดาวเด่นแห่งเกษตร",
        title: "ความพยายามที่ผลิบาน",
        desc: "ผลการเรียนโดดเด่นจากความตั้งใจและการวางแผนของคุณ"
      };
    } else if (sim.examRecords.some(item => item.score >= 90)) {
      ending = {
        label: "มือหนึ่งห้องสอบ",
        title: "วันสอบที่คุณทำได้เต็มที่",
        desc: "การเตรียมตัวทีละวิชาพาคุณทำคะแนนสอบได้อย่างน่าภูมิใจ"
      };
    } else if (g.joy >= 82 && g.friends >= 78) {
      ending = {
        label: "หัวใจของแคมปัส",
        title: "เพื่อนและความทรงจำ",
        desc: "ผู้คนและกิจกรรมทำให้ชีวิตมหาวิทยาลัยของคุณอบอุ่น"
      };
    } else if (sim.cash >= 20000) {
      ending = {
        label: "นักวางแผนการเงิน",
        title: "มีเงินเก็บพร้อมก้าวต่อ",
        desc: "คุณจัดการรายรับและค่าใช้จ่ายจนมีเงินสำรองสำหรับบทต่อไป"
      };
    } else if (g.gpa >= 3.2 && g.joy >= 60 && g.energy >= 50) {
      ending = {
        label: "ชีวิตสมดุล",
        title: "เติบโตทั้งในและนอกห้องเรียน",
        desc: "คุณดูแลการเรียน ความสุข และพลังใจไปพร้อมกัน"
      };
    }

    $("result-title").textContent = ending.title;
    $("result-desc").textContent =
      game.name + " · " + game.path.name + " — " + ending.desc;
    $("final-label").textContent = ending.label;

    if (!$("upgrade-result")) {
      const result = document.createElement("section");
      result.className = "resultpanel extra-result";
      result.id = "upgrade-result";
      result.innerHTML = "<h3>ความสำเร็จที่ปลดล็อก</h3><div></div>";
      const unlocked = achievements.filter(item =>
        (sim.achievements || []).includes(item.id)
      );
      result.lastChild.textContent = unlocked.length
        ? unlocked.map(item => item.icon + " " + item.name).join(" · ")
        : "ลองเล่นอีกครั้งเพื่อปลดล็อกความสำเร็จ";
      $("resultgrid").append(result);
    }
  }

  function update() {
    if (!game || !game.sim) return;

    const sim = game.sim;
    panel.hidden = false;

    sim.examRecords ??= [];
    sim.examDone ??= {};
    sim.examPauseShown ??= {};
    sim.examPrep ??= {};
    sim.examPrepCount ??= {};
    sim.activityKinds ??= [];
    sim.storyCount ??= 0;
    sim.storySeen ??= {};
    sim.storyUsed ??= [];
    sim.achievements ??= [];

    if (sim.done && !$("upgrade-panel").dataset.finalized) {
      $("upgrade-panel").dataset.finalized = "1";
      finishExtras(sim);
    }

    examUpdate(sim);
    showStory(sim);
    checkAchievements(sim);
    renderAchievements(sim);

    extraButtons.forEach((button, index) => {
      button.disabled =
        sim.ev != null ||
        sim.activityDone ||
        sim.done ||
        sim.cash < extraActivities[index].cost;
    });

    if (sim.done) finishExtras(sim);
  }

  /* เกรดเทอมคำนวณจากความเข้าใจรายวิชาและผลสอบ */
  const oldGrade = window.KU.grade;
  window.KU.grade = function () {
    const sim = game && game.sim;
    if (!sim || !sim.cs || !sim.cs.length) return oldGrade.apply(this, arguments);

    const gradePoint = score =>
      score >= 80 ? 4 :
      score >= 75 ? 3.5 :
      score >= 70 ? 3 :
      score >= 65 ? 2.5 :
      score >= 60 ? 2 :
      score >= 55 ? 1.5 :
      score >= 50 ? 1 : 0;

    const letter = score =>
      score >= 80 ? "A" :
      score >= 75 ? "B+" :
      score >= 70 ? "B" :
      score >= 65 ? "C+" :
      score >= 60 ? "C" :
      score >= 55 ? "D+" :
      score >= 50 ? "D" : "F";

    const courseGrades = sim.cs.map(course => ({
      course,
      point: gradePoint(course.s)
    }));

    const average =
      courseGrades.reduce((sum, item) => sum + item.point, 0) /
      courseGrades.length;

    const change = game.stats.gpa - sim.mark;
    const tiredPenalty = game.stats.energy < 25 ? 0.15 : 0;
    const termGpa = Math.round(
      clamp(average + change - tiredPenalty, 0, 4) * 100
    ) / 100;

    sim.mark = game.stats.gpa;
    sim.hist.push(
      courseGrades.map(item =>
        item.course.n + " " + letter(item.course.s)
      ).join(" · ")
    );

    return termGpa;
  };

  const originalStart = window.KU.start;
  window.KU.start = function () {
    $("upgrade-panel").dataset.finalized = "";
    $("upgrade-result")?.remove();

    const result = originalStart.apply(this, arguments);
    const sim = game && game.sim;

    if (sim) {
      sim.examRecords = [];
      sim.examDone = {};
      sim.examPauseShown = {};
      sim.examPrep = {};
      sim.examPrepCount = {};
      sim.activityKinds = [];
      sim.storyCount = 0;
      sim.storySeen = {};
      sim.storyUsed = [];
      sim.storyActive = null;
      sim.achievements = [];
    }

    update();
    return result;
  };

  const oldMonth = window.KU.month;
  window.KU.month = function () {
    const result = oldMonth.apply(this, arguments);
    update();
    return result;
  };

  setInterval(update, 300);
})();