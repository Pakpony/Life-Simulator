/* รวมระบบเงินและช่วงสอบเข้ากับแผงสอบและชีวิตในแคมปัส */
(() => {
  const $ = id => document.getElementById(id);
  const fmt = n => "฿" + Math.round(n).toLocaleString("th-TH");

  const focusCosts = {
    all: -100,
    course: -260,
    fun: -850,
    work: 1600,
    rest: 0
  };

  const focusNames = {
    all: "อ่านทุกวิชา",
    course: "อ่านวิชาเป้าหมาย",
    fun: "ทำกิจกรรม",
    work: "ทำงานพิเศษ",
    rest: "พักผ่อน"
  };

  // เดือนในเกมเริ่มจากสิงหาคม:
  // ส.ค. กลางภาค, ปลาย ต.ค. ปลายภาค,
  // ม.ค. กลางภาค, มี.ค. ปลายภาค
  const exams = {
    0: "ช่วงสอบกลางภาค · เดือน ส.ค.",
    2: "ช่วงสอบปลายภาค · ปลายเดือน ต.ค.",
    5: "ช่วงสอบกลางภาค · เดือน ม.ค.",
    7: "ช่วงสอบปลายภาค · เดือน มี.ค."
  };

  const style = document.createElement("style");
  style.textContent = `
    .budget-panel[hidden]{display:none!important}
    .budget-panel.budget-inline{
      margin:0 0 16px;
      padding:0;
      border:0;
      border-radius:0;
      background:transparent;
      box-shadow:none
    }
    .budget-monthline{
      margin:0 0 8px;
      color:#5a6b63;
      font-size:13px
    }
    .budget-card{
      padding:16px;
      border-radius:18px;
      color:#f4f8ef;
      background:linear-gradient(135deg,#0c3b33,#1f684c)
    }
    .budget-top{
      display:flex;
      justify-content:space-between;
      gap:10px;
      align-items:center
    }
    .budget-top strong{
      color:#f5b50a;
      font-size:25px
    }
    .budget-meta{
      margin:6px 0 10px;
      color:#d1e1d4;
      font-size:13px
    }
    .budget-track{
      height:8px;
      border-radius:99px;
      background:#ffffff30;
      overflow:hidden
    }
    .budget-track i{
      display:block;
      height:100%;
      background:#f5b50a
    }
    .budget-log{
      display:grid;
      gap:5px;
      margin-top:10px
    }
    .budget-row{
      display:flex;
      justify-content:space-between;
      gap:8px;
      color:#dbe9dc;
      font-size:13px
    }
    .budget-row span{
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap
    }
    .budget-row b{flex:none}
    .budget-plus{color:#c9edb8}
    .budget-minus{color:#ffd0c4}
    .budget-exam{
      margin:0 0 10px;
      padding:12px;
      border:1px solid #edcf73;
      border-radius:14px;
      background:#fff7d9;
      color:#5e4a0b;
      font-size:13px;
      line-height:1.6
    }
    .budget-exam strong{
      display:block;
      color:#745800
    }
    .budget-activity-state{
      margin:8px 0 0;
      color:#5a6b63;
      font-size:13px
    }
    .budget-unavailable{
      opacity:.5!important;
      cursor:not-allowed!important
    }
    .choice:disabled{
      opacity:.5;
      cursor:not-allowed
    }
  `;
  document.head.append(style);

  const panel = document.createElement("section");
  panel.className = "panel budget-panel budget-inline";
  panel.hidden = true;
  panel.innerHTML = `
    <div class="budget-monthline" id="budget-month"></div>
    <div class="budget-exam" id="budget-exam" hidden></div>
    <div class="budget-card">
      <div class="budget-top">
        <span>💳 เงินคงเหลือ</span>
        <strong id="budget-balance"></strong>
      </div>
      <p class="budget-meta" id="budget-summary"></p>
      <div class="budget-track"><i id="budget-meter"></i></div>
      <div class="budget-log" id="budget-log"></div>
    </div>
    <p class="budget-activity-state" id="budget-activity-state"></p>
  `;

  function findCampusPanel() {
    return [...document.querySelectorAll(".panel")].find(element => {
      if (element === panel) return false;

      const heading = element.querySelector(".panelhead h3");
      return heading &&
        heading.textContent.includes("สอบและชีวิตในแคมปัส");
    });
  }

  function placeInCampusPanel() {
    const campusPanel = findCampusPanel();
    if (!campusPanel) return false;

    if (!campusPanel.contains(panel)) {
      const header = campusPanel.querySelector(".panelhead");
      if (header) {
        header.insertAdjacentElement("afterend", panel);
      } else {
        campusPanel.prepend(panel);
      }
    }

    bindCampusActivityActions(campusPanel);
    return true;
  }

  // ถ้าแผงกิจกรรมถูกสร้างช้ากว่าไฟล์นี้ ให้ย้ายเงินเข้าไปเมื่อแผงพร้อม
  if (!placeInCampusPanel()) {
    const studyPanel = document.querySelector(".studypanel");
    if (studyPanel) {
      studyPanel.append(panel);
    } else {
      const stack = document.querySelector(".stack");
      const journal = document.querySelector(".journalpanel");
      if (stack && journal) stack.insertBefore(panel, journal);
      else if (stack) stack.append(panel);
    }

    if (document.body) {
      const panelObserver = new MutationObserver(() => {
        if (placeInCampusPanel()) {
          panelObserver.disconnect();
          update();
        }
      });

      panelObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }

  function addMoney(sim, label, amount) {
    sim.cash ??= 0;
    sim.moneyLog ??= [];
    sim.cash = Math.round((sim.cash + amount) * 100) / 100;
    sim.moneyLog.unshift({ label, amount });
    sim.moneyLog = sim.moneyLog.slice(0, 12);
  }

  function getActivityButton(target, campusPanel) {
    const button = target.closest(
      "button, a, [role='button']"
    );

    if (!button || !campusPanel.contains(button)) return null;
    if (panel.contains(button)) return null;

    const text = (button.innerText || button.textContent || "")
      .replace(/\s+/g, " ")
      .trim();

    const match = text.match(/[฿B]\s*([\d,]+)/i);
    if (!match) return null;

    return {
      button,
      text,
      cost: Number(match[1].replace(/,/g, "")) || 0
    };
  }

  function bindCampusActivityActions(campusPanel) {
    if (campusPanel.dataset.budgetActivityBound) return;
    campusPanel.dataset.budgetActivityBound = "1";

    campusPanel.addEventListener("click", event => {
      const activity = getActivityButton(event.target, campusPanel);
      if (!activity) return;

      const sim = game && game.sim;
      if (!sim) return;

      const blocked =
        sim.ev != null ||
        sim.activityDone ||
        sim.done ||
        activityPending;

      if (blocked) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }

      if (sim.cash < activity.cost) {
        event.preventDefault();
        event.stopImmediatePropagation();
        showMessage("เงินไม่พอสำหรับกิจกรรมนี้");
        return;
      }

      activityPending = true;
      activity.button.classList.add("budget-unavailable");

      // รอให้ระบบกิจกรรมเดิมทำงานก่อน แล้วค่อยบันทึกค่าใช้จ่าย
      window.setTimeout(() => {
        activityPending = false;

        if (event.defaultPrevented) {
          activity.button.classList.remove("budget-unavailable");
          update();
          return;
        }

        if (!game || game.sim !== sim) {
          activity.button.classList.remove("budget-unavailable");
          return;
        }

        const label = activity.text
          .replace(/\s*[·•]?\s*[฿B]\s*[\d,]+.*$/i, "")
          .trim() || "กิจกรรมในแคมปัส";

        if (activity.cost > 0) {
          addMoney(sim, label, -activity.cost);
        }

        sim.activityDone = true;
        update();
      }, 0);
    }, true);
  }

  let activityPending = false;

  function showMessage(message) {
    if (game) game.last = message;

    const note = $("lastnote");
    const outcome = $("outcome");

    if (note) note.hidden = false;
    if (outcome) outcome.textContent = message;
  }

  function updateCampusActivityButtons(sim) {
    const campusPanel = findCampusPanel();
    if (!campusPanel) return;

    const unavailable =
      sim.ev != null ||
      sim.activityDone ||
      sim.done ||
      activityPending;

    campusPanel
      .querySelectorAll("button, a, [role='button']")
      .forEach(button => {
        if (panel.contains(button)) return;

        const activity = getActivityButton(button, campusPanel);
        if (!activity) return;

        const cannotAfford = sim.cash < activity.cost;
        button.classList.toggle(
          "budget-unavailable",
          unavailable || cannotAfford || activityPending
        );
        button.setAttribute(
          "aria-disabled",
          String(unavailable || cannotAfford || activityPending)
        );
      });
  }

  function updateCourses(sim) {
    document.querySelectorAll(".studypanel .crs").forEach((row, index) => {
      const course = sim.cs && sim.cs[index];
      if (!course) return;

      const label = row.querySelector(".crn b");
      const bar = row.querySelector(".track i");

      if (label) {
        label.textContent = "ความเข้าใจ " + Math.round(course.s) + "%";
      }

      if (bar) {
        bar.style.width = course.s + "%";
      }

      row.classList.toggle(
        "on",
        sim.focus === "course" && sim.fi === index
      );
    });
  }

  function update() {
    if (!game || !game.sim) return;

    const sim = game.sim;
    panel.hidden = false;
    sim.moneyLog ??= [];
    sim.cash ??= 12000;

    $("budget-balance").textContent = fmt(sim.cash);
    $("budget-month").textContent =
      "ปี " + (Math.floor(sim.m / 12) + 1) +
      " · เดือน " + (sim.m % 12 + 1);

    const focusCost = focusCosts[sim.focus] || 0;
    const focusText = focusCost > 0
      ? "รับ " + fmt(focusCost)
      : focusCost < 0
        ? "ใช้ " + fmt(-focusCost)
        : "ไม่มีค่าใช้จ่ายเพิ่ม";

    $("budget-summary").textContent =
      "ทุน +฿6,500 · ค่าครองชีพ −฿6,000 · " +
      (focusNames[sim.focus] || "โฟกัส") +
      ": " + focusText;

    $("budget-meter").style.width =
      Math.max(0, Math.min(100, sim.cash / 30000 * 100)) + "%";

    const log = $("budget-log");
    const logKey = sim.moneyLog
      .map(item => item.label + item.amount)
      .join("|");

    if (log.dataset.key !== logKey) {
      log.dataset.key = logKey;

      log.replaceChildren(...sim.moneyLog.slice(0, 4).map(item => {
        const row = document.createElement("div");
        const label = document.createElement("span");
        const amount = document.createElement("b");

        row.className = "budget-row";
        label.textContent = item.label;
        amount.className =
          item.amount >= 0 ? "budget-plus" : "budget-minus";
        amount.textContent =
          (item.amount >= 0 ? "+" : "−") +
          fmt(Math.abs(item.amount));

        row.append(label, amount);
        return row;
      }));
    }

    $("budget-activity-state").textContent = sim.activityDone
      ? "ทำกิจกรรมเดือนนี้แล้ว"
      : sim.ev != null
        ? "เลือกกิจกรรมได้หลังตัดสินใจ"
        : "เลือกกิจกรรมจากรายการด้านล่างได้ 1 อย่างต่อเดือน";

    const examBox = $("budget-exam");
    const month = sim.m % 12;
    const examText = exams[month];

    if (examText && sim.cs && sim.cs.length) {
      const target = sim.cs[sim.fi] || sim.cs[0];
      const weakest = [...sim.cs]
        .sort((a, b) => a.s - b.s)
        .slice(0, 2)
        .map(course => course.n)
        .join(" · ");

      examBox.hidden = false;
      examBox.replaceChildren();

      const title = document.createElement("strong");
      const detail = document.createElement("span");

      title.textContent = examText;
      detail.textContent =
        "วิชาเป้าหมาย: " + target.n +
        " · ควรทบทวน: " + weakest;

      examBox.append(title, detail);
    } else {
      examBox.hidden = true;
    }

    updateCourses(sim);
    updateCampusActivityButtons(sim);
    updateFinal(sim);
    decorateChoices();
  }

  function updateFinal(sim) {
    if (!sim.done) return;

    const stats = document.querySelector("#result .finalstats");
    if (!stats || $("final-budget-cash")) return;

    const item = document.createElement("div");
    item.className = "finalstat";
    item.id = "final-budget-cash";
    item.innerHTML = "<span></span><strong></strong>";
    item.querySelector("span").textContent = "เงินคงเหลือ";
    item.querySelector("strong").textContent = fmt(sim.cash);
    stats.append(item);
  }

  function decorateChoices() {
    if (!game || !game.sim) return;

    const choices = events[game.turn] && events[game.turn].o || [];

    document.querySelectorAll(".choice").forEach((button, index) => {
      if (button.dataset.budgetDecorated) return;
      button.dataset.budgetDecorated = "1";

      const points = choices[index]?.[3]?.funds || 0;
      const amount = Math.round(points * 150);
      const detail = button.querySelector("small");

      if (amount !== 0 && detail) {
        detail.textContent += amount < 0
          ? " · ค่าใช้จ่าย " + fmt(-amount)
          : " · รายรับ " + fmt(amount);
      }

      if (amount < 0 && game.sim.cash < -amount) {
        button.disabled = true;
        button.title = "เงินไม่พอสำหรับตัวเลือกนี้";
      }
    });
  }

  const originalStart = window.KU.start;
  window.KU.start = function () {
    const sim = game && game.sim;

    if (sim) {
      $("final-budget-cash")?.remove();
      sim.cash = 12000;
      sim.moneyLog = [];
      sim.activityDone = false;
      activityPending = false;
      addMoney(sim, "เงินตั้งต้น", 12000);
    }

    const result = originalStart.apply(this, arguments);
    placeInCampusPanel();
    update();
    return result;
  };

  const originalMonth = window.KU.month;
  window.KU.month = function () {
    const sim = game && game.sim;

    if (sim) {
      sim.cash ??= 12000;
      sim.moneyLog ??= [];
      sim.activityDone = false;
      activityPending = false;

      addMoney(sim, "เงินสนับสนุนรายเดือน", 6500);
      addMoney(sim, "ค่าครองชีพ · หอ/อาหาร/เดินทาง", -6000);

      const change = focusCosts[sim.focus] || 0;

      if (change < 0 && sim.cash + change < 0) {
        sim.focus = "rest";
        game.last = "งบไม่พอ ระบบเปลี่ยนโฟกัสเดือนนี้เป็นพักผ่อน";
      } else if (change !== 0) {
        addMoney(
          sim,
          change > 0 ? "รายได้งานพิเศษสุทธิ" : "ค่าใช้จ่ายตามโฟกัส",
          change
        );
      }
    }

    const result = originalMonth.apply(this, arguments);
    update();
    return result;
  };

  const originalChoose = window.choose;
  window.choose = function (index) {
    const sim = game && game.sim;
    const event = sim && events[game.turn];
    const option = event && event.o[index];
    const points = option && option[3] && option[3].funds || 0;
    const amount = Math.round(points * 150);

    if (sim && amount < 0 && sim.cash < -amount) {
      showMessage("เงินไม่พอสำหรับตัวเลือกนี้ ลองเลือกทางอื่น");
      return;
    }

    if (sim && amount !== 0) {
      addMoney(sim, option[1], amount);
    }

    const result = originalChoose.apply(this, arguments);
    update();
    return result;
  };

  const choiceBox = $("choices");
  if (choiceBox) {
    new MutationObserver(decorateChoices).observe(choiceBox, {
      childList: true,
      subtree: true
    });
  }

  setInterval(update, 300);
})();