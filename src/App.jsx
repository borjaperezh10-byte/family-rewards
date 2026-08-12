import { useState, useEffect, useCallback, useRef } from "react";
import { db, FAMILY_ID } from "./firebase";
import { ref, onValue, set, update } from "firebase/database";

const APP_ICON = "data:image/png;base64,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";

/* fondos servidos desde /themes (ver public/themes) */

/* ---------- Design tokens (v2 — childish look) ----------
  Bubblegum #FF6FA5   Sunshine  #FFC93C   Sky  #4FC3E8
  Grass     #6FCF97   Grape     #A78BFA   Cream bg #FFF8EF
  Miss/none #F4A9A0   Empty grey #E9E4F5
  Display font: "Fredoka" (bouncy, rounded, playful — reads instantly as a kids' app)
  Body font: "Nunito Sans"
  Signature element: the star-path — a rainbow trail of paw prints for streaks,
  plus a star piggy-bank counter that doubles as the currency for the reward shop.
------------------------------------------------------------- */

const BADGES = [
  { days: 3, name: "Explorador", icon: "🥾" },
  { days: 7, name: "Aventurero", icon: "🎒" },
  { days: 14, name: "Montañista", icon: "⛰️" },
  { days: 30, name: "Leyenda", icon: "🏆" },
];

// Medals/achievements the child can unlock. Each has a check(stats) predicate.
const ACHIEVEMENTS = [
  { id: "first", name: "¡Primera tarea!", icon: "🌟", desc: "Completa tu primera tarea", check: (s) => s.totalApproved >= 1 },
  { id: "streak3", name: "Explorador", icon: "🥾", desc: "3 días seguidos", check: (s) => s.bestStreak >= 3 },
  { id: "week", name: "Semana completa", icon: "📅", desc: "7 días seguidos", check: (s) => s.bestStreak >= 7 },
  { id: "streak14", name: "Montañista", icon: "⛰️", desc: "14 días seguidos", check: (s) => s.bestStreak >= 14 },
  { id: "month", name: "Mes completo", icon: "🏆", desc: "30 días seguidos", check: (s) => s.bestStreak >= 30 },
  { id: "tasks10", name: "Manos a la obra", icon: "💪", desc: "10 tareas hechas", check: (s) => s.totalApproved >= 10 },
  { id: "tasks50", name: "Súper ayudante", icon: "🦸", desc: "50 tareas hechas", check: (s) => s.totalApproved >= 50 },
  { id: "tasks100", name: "Centenario", icon: "💯", desc: "100 tareas hechas", check: (s) => s.totalApproved >= 100 },
  { id: "coins50", name: "Hucha llena", icon: "🐷", desc: "50 monedas ganadas", check: (s) => s.totalEarned >= 50 },
  { id: "coins100", name: "Tesoro", icon: "💰", desc: "100 monedas ganadas", check: (s) => s.totalEarned >= 100 },
];

const CHILD_COLORS = ["#FF6FA5", "#4FC3E8", "#6FCF97", "#FFC93C"];
const CHILD_EMOJIS = ["🦄", "🐼", "🦊", "🐸", "🐵", "🐧"];
const WEEKDAY_LABELS = ["L", "M", "X", "J", "V", "S", "D"];

const PRESET_TASKS = [
  { title: "Hacer la cama", points: 1, frequency: { type: "daily" } },
  { title: "Recoger los juguetes", points: 1, frequency: { type: "daily" } },
  { title: "Deberes del cole", points: 2, frequency: { type: "daily" } },
  { title: "Poner la mesa", points: 1, frequency: { type: "daily" } },
  { title: "Cepillarse los dientes", points: 1, frequency: { type: "daily" } },
];

const PRESET_REWARDS = [
  { title: "Elegir la peli de la noche", cost: 10, icon: "🎬" },
  { title: "30 minutos extra de pantalla", cost: 15, icon: "📱" },
  { title: "Elegir el postre", cost: 5, icon: "🍦" },
  { title: "Quedarse despierto 15 min más", cost: 8, icon: "🌙" },
];

function pad(n) { return String(n).padStart(2, "0"); }

function todayKey(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function dayOfWeek(dateKey) {
  return new Date(dateKey + "T12:00:00").getDay();
}

function uid() { return Math.random().toString(36).slice(2, 10); }

function getDeviceId() {
  if (typeof window === "undefined") return "srv";
  try {
    let id = localStorage.getItem("fr-device-id");
    if (!id) { id = Math.random().toString(36).slice(2); localStorage.setItem("fr-device-id", id); }
    return id;
  } catch (e) { return "dev"; }
}
const DEVICE_ID = getDeviceId();

// --- Media helpers (used by the deployed Firebase build) ---
// Uploaded images are stored separately from the main state blob so they persist
// reliably and never get wiped by a state update. State keeps "media:<id>" refs.
function hydratePhotos(dataObj, byId) {
  if (!dataObj) return dataObj;
  const fix = (arr) => {
    if (!Array.isArray(arr)) return;
    for (const it of arr) {
      if (it && typeof it.photo === "string" && it.photo.indexOf("media:") === 0) {
        it.photo = byId[it.photo.slice(6)] || null;
      }
    }
  };
  fix(dataObj.children); fix(dataObj.tasks); fix(dataObj.rewards); fix(dataObj.challenges);
  return dataObj;
}

function dehydratePhotos(dataObj, media, mediaUpdates) {
  const conv = (photo) => {
    if (!photo || typeof photo !== "string") return photo;
    if (photo.indexOf("data:") === 0) {
      let id = media.byData[photo];
      if (!id) {
        id = uid() + Date.now().toString(36);
        media.byData[photo] = id;
        media.byId[id] = photo;
        mediaUpdates["media/" + id] = photo;
      }
      return "media:" + id;
    }
    return photo;
  };
  const fix = (arr) => { if (Array.isArray(arr)) for (const it of arr) { if (it) it.photo = conv(it.photo); } };
  fix(dataObj.children); fix(dataObj.tasks); fix(dataObj.rewards); fix(dataObj.challenges);
  return dataObj;
}

function fileToResizedDataUrl(file, maxSize = 220, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => reject(new Error("No se pudo leer la imagen"));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error("No se pudo leer el archivo"));
    reader.readAsDataURL(file);
  });
}

function isTaskDueOn(task, dateKey) {
  const f = task.frequency || { type: "daily" };
  if (f.type === "daily") return true;
  if (f.type === "weekly") return (f.days || []).includes(dayOfWeek(dateKey));
  if (f.type === "date") return f.date === dateKey;
  return true;
}

function tasksDueOn(tasks, dateKey) {
  return tasks.filter((t) => t.active && isTaskDueOn(t, dateKey));
}

function computeStreak(logs, tasks, graceDays = 0) {
  let streak = 0;
  let offset = 0;
  let grace = graceDays; // "comodines": missed days we can skip without breaking the streak
  const dueToday = tasksDueOn(tasks, todayKey(0));
  if (dueToday.length > 0) {
    const todayLog = logs[todayKey(0)] || {};
    const complete = dueToday.every((t) => todayLog[t.id] === "approved");
    if (!complete) offset = -1; // today not finished yet: count from yesterday, no penalty
  } else {
    offset = -1;
  }
  let guard = 0;
  while (guard < 500) {
    guard++;
    const dateKey = todayKey(offset);
    const due = tasksDueOn(tasks, dateKey);
    if (due.length === 0) { offset -= 1; continue; }
    const dayLog = logs[dateKey] || {};
    const complete = due.every((t) => dayLog[t.id] === "approved");
    if (complete) {
      streak += 1;
      offset -= 1;
    } else if (grace > 0) {
      grace -= 1; // spend a comodín on this missed day
      offset -= 1;
    } else {
      break;
    }
  }
  return streak;
}

function nextMilestone(streak) {
  return BADGES.find((b) => b.days > streak) || null;
}

function pendingForChild(data, childId) {
  const items = [];
  for (const [dateKey, dayLog] of Object.entries(data.logs)) {
    for (const [taskId, status] of Object.entries(dayLog)) {
      if (status === "pending") {
        const task = data.tasks.find((t) => t.id === taskId && t.childId === childId);
        if (task) items.push({ dateKey, task });
      }
    }
  }
  items.sort((a, b) => (a.dateKey < b.dateKey ? -1 : 1));
  return items;
}

function upcomingForChild(tasks, today, days = 6) {
  const out = [];
  for (let offset = 1; offset <= days; offset++) {
    const dateKey = todayKey(offset);
    const due = tasksDueOn(tasks, dateKey);
    if (due.length > 0) out.push({ dateKey, tasks: due });
  }
  return out;
}

// Counts missed tasks (due on a past day, never approved and not waiting) since each task was created.
// Each miss costs the coins the task was worth.
function computeMissed(data, childId, today) {
  let missed = 0;
  let coins = 0;
  const tasks = data.tasks.filter((t) => t.childId === childId);
  for (const task of tasks) {
    const worth = task.points ?? 1;
    if (worth <= 0) continue; // family responsibilities have no coins, so no penalty
    const start = task.createdDate || today; // legacy tasks: no penalty for days before this change
    for (let offset = 1; offset <= 120; offset++) {
      const dateKey = todayKey(-offset);
      if (dateKey < start) break; // going further back than creation, stop
      if (!isTaskDueOn(task, dateKey)) continue;
      const status = (data.logs[dateKey] || {})[task.id];
      if (status !== "approved" && status !== "pending") {
        missed += 1;
        coins += worth;
      }
    }
  }
  return { missed, coins };
}

function bonusCoins(data, childId) {
  return (data.bonuses || []).filter((b) => b.childId === childId).reduce((s, b) => s + (b.coins || 0), 0);
}

function computeBalance(data, childId) {
  let earned = 0;
  for (const dayLog of Object.values(data.logs)) {
    for (const [taskId, status] of Object.entries(dayLog)) {
      if (status === "approved") {
        const task = data.tasks.find((t) => t.id === taskId);
        if (task && task.childId === childId) earned += task.points ?? 1;
      }
    }
  }
  earned += bonusCoins(data, childId);
  const redemptions = data.redemptions || [];
  const approvedSpent = redemptions.filter((r) => r.childId === childId && r.status === "approved").reduce((s, r) => s + r.cost, 0);
  const pendingReserved = redemptions.filter((r) => r.childId === childId && r.status === "pending").reduce((s, r) => s + r.cost, 0);
  const settings = data.settings || {};
  const penalty = settings.penaltyEnabled ? computeMissed(data, childId, todayKey(0)) : { missed: 0, coins: 0 };
  let available = earned - approvedSpent - pendingReserved - penalty.coins;
  if (available < 0) available = 0; // suelo: nunca baja de 0
  return { earned, penaltyCoins: penalty.coins, missedCount: penalty.missed, available };
}

function computeStats(data, childId) {
  let totalApproved = 0;
  let totalEarned = 0;
  for (const dayLog of Object.values(data.logs)) {
    for (const [taskId, status] of Object.entries(dayLog)) {
      if (status === "approved") {
        const task = data.tasks.find((t) => t.id === taskId);
        if (task && task.childId === childId) { totalApproved += 1; totalEarned += task.points ?? 1; }
      }
    }
  }
  totalEarned += bonusCoins(data, childId);
  const graceDays = (data.settings && data.settings.graceDays) || 0;
  const tasksForChild = data.tasks.filter((t) => t.childId === childId && t.active);
  const currentStreak = computeStreak(data.logs, tasksForChild, graceDays);
  const bestStreak = Math.max(currentStreak, (data.records && data.records[childId]) || 0);
  return { totalApproved, totalEarned, currentStreak, bestStreak };
}

function earnedAchievements(data, childId) {
  const stats = computeStats(data, childId);
  return ACHIEVEMENTS.filter((a) => a.check(stats)).map((a) => a.id);
}

function dayStatus(tasks, logs, dateKey, todayStr) {
  const due = tasksDueOn(tasks, dateKey);
  if (due.length === 0) return "empty";
  const dayLog = logs[dateKey] || {};
  const statuses = due.map((t) => dayLog[t.id]);
  if (statuses.every((s) => s === "approved")) return "full";
  if (statuses.some((s) => s === "approved" || s === "pending")) return "partial";
  if (dateKey > todayStr) return "future";
  return "none";
}

function dayProgress(data, childId) {
  const tasks = data.tasks.filter((t) => t.childId === childId && t.active);
  const due = tasksDueOn(tasks, todayKey(0));
  const log = data.logs[todayKey(0)] || {};
  const total = due.length;
  const done = due.filter((t) => log[t.id] === "approved").length;
  const pending = total - done;
  const pct = total ? Math.round((done / total) * 100) : 0;
  return { done, total, pending, pct };
}

// ---- Sound + confetti (works in-app and once deployed) ----
let _audioCtx = null;
function playChime(kind) {
  try {
    if (typeof window === "undefined") return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    _audioCtx = _audioCtx || new AC();
    const ctx = _audioCtx;
    const now = ctx.currentTime;
    const notes = kind === "big" ? [523.25, 659.25, 783.99, 1046.5]
      : kind === "success" ? [523.25, 659.25, 783.99]
      : [659.25];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const t = now + i * 0.09;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.3);
    });
  } catch (e) { /* audio unavailable */ }
}

const CONFETTI_COLORS = ["#FF6FA5", "#4FC3E8", "#6FCF97", "#FFC93C", "#A78BFA"];

const THEMES = {
  default: { label: "✨ Normal", tint: null, confetti: ["🎉", "⭐", "🎊", "🌟", "✨"] },
  unicorn: { label: "🦄 Unicornios", tint: "#F3E9FF", confetti: ["🦄", "🌈", "⭐", "💖", "👑", "✨"] },
  princess: { label: "👑 Princesas", tint: "#FDE8F3", confetti: ["👑", "🌸", "🌹", "💖", "✨", "🦋"] },
  football: { label: "⚽ Fútbol", tint: "#E4F3EA", confetti: ["⚽", "🏆", "🥅", "👟", "🎽", "🔥"] },
  cars: { label: "🚗 Coches", tint: "#E7EDFB", confetti: ["🚗", "🏎️", "🏁", "🛞", "💨", "🏆"] },
};
function themeOf(child) {
  return child && child.theme && THEMES[child.theme] ? child.theme : "default";
}

const PRAISE_MESSAGES = [
  "¡Muy bien hecho! 🌟", "¡Estamos súper orgullosos de ti! 💛", "¡Eres un crack! 🎉",
  "¡Qué bien lo has hecho! 👏", "¡Buen trabajo, campeón/a! 🏆", "¡Así se hace! 💪",
  "¡Increíble esfuerzo! ✨", "¡Nos encanta tu ayuda! 🤗", "¡Sigue así, lo estás petando! 🚀",
  "¡Eres una estrella! ⭐", "¡Qué responsable eres! 🙌", "¡Chócala, lo has clavado! ✋",
  "¡Cada día lo haces mejor! 🌈", "¡Un diez para ti! 💯", "¡Gracias por ayudar tanto! 💖",
];

const PRAISE_ANIMS = [
  ["💛", "🌟", "✨", "💫"],
  ["🎉", "🎊", "🥳", "🎈"],
  ["⭐", "🌟", "✨", "💫"],
  ["👏", "🙌", "👍", "💪"],
  ["🌈", "🦋", "🌸", "☁️"],
  ["🎈", "🎉", "💖", "🎊"],
  ["🔥", "⚡", "💥", "🌟"],
  ["💖", "💛", "💙", "💚"],
];

function Coin({ lg }) {
  return <span className={"fr-coin" + (lg ? " fr-coin-lg" : "")} aria-label="moneda" />;
}

function Confetti({ theme = "default", emojis = null }) {
  const set = emojis && emojis.length ? emojis : (THEMES[theme] || THEMES.default).confetti;
  const pieces = Array.from({ length: 42 });
  return (
    <div className="fr-confetti">
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.25;
        const dur = 1.3 + Math.random() * 1.1;
        const size = 18 + Math.random() * 16;
        return <span key={i} className="fr-confetti-emoji" style={{ left: left + "%", fontSize: size, animationDelay: delay + "s", animationDuration: dur + "s" }}>{set[i % set.length]}</span>;
      })}
    </div>
  );
}

export default function FamilyRewardsApp() {
  const [ready, setReady] = useState(false);
  const [data, setData] = useState(null);
  const [mode, setMode] = useState("kid");
  const [activeChildId, setActiveChildId] = useState(null);
  const [kidTab, setKidTab] = useState("hoy");
  const [parentTab, setParentTab] = useState("aprobaciones");
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [showPinGate, setShowPinGate] = useState(false);
  const [celebration, setCelebration] = useState(null);
  const [editingFamilyName, setEditingFamilyName] = useState(false);
  const [familyNameDraft, setFamilyNameDraft] = useState("");
  const [burst, setBurst] = useState(false);
  const [notifyOn, setNotifyOn] = useState(typeof window !== "undefined" && localStorage.getItem("fr-notify") === "1");
  const mediaRef = useRef({ byId: {}, byData: {} });
  const lastEventTsRef = useRef(null);
  const [burstTheme, setBurstTheme] = useState("default");
  const [burstEmojis, setBurstEmojis] = useState(null);
  const [celebQueue, setCelebQueue] = useState([]);
  const lastPraiseAnimRef = useRef(null);

  function celebrateBurst(kind, theme = "default", emojis = null) {
    playChime(kind);
    setBurstTheme(theme);
    setBurstEmojis(emojis);
    setBurst(true);
    setTimeout(() => setBurst(false), 1600);
  }

  useEffect(() => {
    const r = ref(db, "families/" + FAMILY_ID);
    const unsub = onValue(
      r,
      (snap) => {
        const val = snap.val();
        if (val && val.state) {
          try {
            const media = val.media || {};
            mediaRef.current.byId = { ...media };
            mediaRef.current.byData = {};
            for (const k in media) mediaRef.current.byData[media[k]] = k;
            const parsed = JSON.parse(val.state);
            hydratePhotos(parsed, mediaRef.current.byId);
            setData(parsed);
            setActiveChildId((prev) => prev || parsed.children[0]?.id || null);
          } catch (e) {
            console.error("Estado corrupto", e);
          }
        } else {
          setData(null);
        }
        setReady(true);
      },
      (err) => {
        console.error("Error de Realtime Database:", err);
        setReady(true);
      }
    );
    return () => unsub();
  }, []);

  const save = useCallback(async (next) => {
    setData(next);
    try {
      const clone = structuredClone(next);
      const mediaUpdates = {};
      dehydratePhotos(clone, mediaRef.current, mediaUpdates);
      const updates = { state: JSON.stringify(clone), updatedAt: Date.now(), ...mediaUpdates };
      await update(ref(db, "families/" + FAMILY_ID), updates);
    } catch (e) {
      console.error("No se pudo guardar", e);
    }
  }, []);

  function showLocalNotification(body) {
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    try {
      if (navigator.serviceWorker && navigator.serviceWorker.ready) {
        navigator.serviceWorker.ready.then((reg) => reg.showNotification("Family Rewards", { body, icon: APP_ICON }));
      } else {
        new Notification("Family Rewards", { body, icon: APP_ICON });
      }
    } catch (e) { console.error(e); }
  }

  function enableNotifications() {
    if (!("Notification" in window)) {
      alert("Este dispositivo no admite notificaciones. En iPhone/iPad recuerda anadir la app a la pantalla de inicio primero.");
      return;
    }
    Notification.requestPermission().then((perm) => {
      if (perm === "granted") {
        localStorage.setItem("fr-notify", "1");
        setNotifyOn(true);
        showLocalNotification("Notificaciones activadas en este dispositivo");
      }
    });
  }

  useEffect(() => {
    if (!data || !data.lastEvent) return;
    const ev = data.lastEvent;
    if (lastEventTsRef.current === null) { lastEventTsRef.current = ev.ts; return; }
    if (ev.ts > lastEventTsRef.current) {
      lastEventTsRef.current = ev.ts;
      if (ev.by !== DEVICE_ID && localStorage.getItem("fr-notify") === "1") {
        showLocalNotification(ev.text);
      }
    }
  }, [data]);

  // Load queued celebrations when someone opens a child's profile in kid mode.
  useEffect(() => {
    if (mode !== "kid" || !data) return;
    const childId = activeChildId || data.children[0]?.id;
    const pend = data.pending && data.pending[childId];
    if (celebQueue.length === 0 && pend && pend.length) {
      setCelebQueue(pend);
      const next = structuredClone(data);
      if (!next.pending) next.pending = {};
      next.pending[childId] = [];
      save(next);
    }
  }, [mode, activeChildId, data, celebQueue.length, save]);

  // Play the queued celebrations one by one, themed for the active child.
  useEffect(() => {
    if (celebQueue.length === 0 || !data) return;
    const childId = activeChildId || data.children[0]?.id;
    const child = data.children.find((c) => c.id === childId);
    const theme = themeOf(child);
    const ev = celebQueue[0];
    if (ev.kind === "coins") setCelebration({ kind: "coins-approved", child: child?.name, coins: ev.coins });
    else if (ev.kind === "surprise") setCelebration({ kind: "surprise", child: child?.name, bonus: ev.coins });
    else if (ev.kind === "badge") setCelebration({ kind: "badge", child: child?.name, badge: ev.badge });
    else if (ev.kind === "medal") setCelebration({ kind: "badge", child: child?.name, badge: ev.medal });
    celebrateBurst("big", theme);
    const t = setTimeout(() => { setCelebration(null); setCelebQueue((q) => q.slice(1)); }, 3200);
    return () => clearTimeout(t);
  }, [celebQueue]);

  // Play the random praise animation on the child's profile when a new praise arrives.
  useEffect(() => {
    if (mode !== "kid" || !data || !data.praise) return;
    const p = data.praise;
    const childId = activeChildId || data.children[0]?.id;
    if (p.childId !== childId) return;
    if (Date.now() - p.ts > 86400000) return;
    if (lastPraiseAnimRef.current === p.ts) return;
    lastPraiseAnimRef.current = p.ts;
    const emojis = PRAISE_ANIMS[p.anim ?? 0] || PRAISE_ANIMS[0];
    celebrateBurst("success", "default", emojis);
  }, [mode, activeChildId, data]);

  if (ready && !data) {
    return <Onboarding onFinish={(family) => { save(family); setActiveChildId(family.children[0].id); }} />;
  }

  if (!ready || !data) {
    return (
      <div style={styles.appBg}>
        <StyleBlock />
        <p style={{ fontFamily: "'Nunito Sans', sans-serif", color: "#6B4E9A", padding: 40, textAlign: "center" }}>Preparando la fiesta de recompensas… 🎉</p>
      </div>
    );
  }

  const children = data.children;
  const activeChild = children.find((c) => c.id === activeChildId) || children[0];
  const today = todayKey(0);
  const childTasksAll = data.tasks.filter((t) => t.childId === activeChild.id && t.active);
  const todayTasks = tasksDueOn(childTasksAll, today);
  const todayLog = data.logs[today] || {};
  const settings = data.settings || { penaltyEnabled: false, graceDays: 1 };
  const streak = computeStreak(data.logs, childTasksAll, settings.graceDays || 0);
  const milestone = nextMilestone(streak);
  const earnedAch = data.achievements?.[activeChild.id] || earnedAchievements(data, activeChild.id);
  const stats = computeStats(data, activeChild.id);
  const balance = computeBalance(data, activeChild.id);
  const rewards = (data.rewards || []).filter((r) => r.childId === activeChild.id && r.active);
  const redemptions = data.redemptions || [];

  function emit(next, text) {
    next.lastEvent = { text, ts: Date.now(), by: DEVICE_ID };
  }

  function markDone(taskId) {
    const next = structuredClone(data);
    if (!next.logs[today]) next.logs[today] = {};
    next.logs[today][taskId] = "pending";
    const task = next.tasks.find((t) => t.id === taskId);
    const child = next.children.find((c) => c.id === (task && task.childId));
    emit(next, `${child ? child.name : "Un niño"} ha pedido aprobar una tarea 🙋`);
    save(next);
    playChime("pop");
  }

  function unmark(taskId) {
    const next = structuredClone(data);
    if (next.logs[today]) delete next.logs[today][taskId];
    save(next);
  }

  function decideTask(dateKey, taskId, decision) {
    const next = structuredClone(data);
    if (!next.logs[dateKey]) next.logs[dateKey] = {};
    next.logs[dateKey][taskId] = decision;
    if (decision === "approved") {
      const task = next.tasks.find((t) => t.id === taskId);
      if (task) {
        const childId = task.childId;
        const graceDays = (next.settings && next.settings.graceDays) || 0;
        const tasksForChild = next.tasks.filter((t) => t.childId === childId && t.active);
        const newStreak = computeStreak(next.logs, tasksForChild, graceDays);
        if (!next.records) next.records = {};
        if (newStreak > (next.records[childId] || 0)) next.records[childId] = newStreak;

        // Build the celebration events, but DON'T animate here (parent device).
        // They are queued and play when someone opens this child's profile in kid mode.
        const events = [];
        const coins = task.points ?? 1;
        if (coins > 0) events.push({ id: uid(), kind: "coins", coins });

        // Occasional surprise bonus — unexpected rewards reinforce without harming motivation.
        if (coins > 0 && Math.random() < 0.18) {
          const bonus = 1 + Math.floor(Math.random() * 3);
          if (!next.bonuses) next.bonuses = [];
          next.bonuses.push({ id: uid(), childId, coins: bonus, reason: "sorpresa", ts: Date.now() });
          events.push({ id: uid(), kind: "surprise", coins: bonus });
        }

        if (!next.achievements) next.achievements = {};
        const already = next.achievements[childId] || [];
        const nowEarned = earnedAchievements(next, childId);
        const newly = nowEarned.filter((id) => !already.includes(id));
        next.achievements[childId] = nowEarned;
        if (newly.length) {
          const medal = ACHIEVEMENTS.find((a) => a.id === newly[newly.length - 1]);
          events.push({ id: uid(), kind: "badge", badge: { name: medal.name, icon: medal.icon } });
        }

        if (events.length) {
          if (!next.pending) next.pending = {};
          next.pending[childId] = [...(next.pending[childId] || []), ...events];
        }
        const ch = next.children.find((c) => c.id === childId);
        emit(next, `¡Tarea aprobada para ${ch ? ch.name : ""}! 🎉`);
      }
    }
    save(next);
  }

  function sendPraise(childId) {
    const prevMsg = data.praise && data.praise.childId === childId ? data.praise.message : null;
    let message = PRAISE_MESSAGES[Math.floor(Math.random() * PRAISE_MESSAGES.length)];
    let guard = 0;
    while (message === prevMsg && guard < 10) {
      message = PRAISE_MESSAGES[Math.floor(Math.random() * PRAISE_MESSAGES.length)];
      guard++;
    }
    const anim = Math.floor(Math.random() * PRAISE_ANIMS.length);
    const next = structuredClone(data);
    next.praise = { childId, message, anim, ts: Date.now() };
    const ch = next.children.find((c) => c.id === childId);
    emit(next, `${ch ? ch.name : "Tu peque"} ha recibido un mensaje de ánimo 💛`);
    save(next);
    celebrateBurst("success", "default", PRAISE_ANIMS[anim]);
  }

  function dismissPraise() {
    const next = structuredClone(data);
    next.praise = null;
    save(next);
  }

  function updateSettings(patch) {
    const next = structuredClone(data);
    next.settings = { ...(next.settings || { penaltyEnabled: false, graceDays: 1 }), ...patch };
    save(next);
  }

  function setChildColor(childId, color) {
    const next = structuredClone(data);
    const c = next.children.find((x) => x.id === childId);
    if (c) c.color = color;
    save(next);
  }

  function setChildTheme(childId, theme) {
    const next = structuredClone(data);
    const c = next.children.find((x) => x.id === childId);
    if (c) c.theme = theme;
    save(next);
  }

  function setParentTheme(theme) {
    const next = structuredClone(data);
    next.parentTheme = theme;
    save(next);
  }

  async function addTask(childIds, title, points, frequency, photoFile, description, kind, photoUrl) {
    if (!title.trim()) return;
    const next = structuredClone(data);
    let photo = null;
    if (photoUrl && photoUrl.trim()) {
      photo = photoUrl.trim();
    } else if (photoFile) {
      try { photo = await fileToResizedDataUrl(photoFile); } catch (e) { console.error(e); }
    }
    const isFamily = kind === "family";
    const ids = Array.isArray(childIds) ? childIds.filter(Boolean) : (childIds ? [childIds] : []);
    const targets = ids.length ? ids : [null];
    const base = { title: title.trim(), points: isFamily ? 0 : (points || 1), kind: isFamily ? "family" : "reward", frequency, active: true, photo, description: (description || "").trim(), createdDate: todayKey(0) };
    for (const cid of targets) next.tasks.push({ id: uid(), childId: cid, ...base });
    const names = ids.map((id) => { const c = next.children.find((x) => x.id === id); return c ? c.name : ""; }).filter(Boolean);
    if (names.length) emit(next, `Nueva tarea para ${names.join(" y ")}: ${title.trim()} 📝`);
    save(next);
  }

  async function updateTaskPhoto(taskId, file) {
    try {
      const dataUrl = await fileToResizedDataUrl(file);
      const next = structuredClone(data);
      const task = next.tasks.find((t) => t.id === taskId);
      if (task) task.photo = dataUrl;
      save(next);
    } catch (e) {
      console.error("No se pudo actualizar la foto de la tarea", e);
    }
  }

  function updateTaskPhotoUrl(taskId, url) {
    if (!url || !url.trim()) return;
    const next = structuredClone(data);
    const task = next.tasks.find((t) => t.id === taskId);
    if (task) task.photo = url.trim();
    save(next);
  }

  function removeTask(taskId) {
    const next = structuredClone(data);
    const t = next.tasks.find((x) => x.id === taskId);
    if (t) t.active = false;
    save(next);
  }

  function reassignTask(taskId, childId) {
    const next = structuredClone(data);
    const t = next.tasks.find((x) => x.id === taskId);
    if (t) t.childId = childId || null;
    save(next);
  }

  async function addChallenge(childId, title, description, medalIcon, medalName, photoFile, photoUrl) {
    if (!title.trim()) return;
    const next = structuredClone(data);
    if (!next.challenges) next.challenges = [];
    let photo = null;
    if (photoUrl && photoUrl.trim()) photo = photoUrl.trim();
    else if (photoFile) { try { photo = await fileToResizedDataUrl(photoFile); } catch (e) { console.error(e); } }
    next.challenges.push({ id: uid(), childId: childId || null, title: title.trim(), description: (description || "").trim(), photo, medalIcon: medalIcon || "🏅", medalName: (medalName || "Medalla especial").trim(), status: "open", active: true, createdDate: todayKey(0) });
    if (childId) { const ch = next.children.find((c) => c.id === childId); emit(next, `Nuevo desafío para ${ch ? ch.name : ""}: ${title.trim()} 🏅`); }
    save(next);
  }

  function removeChallenge(id) {
    const next = structuredClone(data);
    const c = next.challenges.find((x) => x.id === id);
    if (c) c.active = false;
    save(next);
  }

  function markChallengeDone(id) {
    const next = structuredClone(data);
    const c = next.challenges.find((x) => x.id === id);
    if (c) c.status = "pending";
    const child = c && next.children.find((x) => x.id === c.childId);
    emit(next, `${child ? child.name : "Un niño"} dice haber completado un desafío 🏅`);
    save(next);
    playChime("pop");
  }

  function decideChallenge(id, decision) {
    const next = structuredClone(data);
    const c = next.challenges.find((x) => x.id === id);
    if (!c) return;
    if (decision === "approved") {
      c.status = "done";
      c.dateDone = todayKey(0);
      if (!next.specialMedals) next.specialMedals = {};
      const list = next.specialMedals[c.childId] || [];
      next.specialMedals[c.childId] = [...list, { icon: c.medalIcon, name: c.medalName, ts: Date.now() }];
      if (!next.pending) next.pending = {};
      next.pending[c.childId] = [...(next.pending[c.childId] || []), { id: uid(), kind: "medal", medal: { icon: c.medalIcon, name: c.medalName } }];
      const child = next.children.find((x) => x.id === c.childId);
      emit(next, `¡Desafío superado! ${child ? child.name : ""} gana la medalla ${c.medalName} 🏅`);
    } else {
      c.status = "open";
    }
    save(next);
  }

  async function addReward(childId, title, cost, icon, photoFile, description, tag, photoUrl) {
    if (!title.trim() || !cost) return;
    const next = structuredClone(data);
    if (!next.rewards) next.rewards = [];
    let photo = null;
    if (photoUrl && photoUrl.trim()) {
      photo = photoUrl.trim();
    } else if (photoFile) {
      try { photo = await fileToResizedDataUrl(photoFile); } catch (e) { console.error(e); }
    }
    next.rewards.push({ id: uid(), childId, title: title.trim(), cost: Number(cost), icon: icon || "🎁", active: true, photo, description: (description || "").trim(), tag: (tag || "").trim() });
    save(next);
  }

  async function updateRewardPhoto(rewardId, file) {
    try {
      const dataUrl = await fileToResizedDataUrl(file);
      const next = structuredClone(data);
      const reward = next.rewards.find((r) => r.id === rewardId);
      if (reward) reward.photo = dataUrl;
      save(next);
    } catch (e) {
      console.error("No se pudo actualizar la foto de la recompensa", e);
    }
  }

  function updateRewardPhotoUrl(rewardId, url) {
    if (!url || !url.trim()) return;
    const next = structuredClone(data);
    const reward = next.rewards.find((r) => r.id === rewardId);
    if (reward) reward.photo = url.trim();
    save(next);
  }

  function removeReward(rewardId) {
    const next = structuredClone(data);
    const r = next.rewards.find((x) => x.id === rewardId);
    if (r) r.active = false;
    save(next);
  }

  function requestRedeem(childId, reward) {
    const bal = computeBalance(data, childId);
    if (bal.available < reward.cost) return;
    const next = structuredClone(data);
    if (!next.redemptions) next.redemptions = [];
    next.redemptions.push({ id: uid(), childId, rewardId: reward.id, rewardTitle: reward.title, cost: reward.cost, dateRequested: today, status: "pending" });
    const child = next.children.find((c) => c.id === childId);
    emit(next, `${child ? child.name : "Un niño"} quiere canjear: ${reward.title} 🎁`);
    save(next);
    setCelebration({ kind: "redeem", child: child.name, reward });
    setTimeout(() => setCelebration(null), 3000);
  }

  function decideRedemption(redemptionId, decision) {
    const next = structuredClone(data);
    const r = next.redemptions.find((x) => x.id === redemptionId);
    if (r) { r.status = decision; r.dateDecided = todayKey(0); }
    if (r && decision === "approved") {
      const child = next.children.find((c) => c.id === r.childId);
      emit(next, `Canje aprobado para ${child ? child.name : ""}: ${r.rewardTitle} ✅`);
    }
    save(next);
  }

  async function updateChildPhoto(childId, file) {
    try {
      const dataUrl = await fileToResizedDataUrl(file);
      const next = structuredClone(data);
      const child = next.children.find((c) => c.id === childId);
      if (child) child.photo = dataUrl;
      save(next);
    } catch (e) {
      console.error("No se pudo actualizar la foto", e);
    }
  }

  function saveFamilyName() {
    const next = structuredClone(data);
    next.familyName = familyNameDraft.trim();
    save(next);
    setEditingFamilyName(false);
  }

  function pendingTaskApprovals() {
    const items = [];
    for (const [dateKey, dayLog] of Object.entries(data.logs)) {
      for (const [taskId, status] of Object.entries(dayLog)) {
        if (status === "pending") {
          const task = data.tasks.find((t) => t.id === taskId);
          if (task) {
            const child = children.find((c) => c.id === task.childId);
            if (child) items.push({ dateKey, taskId, task, child });
          }
        }
      }
    }
    items.sort((a, b) => (a.dateKey < b.dateKey ? -1 : 1));
    return items;
  }

  function tryEnterParent() {
    setShowPinGate(true);
    setPinInput("");
    setPinError("");
  }

  function confirmPin() {
    if (pinInput === data.pin) {
      setMode("parent");
      setShowPinGate(false);
    } else {
      setPinError("PIN incorrecto. Inténtalo de nuevo.");
    }
  }

  const bgTheme = mode === "parent" ? ((data.parentTheme && THEMES[data.parentTheme]) ? data.parentTheme : "default") : themeOf(activeChild);
  const bgUsesImage = bgTheme !== "default";
  const tint = mode === "parent" ? "#FFF8EF" : ((activeChild.color || "#A78BFA") + "22");

  return (
    <div style={{ ...styles.appBg, background: "transparent", position: "relative" }}>
      <div className={"fr-bg-layer" + (bgUsesImage ? " fr-bg-" + bgTheme : "")} style={bgUsesImage ? undefined : { background: tint }} />
      <StyleBlock />
      {burst && <Confetti theme={burstTheme} emojis={burstEmojis} />}
      {celebration && (
        <div className="fr-celebration">
          <div className="fr-celebration-card">
            {celebration.kind === "badge" ? (
              <>
                <div style={{ fontSize: 48 }}>{celebration.badge.icon}</div>
                <div className="fr-celebration-title">¡Nueva insignia!</div>
                <div className="fr-celebration-sub">{celebration.child} ha ganado <strong>{celebration.badge.name}</strong></div>
              </>
            ) : celebration.kind === "surprise" ? (
              <>
                <div style={{ fontSize: 48 }}>🎁</div>
                <div className="fr-celebration-title">¡Sorpresa!</div>
                <div className="fr-celebration-sub">{celebration.child} gana <strong>+{celebration.bonus} monedas</strong> de regalo</div>
              </>
            ) : celebration.kind === "coins-approved" ? (
              <>
                <div style={{ fontSize: 48 }}><Coin lg /></div>
                <div className="fr-celebration-title">¡Monedas conseguidas!</div>
                <div className="fr-celebration-sub">{celebration.child} gana <strong>+{celebration.coins} monedas</strong></div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 48 }}>{celebration.reward.icon}</div>
                <div className="fr-celebration-title">¡Canje enviado!</div>
                <div className="fr-celebration-sub">{celebration.child} ha pedido: <strong>{celebration.reward.title}</strong></div>
              </>
            )}
          </div>
        </div>
      )}

      {showPinGate && (
        <div className="fr-modal-overlay">
          <div className="fr-modal">
            <h3 className="fr-modal-title">Modo padres 🔐</h3>
            <p className="fr-modal-sub">Introduce el PIN para continuar.</p>
            <input type="password" inputMode="numeric" maxLength={6} className="fr-pin-input" value={pinInput}
              onChange={(e) => setPinInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && confirmPin()} autoFocus />
            {pinError && <div className="fr-error">{pinError}</div>}
            <div className="fr-modal-actions">
              <button className="fr-btn fr-btn-ghost" onClick={() => setShowPinGate(false)}>Cancelar</button>
              <button className="fr-btn fr-btn-primary" onClick={confirmPin}>Entrar</button>
            </div>
          </div>
        </div>
      )}

      <header className="fr-topbar">
        <div className="fr-brand">
          <img src={APP_ICON} alt="" className="fr-brand-icon" />
          <div className="fr-brand-text">
            <span className="fr-brand-name">Family Rewards</span>
            {editingFamilyName ? (
              <span className="fr-familyname-edit">
                <input className="fr-familyname-input" placeholder="Nombre de la familia" value={familyNameDraft} autoFocus maxLength={40}
                  onChange={(e) => setFamilyNameDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && saveFamilyName()} />
                <button className="fr-mini-btn" onClick={saveFamilyName}>Guardar</button>
                <button className="fr-mini-btn fr-mini-btn-ghost" onClick={() => setEditingFamilyName(false)}>✕</button>
              </span>
            ) : (
              <span className="fr-familyname-sub">
                {data.familyName ? `Familia ${data.familyName}` : (mode === "parent" ? "Sin nombre de familia" : "")}
                {mode === "parent" && (
                  <button className="fr-familyname-editbtn" onClick={() => { setFamilyNameDraft(data.familyName || ""); setEditingFamilyName(true); }}>
                    ✏️ {data.familyName ? "Editar" : "Añadir"}
                  </button>
                )}
              </span>
            )}
          </div>
        </div>
        <div className="fr-topbar-actions">
          {mode === "kid" ? (
            <button className="fr-btn fr-btn-ghost fr-btn-small" onClick={tryEnterParent}>Modo padres</button>
          ) : (
            <>
              <button className="fr-btn fr-btn-ghost fr-btn-small" onClick={enableNotifications} title="Activar avisos en este dispositivo">
                {notifyOn ? "🔔 Avisos" : "🔕 Avisos"}
              </button>
              <button className="fr-btn fr-btn-ghost fr-btn-small" onClick={() => setMode("kid")}>Salir</button>
            </>
          )}
        </div>
      </header>

      {mode === "kid" && (
        <nav className="fr-child-tabs">
          {children.map((c) => {
            const prog = dayProgress(data, c.id);
            return (
              <div key={c.id} className="fr-child-tab-wrap">
                <button className={"fr-child-tab" + (c.id === activeChild.id ? " fr-child-tab-active" : "")}
                  style={{ "--child-color": c.color }} onClick={() => setActiveChildId(c.id)}>
                  <span className="fr-avatar-ring" style={{ background: `conic-gradient(#4CC24C ${prog.pct}%, rgba(0,0,0,0.12) ${prog.pct}% 100%)` }}>
                    {c.photo ? (
                      <span className="fr-child-avatar" style={{ backgroundImage: `url(${c.photo})` }} />
                    ) : (
                      <span className="fr-child-avatar fr-child-avatar-emoji">{c.emoji}</span>
                    )}
                  </span>
                  <span className="fr-child-tab-name">{c.name}{prog.total > 0 ? ` (${prog.pending})` : ""}</span>
                </button>
              </div>
            );
          })}
        </nav>
      )}

      {mode === "kid" ? (
        <div className="fr-kid">
          {data.praise && data.praise.childId === activeChild.id && (Date.now() - data.praise.ts < 86400000) && (
            <div className="fr-praise-banner" style={{ background: activeChild.color }}>
              <span>{data.praise.message}</span>
              <button className="fr-praise-close" onClick={dismissPraise}>✕</button>
            </div>
          )}
          <div className="fr-balance-bar" style={{ borderColor: activeChild.color }}>
            <span className="fr-balance-star"><Coin lg /></span>
            <span className="fr-balance-num">{balance.available}</span>
            <span className="fr-balance-label">monedas disponibles</span>
            {balance.penaltyCoins > 0 && (
              <span className="fr-balance-penalty" title={`${balance.missedCount} tarea(s) sin hacer`}>−{balance.penaltyCoins} <Coin /></span>
            )}
          </div>
          <nav className="fr-subtabs">
            {[["hoy", "Hoy"], ["pendientes", "Pendientes"], ["desafios", "Desafíos"], ["recompensas", "Recompensas"], ["progreso", "Mi progreso"]].map(([key, label]) => (
              <button key={key} className={"fr-subtab" + (kidTab === key ? " fr-subtab-active" : "")}
                style={{ "--child-color": activeChild.color }} onClick={() => setKidTab(key)}>{label}</button>
            ))}
          </nav>
          <main className="fr-main">
            {kidTab === "hoy" && (
              <TodayTasks child={activeChild} tasks={todayTasks} todayLog={todayLog} onMark={markDone} onUnmark={unmark} />
            )}
            {kidTab === "pendientes" && (
              <PendingView child={activeChild} pendingItems={pendingForChild(data, activeChild.id)} upcoming={upcomingForChild(childTasksAll, today)} />
            )}
            {kidTab === "desafios" && (
              <ChallengesView child={activeChild} challenges={(data.challenges || []).filter((c) => c.active && c.childId === activeChild.id)} onDone={markChallengeDone} specialMedals={(data.specialMedals || {})[activeChild.id] || []} />
            )}
            {kidTab === "recompensas" && (
              <RewardsShop child={activeChild} rewards={rewards} balance={balance} redemptions={redemptions} onRedeem={(r) => requestRedeem(activeChild.id, r)} />
            )}
            {kidTab === "progreso" && (
              <ProgressView child={activeChild} streak={streak} milestone={milestone} earnedAch={earnedAch} stats={stats} tasks={childTasksAll} logs={data.logs} today={today} specialMedals={(data.specialMedals || {})[activeChild.id] || []} />
            )}
          </main>
        </div>
      ) : (
        <>
          <nav className="fr-subtabs">
            {[["aprobaciones", "Aprobaciones"], ["tareas", "Tareas"], ["desafios", "Desafíos"], ["recompensas", "Recompensas"], ["progreso", "Progreso"], ["ajustes", "Ajustes"]].map(([key, label]) => {
              const pendingCount = key === "aprobaciones"
                ? (pendingTaskApprovals().length + redemptions.filter((r) => r.status === "pending").length + (data.challenges || []).filter((c) => c.active && c.status === "pending").length)
                : 0;
              return (
                <button key={key} className={"fr-subtab" + (parentTab === key ? " fr-subtab-active" : "")} onClick={() => setParentTab(key)}>
                  {label}{pendingCount > 0 ? <span className="fr-tab-badge">{pendingCount}</span> : null}
                </button>
              );
            })}
          </nav>
          <main className="fr-main">
            {parentTab === "aprobaciones" && (
              <ApprovalsPanel children={children} taskApprovals={pendingTaskApprovals()}
                redemptionApprovals={redemptions.filter((r) => r.status === "pending")}
                challengeApprovals={(data.challenges || []).filter((c) => c.active && c.status === "pending")}
                onDecideTask={decideTask} onDecideRedemption={decideRedemption} onDecideChallenge={decideChallenge} onPraise={sendPraise} />
            )}
            {parentTab === "tareas" && (
              <TasksManager children={children} tasks={data.tasks.filter((t) => t.active)}
                onAdd={addTask} onRemove={removeTask} onUpdatePhoto={updateTaskPhoto} onUpdatePhotoUrl={updateTaskPhotoUrl} onReassign={reassignTask} />
            )}
            {parentTab === "desafios" && (
              <ChallengesManager children={children} challenges={(data.challenges || []).filter((c) => c.active)}
                onAdd={addChallenge} onRemove={removeChallenge} onDecide={decideChallenge} />
            )}
            {parentTab === "recompensas" && (
              <>
                <ChildBar children={children} activeId={activeChild.id} onPick={setActiveChildId} />
                <RewardsManager activeChild={activeChild} rewards={rewards} onAdd={(title, cost, icon, photoFile, description, tag, photoUrl) => addReward(activeChild.id, title, cost, icon, photoFile, description, tag, photoUrl)} onRemove={removeReward} onUpdatePhoto={updateRewardPhoto} onUpdatePhotoUrl={updateRewardPhotoUrl} redemptions={redemptions} />
              </>
            )}
            {parentTab === "progreso" && (
              <>
                <ChildBar children={children} activeId={activeChild.id} onPick={setActiveChildId} />
                <ProgressView child={activeChild} streak={streak} milestone={milestone} earnedAch={earnedAch} stats={stats} tasks={childTasksAll} logs={data.logs} today={today} specialMedals={(data.specialMedals || {})[activeChild.id] || []} />
              </>
            )}
            {parentTab === "ajustes" && (
              <>
                <ChildBar children={children} activeId={activeChild.id} onPick={setActiveChildId} />
                <SettingsPanel settings={settings} onUpdate={updateSettings} children={children} activeChild={activeChild} onSetColor={setChildColor} onSetTheme={setChildTheme} parentTheme={data.parentTheme || "default"} onSetParentTheme={setParentTheme} />
              </>
            )}
          </main>
        </>
      )}
    </div>
  );
}

/* ---------------- Kid: Today ---------------- */
/* ---------------- Shared: rich media card (PointUp style) ---------------- */
function RichItemCard({ photo, iconFallback, colorFallback, pill, badge, title, description, onDelete, onPhotoPick, onPhotoUrl, children, dimmed }) {
  const mediaStyle = photo
    ? { backgroundImage: `url(${photo})` }
    : { background: `linear-gradient(155deg, ${colorFallback || "#4FC3E8"}, #10151c)` };
  return (
    <div className={"fr-rich-card" + (dimmed ? " fr-rich-card-dimmed" : "")}>
      <div className="fr-rich-media" style={mediaStyle}>
        {!photo && <span className="fr-rich-media-emoji">{iconFallback}</span>}
        {pill && <span className="fr-rich-pill">{pill}</span>}
        {onDelete && (
          <button className="fr-rich-delete" title="Quitar" onClick={onDelete}>🗑️</button>
        )}
        {(onPhotoPick || onPhotoUrl) && (
          <span className="fr-rich-photo-actions">
            {onPhotoPick && (
              <label className="fr-rich-photo-edit" title="Subir foto">
                📷
                <input type="file" accept="image/*" style={{ display: "none" }}
                  onChange={(e) => { const f = e.target.files[0]; if (f) onPhotoPick(f); e.target.value = ""; }} />
              </label>
            )}
            {onPhotoUrl && (
              <button className="fr-rich-photo-edit" title="Poner foto por URL"
                onClick={() => { const u = window.prompt("Pega la URL de la imagen (https://...)"); if (u) onPhotoUrl(u); }}>🔗</button>
            )}
          </span>
        )}
        {badge != null && <span className="fr-rich-badge">{badge}</span>}
      </div>
      <div className="fr-rich-body">
        <div className="fr-rich-title">{title}</div>
        {description ? <div className="fr-rich-desc">{description}</div> : null}
        {children}
      </div>
    </div>
  );
}

function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="fr-search-bar">
      <span className="fr-search-icon">🔍</span>
      <input className="fr-search-input" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      {value && <button className="fr-search-clear" onClick={() => onChange("")}>✕</button>}
    </div>
  );
}

function freqLabelShort(t) {
  const f = t.frequency || { type: "daily" };
  if (f.type === "daily") return "Cada día";
  if (f.type === "weekly") return (f.days || []).map((d) => WEEKDAY_LABELS[d === 0 ? 6 : d - 1]).join("·");
  if (f.type === "date") return f.date;
  return "";
}

function taskBadge(t) {
  if (t.kind === "family" || t.points === 0) return "🏠 Familiar";
  return <>{`+${t.points ?? 1} `}<Coin /></>;
}

const THEME_COLORS = ["#FF6FA5", "#4FC3E8", "#6FCF97", "#FFC93C", "#A78BFA", "#F0885B", "#3FB6A8", "#7C9CF5"];

/* ---------------- Kid: Today ---------------- */
function TodayTasks({ child, tasks, todayLog, onMark, onUnmark }) {
  const [query, setQuery] = useState("");
  const filtered = tasks.filter((t) => t.title.toLowerCase().includes(query.toLowerCase()));
  return (
    <section className="fr-dark-surface">
      <h2 className="fr-dark-title">Tareas de hoy</h2>
      <SearchBar value={query} onChange={setQuery} placeholder="Buscar tareas..." />
      {tasks.length === 0 ? (
        <p className="fr-dark-empty">Hoy no toca ninguna tarea. ¡Disfruta el día, {child.name}! 🎈</p>
      ) : filtered.length === 0 ? (
        <p className="fr-dark-empty">No hay tareas que coincidan con la búsqueda.</p>
      ) : (
        <div className="fr-rich-grid">
          {filtered.map((t) => {
            const status = todayLog[t.id];
            return (
              <RichItemCard key={t.id} photo={t.photo} iconFallback="✅" colorFallback={child.color}
                pill={freqLabelShort(t)} badge={taskBadge(t)} title={t.title} description={t.description}
                dimmed={status === "approved"}>
                {status === "approved" ? (
                  <div className="fr-rich-status fr-rich-status-ok">✓ Aprobado</div>
                ) : status === "pending" ? (
                  <button className="fr-rich-action fr-rich-action-wait" onClick={() => onUnmark(t.id)}>Esperando · deshacer</button>
                ) : status === "rejected" ? (
                  <button className="fr-rich-action" style={{ background: child.color }} onClick={() => onMark(t.id)}>Intentar de nuevo</button>
                ) : (
                  <button className="fr-rich-action" style={{ background: child.color }} onClick={() => onMark(t.id)}>¡Hecho!</button>
                )}
              </RichItemCard>
            );
          })}
        </div>
      )}
    </section>
  );
}

/* ---------------- Kid: Pending & upcoming ---------------- */
function PendingView({ child, pendingItems, upcoming }) {
  const dateLabel = (dateKey) => {
    const d = new Date(dateKey + "T12:00:00");
    return d.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "short" });
  };
  return (
    <>
      <section className="fr-dark-surface">
        <h2 className="fr-dark-title">Esperando aprobación</h2>
        {pendingItems.length === 0 ? (
          <p className="fr-dark-empty">No tienes nada esperando a que un adulto lo apruebe.</p>
        ) : (
          <div className="fr-rich-grid">
            {pendingItems.map((p) => (
              <RichItemCard key={p.dateKey + p.task.id} photo={p.task.photo} iconFallback="⏳" colorFallback={child.color}
                pill={p.dateKey} badge={taskBadge(p.task)} title={p.task.title} description={p.task.description} dimmed>
                <div className="fr-rich-status fr-rich-status-wait">⏳ Esperando aprobación</div>
              </RichItemCard>
            ))}
          </div>
        )}
      </section>

      <section className="fr-dark-surface">
        <h2 className="fr-dark-title">Próximos días</h2>
        {upcoming.length === 0 ? (
          <p className="fr-dark-empty">No hay más tareas programadas por ahora.</p>
        ) : (
          upcoming.map(({ dateKey, tasks }) => (
            <div key={dateKey} className="fr-upcoming-day">
              <div className="fr-upcoming-date">{dateLabel(dateKey)}</div>
              <div className="fr-rich-grid">
                {tasks.map((t) => (
                  <RichItemCard key={t.id} photo={t.photo} iconFallback="📅" colorFallback={child.color}
                    pill={freqLabelShort(t)} badge={taskBadge(t)} title={t.title} description={t.description} />
                ))}
              </div>
            </div>
          ))
        )}
      </section>
    </>
  );
}

/* ---------------- Kid: Rewards shop ---------------- */
function RewardsShop({ child, rewards, balance, redemptions, onRedeem }) {
  const [query, setQuery] = useState("");
  const filtered = rewards.filter((r) => r.title.toLowerCase().includes(query.toLowerCase()));
  const past = (redemptions || [])
    .filter((r) => r.childId === child.id && r.status === "approved")
    .sort((a, b) => ((b.dateDecided || b.dateRequested || "") < (a.dateDecided || a.dateRequested || "") ? -1 : 1));
  const fmtDate = (k) => {
    if (!k) return "";
    const d = new Date(k + "T12:00:00");
    return d.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
  };
  return (
    <>
      <section className="fr-dark-surface">
        <h2 className="fr-dark-title">Tienda de recompensas</h2>
        <SearchBar value={query} onChange={setQuery} placeholder="Buscar recompensas..." />
        {rewards.length === 0 ? (
          <p className="fr-dark-empty">Todavía no hay recompensas. Pídele a un adulto que añada alguna en modo padres.</p>
        ) : filtered.length === 0 ? (
          <p className="fr-dark-empty">No hay recompensas que coincidan con la búsqueda.</p>
        ) : (
          <div className="fr-rich-grid">
            {filtered.map((r) => {
              const pending = redemptions.some((rd) => rd.childId === child.id && rd.rewardId === r.id && rd.status === "pending");
              const canAfford = balance.available >= r.cost;
              const pct = Math.min(100, Math.round((balance.available / r.cost) * 100));
              return (
                <RichItemCard key={r.id} photo={r.photo} iconFallback={r.icon} colorFallback={child.color}
                  pill={r.tag} badge={<>{r.cost} <Coin /></>} title={r.title} description={r.description} dimmed={pending}>
                  <div className="fr-reward-progress">
                    <div className="fr-reward-progress-bar"><span style={{ width: pct + "%", background: child.color }} /></div>
                    <div className="fr-reward-progress-text">{Math.min(balance.available, r.cost)} de {r.cost} <Coin /></div>
                  </div>
                  <button className="fr-rich-action" style={{ background: canAfford && !pending ? child.color : undefined }}
                    disabled={pending || !canAfford} onClick={() => onRedeem(r)}>
                    {pending ? "Esperando aprobación" : canAfford ? "Reclamar recompensa" : <>Te faltan {r.cost - balance.available} <Coin /></>}
                  </button>
                </RichItemCard>
              );
            })}
          </div>
        )}
      </section>

      <section className="fr-dark-surface">
        <h2 className="fr-dark-title">Recompensas pasadas</h2>
        {past.length === 0 ? (
          <p className="fr-dark-empty">Aún no has canjeado ninguna recompensa. ¡A por ello!</p>
        ) : (
          <ul className="fr-past-list">
            {past.map((r) => (
              <li key={r.id} className="fr-past-item">
                <span className="fr-past-title">🎁 {r.rewardTitle}</span>
                <span className="fr-past-meta">{fmtDate(r.dateDecided || r.dateRequested)} · {r.cost} <Coin /></span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

/* ---------------- Progress (trail + medals + calendar) ---------------- */
function ProgressView({ child, streak, milestone, earnedAch, stats, tasks, logs, today, specialMedals }) {
  const stonesToShow = Math.min(streak, 7);
  const earnedCount = earnedAch.length;
  const special = specialMedals || [];
  return (
    <>
      {special.length > 0 && (
        <section className="fr-card">
          <h2 className="fr-card-title" style={{ color: child.color }}>Medallas especiales 🏅</h2>
          <div className="fr-badge-shelf">
            {special.map((m, i) => (
              <div key={i} className="fr-badge fr-badge-unlocked" title={m.name}>
                <div className="fr-badge-icon">{m.icon}</div>
                <div className="fr-badge-name">{m.name}</div>
              </div>
            ))}
          </div>
        </section>
      )}
      <section className="fr-card">
        <h2 className="fr-card-title" style={{ color: child.color }}>Camino de racha</h2>
        <div className="fr-trail-path">
          {Array.from({ length: stonesToShow }).map((_, i) => (
            <div key={i} className="fr-stone fr-stone-filled" style={{ background: child.color }}>🐾</div>
          ))}
          {streak > 7 && <div className="fr-stone fr-stone-count">🔥 {streak}</div>}
          {milestone && <div className="fr-stone fr-stone-milestone">{milestone.icon}</div>}
        </div>
        <p className="fr-trail-caption">
          {streak === 0
            ? "Completa todas las tareas de hoy para empezar la racha."
            : milestone
            ? `Racha actual: ${streak} día${streak === 1 ? "" : "s"}. Faltan ${milestone.days - streak} para "${milestone.name}".`
            : `Racha actual: ${streak} días. ¡Racha máxima!`}
        </p>
      </section>

      <section className="fr-card">
        <h2 className="fr-card-title" style={{ color: child.color }}>Medallas ({earnedCount}/{ACHIEVEMENTS.length})</h2>
        <div className="fr-badge-shelf">
          {ACHIEVEMENTS.map((a) => {
            const unlocked = earnedAch.includes(a.id);
            return (
              <div key={a.id} className={"fr-badge" + (unlocked ? " fr-badge-unlocked" : "")} title={a.desc}>
                <div className="fr-badge-icon">{unlocked ? a.icon : "🔒"}</div>
                <div className="fr-badge-name">{a.name}</div>
                <div className="fr-badge-days">{a.desc}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="fr-card">
        <h2 className="fr-card-title" style={{ color: child.color }}>Calendario del mes</h2>
        <MonthCalendar tasks={tasks} logs={logs} today={today} />
        <div className="fr-legend">
          <span><i className="fr-dot" style={{ background: "#6FCF97" }} /> Completo</span>
          <span><i className="fr-dot" style={{ background: "#FFC93C" }} /> Parcial</span>
          <span><i className="fr-dot" style={{ background: "#F4A9A0" }} /> Sin hacer (−<Coin />)</span>
          <span><i className="fr-dot" style={{ background: "#E9E4F5" }} /> Sin tareas</span>
        </div>
      </section>
    </>
  );
}

function MonthCalendar({ tasks, logs, today }) {
  const now = new Date(today + "T12:00:00");
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leading = (new Date(year, month, 1).getDay() + 6) % 7;
  const cells = [];
  for (let i = 0; i < leading; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(`${year}-${pad(month + 1)}-${pad(d)}`);

  const colorFor = { full: "#6FCF97", partial: "#FFC93C", none: "#F4A9A0", empty: "#E9E4F5", future: "#FFFFFF" };

  return (
    <div>
      <div className="fr-cal-weekdays">
        {WEEKDAY_LABELS.map((l) => <div key={l} className="fr-cal-weekday">{l}</div>)}
      </div>
      <div className="fr-cal-grid">
        {cells.map((dateKey, i) => {
          if (!dateKey) return <div key={i} className="fr-cal-cell fr-cal-cell-blank" />;
          const status = dayStatus(tasks, logs, dateKey, today);
          const isToday = dateKey === today;
          return (
            <div key={i} className={"fr-cal-cell" + (isToday ? " fr-cal-cell-today" : "")} style={{ background: colorFor[status] }}>
              {Number(dateKey.slice(-2))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Parent: Approvals ---------------- */
function ChildBar({ children, activeId, onPick }) {
  return (
    <div className="fr-childbar">
      {children.map((c) => (
        <button key={c.id} className={"fr-childbar-chip" + (c.id === activeId ? " fr-childbar-chip-active" : "")}
          style={{ "--child-color": c.color }} onClick={() => onPick(c.id)}>
          {c.photo ? <span className="fr-childbar-avatar" style={{ backgroundImage: `url(${c.photo})` }} /> : <span className="fr-childbar-emoji">{c.emoji}</span>}
          {c.name}
        </button>
      ))}
    </div>
  );
}

function ApprovalsPanel({ children, taskApprovals, redemptionApprovals, challengeApprovals, onDecideTask, onDecideRedemption, onDecideChallenge, onPraise }) {
  const nameOf = (id) => { const c = children.find((x) => x.id === id); return c ? c.name : "Sin asignar"; };
  return (
    <>
      <section className="fr-card">
        <h2 className="fr-card-title">Enviar ánimos 💛</h2>
        <div className="fr-praise-row">
          {children.map((c) => (
            <button key={c.id} className="fr-btn fr-btn-small" style={{ background: c.color }} onClick={() => onPraise(c.id)}>💛 {c.name}</button>
          ))}
        </div>
      </section>

      <section className="fr-card">
        <h2 className="fr-card-title">Tareas por aprobar</h2>
        {taskApprovals.length === 0 ? (
          <p className="fr-empty">No hay tareas pendientes.</p>
        ) : (
          <ul className="fr-task-list">
            {taskApprovals.map((p) => (
              <li key={p.dateKey + p.taskId} className="fr-task-item">
                <span className="fr-task-title">{p.task.title} <span className="fr-task-date">· {nameOf(p.task.childId)} · {p.dateKey}</span></span>
                <span className="fr-approve-actions">
                  <button className="fr-btn fr-btn-small fr-btn-approve" onClick={() => onDecideTask(p.dateKey, p.taskId, "approved")}>Aprobar</button>
                  <button className="fr-btn fr-btn-small fr-btn-reject" onClick={() => onDecideTask(p.dateKey, p.taskId, "rejected")}>Rechazar</button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="fr-card">
        <h2 className="fr-card-title">Desafíos por aprobar</h2>
        {(!challengeApprovals || challengeApprovals.length === 0) ? (
          <p className="fr-empty">No hay desafíos pendientes.</p>
        ) : (
          <ul className="fr-task-list">
            {challengeApprovals.map((c) => (
              <li key={c.id} className="fr-task-item">
                <span className="fr-task-title">{c.medalIcon} {c.title} <span className="fr-task-date">· {nameOf(c.childId)}</span></span>
                <span className="fr-approve-actions">
                  <button className="fr-btn fr-btn-small fr-btn-approve" onClick={() => onDecideChallenge(c.id, "approved")}>Aprobar</button>
                  <button className="fr-btn fr-btn-small fr-btn-reject" onClick={() => onDecideChallenge(c.id, "rejected")}>Rechazar</button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="fr-card">
        <h2 className="fr-card-title">Canjes por aprobar</h2>
        {redemptionApprovals.length === 0 ? (
          <p className="fr-empty">No hay canjes pendientes.</p>
        ) : (
          <ul className="fr-task-list">
            {redemptionApprovals.map((r) => (
              <li key={r.id} className="fr-task-item">
                <span className="fr-task-title">{r.rewardTitle} <span className="fr-task-date">· {nameOf(r.childId)} · {r.cost} <Coin /></span></span>
                <span className="fr-approve-actions">
                  <button className="fr-btn fr-btn-small fr-btn-approve" onClick={() => onDecideRedemption(r.id, "approved")}>Aprobar</button>
                  <button className="fr-btn fr-btn-small fr-btn-reject" onClick={() => onDecideRedemption(r.id, "rejected")}>Rechazar</button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

/* ---------------- Parent: Tasks manager ---------------- */
function TasksManager({ children, tasks, onAdd, onRemove, onUpdatePhoto, onUpdatePhotoUrl, onReassign }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState(1);
  const [freqType, setFreqType] = useState("daily");
  const [weekdays, setWeekdays] = useState([]);
  const [date, setDate] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("reward"); // "reward" da monedas · "family" no
  const [assignIds, setAssignIds] = useState([]); // vacío = sin asignar
  const themeColor = "#A78BFA";
  const nameOf = (id) => { const c = children.find((x) => x.id === id); return c ? c.name : "Sin asignar"; };

  function toggleAssign(id) {
    setAssignIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function toggleWeekday(idx) {
    const jsDay = idx === 6 ? 0 : idx + 1;
    setWeekdays((prev) => (prev.includes(jsDay) ? prev.filter((d) => d !== jsDay) : [...prev, jsDay]));
  }

  function pickPhoto(file) {
    if (!file) return;
    setPhotoFile(file);
    setPhotoUrl("");
    const reader = new FileReader();
    reader.onload = (e) => setPhotoPreview(e.target.result);
    reader.readAsDataURL(file);
  }

  function submit() {
    let frequency = { type: "daily" };
    if (freqType === "weekly") frequency = { type: "weekly", days: weekdays };
    if (freqType === "date") frequency = { type: "date", date };
    onAdd(assignIds, title, Number(points) || 1, frequency, photoFile, description, kind, photoUrl);
    setTitle(""); setDescription(""); setPoints(1); setFreqType("daily"); setWeekdays([]); setDate(""); setPhotoFile(null); setPhotoPreview(null); setPhotoUrl(""); setKind("reward"); setAssignIds([]); setShowForm(false);
  }

  const filtered = tasks.filter((t) => t.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <section className="fr-dark-surface">
      <h2 className="fr-dark-title">Tareas</h2>
      <SearchBar value={query} onChange={setQuery} placeholder="Buscar tareas..." />
      {tasks.length === 0 ? (
        <p className="fr-dark-empty">Aún no hay tareas. Pulsa el botón + para crear la primera. Puedes asignarla a un niño o dejarla sin asignar para otra ocasión.</p>
      ) : (
        <div className="fr-rich-grid">
          {filtered.map((t) => (
            <RichItemCard key={t.id} photo={t.photo} iconFallback={t.kind === "family" ? "🏠" : "✅"} colorFallback={themeColor}
              pill={freqLabelShort(t)} badge={taskBadge(t)} title={t.title} description={t.description}
              onDelete={() => onRemove(t.id)} onPhotoPick={(f) => onUpdatePhoto(t.id, f)} onPhotoUrl={(u) => onUpdatePhotoUrl(t.id, u)}>
              <div className="fr-assign-row">
                <span className="fr-assign-label">👤</span>
                <select className="fr-assign-select" value={t.childId || ""} onChange={(e) => onReassign(t.id, e.target.value || null)}>
                  <option value="">Sin asignar</option>
                  {children.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </RichItemCard>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fr-dark-form">
          <div className="fr-form-row">
            <label className="fr-dark-photo-picker">
              {photoPreview ? <span className="fr-onboarding-photo-preview" style={{ backgroundImage: `url(${photoPreview})` }} />
                : photoUrl ? <span className="fr-onboarding-photo-preview" style={{ backgroundImage: `url(${photoUrl})` }} />
                : <span>➕ foto</span>}
              <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => pickPhoto(e.target.files[0])} />
            </label>
            <input className="fr-dark-input" style={{ flex: 1 }} placeholder="Nombre de la tarea" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <input className="fr-dark-input" placeholder="…o pega la URL de una imagen (https://...)" value={photoUrl}
            onChange={(e) => { setPhotoUrl(e.target.value); setPhotoFile(null); setPhotoPreview(null); }} />
          <input className="fr-dark-input" placeholder="Descripción (opcional)" value={description} onChange={(e) => setDescription(e.target.value)} />
          <div className="fr-assign-form">
            <label className="fr-dark-label">Asignar a (uno, varios o ninguno):</label>
            <div className="fr-assign-chips">
              {children.map((c) => (
                <button key={c.id} type="button"
                  className={"fr-assign-chip" + (assignIds.includes(c.id) ? " fr-assign-chip-active" : "")}
                  style={{ "--child-color": c.color }} onClick={() => toggleAssign(c.id)}>
                  {assignIds.includes(c.id) ? "✓ " : ""}{c.name}
                </button>
              ))}
            </div>
            {assignIds.length === 0 && <span className="fr-assign-hint">Sin asignar: se guarda para otra ocasión.</span>}
          </div>
          <div className="fr-freq-toggle">
            {[["reward", "🪙 Con recompensa"], ["family", "🏠 Responsabilidad familiar"]].map(([key, label]) => (
              <button key={key} className={"fr-dark-chip" + (kind === key ? " fr-dark-chip-active" : "")} style={{ "--child-color": themeColor }} onClick={() => setKind(key)}>{label}</button>
            ))}
          </div>
          {kind === "reward" && (
            <div className="fr-form-row">
              <label className="fr-dark-label">Monedas:</label>
              <input type="number" min="1" max="20" className="fr-dark-input fr-dark-input-small" value={points} onChange={(e) => setPoints(e.target.value)} />
            </div>
          )}
          <div className="fr-freq-toggle">
            {[["daily", "Diaria"], ["weekly", "Días de la semana"], ["date", "Fecha concreta"]].map(([key, label]) => (
              <button key={key} className={"fr-dark-chip" + (freqType === key ? " fr-dark-chip-active" : "")} style={{ "--child-color": themeColor }} onClick={() => setFreqType(key)}>{label}</button>
            ))}
          </div>
          {freqType === "weekly" && (
            <div className="fr-weekday-picker">
              {WEEKDAY_LABELS.map((label, idx) => {
                const jsDay = idx === 6 ? 0 : idx + 1;
                return (
                  <button key={idx} className={"fr-weekday-chip" + (weekdays.includes(jsDay) ? " fr-weekday-chip-active" : "")} style={{ "--child-color": themeColor }} onClick={() => toggleWeekday(idx)}>{label}</button>
                );
              })}
            </div>
          )}
          {freqType === "date" && (
            <input type="date" className="fr-dark-input" value={date} onChange={(e) => setDate(e.target.value)} />
          )}
          <div className="fr-form-row" style={{ justifyContent: "flex-end" }}>
            <button className="fr-btn fr-btn-ghost fr-btn-small" onClick={() => setShowForm(false)}>Cancelar</button>
            <button className="fr-btn fr-btn-primary" style={{ background: themeColor }} onClick={submit}>Añadir tarea</button>
          </div>
        </div>
      )}

      <button className="fr-fab" style={{ background: themeColor }} onClick={() => setShowForm((s) => !s)} title="Añadir tarea">
        {showForm ? "✕" : "+"}
      </button>
    </section>
  );
}

/* ---------------- Parent: Rewards manager ---------------- */
function RewardsManager({ activeChild, rewards, onAdd, onRemove, onUpdatePhoto, onUpdatePhotoUrl, redemptions }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [cost, setCost] = useState(5);
  const [icon, setIcon] = useState("🎁");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [query, setQuery] = useState("");

  const redeemCount = (rewardId) => (redemptions || []).filter((r) => r.rewardId === rewardId && r.status === "approved").length;

  function pickPhoto(file) {
    if (!file) return;
    setPhotoFile(file);
    setPhotoUrl("");
    const reader = new FileReader();
    reader.onload = (e) => setPhotoPreview(e.target.result);
    reader.readAsDataURL(file);
  }

  function submit() {
    onAdd(title, cost, icon, photoFile, description, tag, photoUrl);
    setTitle(""); setDescription(""); setTag(""); setCost(5); setIcon("🎁"); setPhotoFile(null); setPhotoPreview(null); setPhotoUrl(""); setShowForm(false);
  }

  const filtered = rewards.filter((r) => r.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <section className="fr-dark-surface">
      <h2 className="fr-dark-title">Recompensas de {activeChild.name}</h2>
      <SearchBar value={query} onChange={setQuery} placeholder="Buscar recompensas..." />
      <p className="fr-tip">💡 Ve rotando las recompensas de vez en cuando: la variedad mantiene la motivación.</p>
      {rewards.length === 0 ? (
        <p className="fr-dark-empty">Aún no hay recompensas. Pulsa el botón + para crear la primera.</p>
      ) : (
        <div className="fr-rich-grid">
          {filtered.map((r) => {
            const count = redeemCount(r.id);
            const pill = count >= 5 ? "🔁 Muy repetida" : r.tag;
            return (
              <RichItemCard key={r.id} photo={r.photo} iconFallback={r.icon} colorFallback={activeChild.color}
                pill={pill} badge={<>{r.cost} <Coin /></>} title={r.title} description={r.description}
                onDelete={() => onRemove(r.id)} onPhotoPick={(f) => onUpdatePhoto(r.id, f)} onPhotoUrl={(u) => onUpdatePhotoUrl(r.id, u)} />
            );
          })}
        </div>
      )}

      {showForm && (
        <div className="fr-dark-form">
          <div className="fr-form-row">
            <label className="fr-dark-photo-picker">
              {photoPreview ? <span className="fr-onboarding-photo-preview" style={{ backgroundImage: `url(${photoPreview})` }} />
                : photoUrl ? <span className="fr-onboarding-photo-preview" style={{ backgroundImage: `url(${photoUrl})` }} />
                : <span>➕ foto</span>}
              <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => pickPhoto(e.target.files[0])} />
            </label>
            <input className="fr-dark-input" style={{ flex: 1 }} placeholder="Nombre de la recompensa" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <input className="fr-dark-input" placeholder="…o pega la URL de una imagen (https://...)" value={photoUrl}
            onChange={(e) => { setPhotoUrl(e.target.value); setPhotoFile(null); setPhotoPreview(null); }} />
          <input className="fr-dark-input" placeholder="Descripción (opcional)" value={description} onChange={(e) => setDescription(e.target.value)} />
          <input className="fr-dark-input" placeholder="Etiqueta (opcional, ej. Tiempo en familia)" value={tag} onChange={(e) => setTag(e.target.value)} />
          <div className="fr-form-row">
            <label className="fr-dark-label">Coste:</label>
            <input type="number" min="1" className="fr-dark-input fr-dark-input-small" value={cost} onChange={(e) => setCost(e.target.value)} />
            <label className="fr-dark-label">Icono:</label>
            <input className="fr-dark-input fr-dark-input-small" value={icon} onChange={(e) => setIcon(e.target.value)} />
          </div>
          <div className="fr-form-row" style={{ justifyContent: "flex-end" }}>
            <button className="fr-btn fr-btn-ghost fr-btn-small" onClick={() => setShowForm(false)}>Cancelar</button>
            <button className="fr-btn fr-btn-primary" style={{ background: activeChild.color }} onClick={submit}>Añadir recompensa</button>
          </div>
        </div>
      )}

      <button className="fr-fab" style={{ background: activeChild.color }} onClick={() => setShowForm((s) => !s)} title="Añadir recompensa">
        {showForm ? "✕" : "+"}
      </button>
    </section>
  );
}

/* ---------------- Parent: Settings ---------------- */
function SettingsPanel({ settings, onUpdate, children, activeChild, onSetColor, onSetTheme, parentTheme, onSetParentTheme }) {
  return (
    <>
      <section className="fr-card">
        <h2 className="fr-card-title">Fondo del modo padres</h2>
        <div className="fr-theme-grid">
          {Object.entries(THEMES).map(([key, t]) => (
            <button key={key} className={"fr-theme-chip" + ((parentTheme || "default") === key ? " fr-theme-chip-active" : "")}
              style={{ "--child-color": "#A78BFA" }} onClick={() => onSetParentTheme(key)}>{t.label}</button>
          ))}
        </div>
        <p className="fr-empty">Este es el fondo que verás tú en el modo padres. Cada niño tiene el suyo, independiente.</p>
      </section>

      <section className="fr-card">
        <h2 className="fr-card-title">Fondo de {activeChild.name}</h2>
        <div className="fr-theme-grid">
          {Object.entries(THEMES).map(([key, t]) => (
            <button key={key} className={"fr-theme-chip" + (themeOf(activeChild) === key ? " fr-theme-chip-active" : "")}
              style={{ "--child-color": activeChild.color }} onClick={() => onSetTheme(activeChild.id, key)}>{t.label}</button>
          ))}
        </div>
        <p className="fr-empty">Cambia el fondo del perfil y la animación de premios. Elige el de cada hijo cambiando de niño arriba.</p>
      </section>

      <section className="fr-card">
        <h2 className="fr-card-title">Penalizaciones</h2>
        <label className="fr-switch-row">
          <span>Restar monedas por tareas no hechas</span>
          <input type="checkbox" checked={!!settings.penaltyEnabled} onChange={(e) => onUpdate({ penaltyEnabled: e.target.checked })} />
        </label>
        <p className="fr-empty">Desactivado por defecto. Si lo activas, cada tarea con recompensa que caduque sin hacerse resta las monedas que valía. El saldo nunca baja de 0, y se recupera si más tarde apruebas esa tarea.</p>
      </section>

      <section className="fr-card">
        <h2 className="fr-card-title">Racha</h2>
        <div className="fr-form-row">
          <label className="fr-form-label">Días comodín:</label>
          <input type="number" min="0" max="3" className="fr-text-input fr-text-input-small"
            value={settings.graceDays ?? 1}
            onChange={(e) => onUpdate({ graceDays: Math.max(0, Math.min(3, Number(e.target.value) || 0)) })} />
        </div>
        <p className="fr-empty">Cuántos días se pueden fallar sin romper la racha. Recomendado: 1, para que un despiste no eche por tierra el progreso.</p>
      </section>

      <section className="fr-card">
        <h2 className="fr-card-title">Color de {activeChild.name}</h2>
        <div className="fr-color-swatches">
          {THEME_COLORS.map((c) => (
            <button key={c} className={"fr-swatch" + (activeChild.color === c ? " fr-swatch-active" : "")}
              style={{ background: c }} onClick={() => onSetColor(activeChild.id, c)} title="Elegir color" />
          ))}
        </div>
        <p className="fr-empty">Cada hijo puede tener su propio color. Cambia de hijo en las pestañas de arriba para personalizar el de cada uno.</p>
      </section>
    </>
  );
}

/* ---------------- Challenges ---------------- */
function ChallengesView({ child, challenges, onDone, specialMedals }) {
  const open = challenges.filter((c) => c.status !== "done");
  const medals = specialMedals || [];
  return (
    <>
      <section className="fr-dark-surface">
        <h2 className="fr-dark-title">Desafíos 🏅</h2>
        {open.length === 0 ? (
          <p className="fr-dark-empty">No tienes desafíos ahora mismo. ¡Pronto habrá nuevos retos!</p>
        ) : (
          <div className="fr-rich-grid">
            {open.map((c) => (
              <RichItemCard key={c.id} photo={c.photo} iconFallback={c.medalIcon} colorFallback={child.color}
                pill={"🏅 " + c.medalName} badge={null} title={c.title} description={c.description}>
                {c.status === "pending" ? (
                  <div className="fr-rich-status fr-rich-status-wait">⏳ Esperando aprobación</div>
                ) : (
                  <button className="fr-rich-action" style={{ background: child.color }} onClick={() => onDone(c.id)}>¡Completado!</button>
                )}
              </RichItemCard>
            ))}
          </div>
        )}
      </section>

      <section className="fr-dark-surface">
        <h2 className="fr-dark-title">Medallas especiales conseguidas</h2>
        {medals.length === 0 ? (
          <p className="fr-dark-empty">Aún no has ganado medallas especiales. ¡A por los desafíos!</p>
        ) : (
          <div className="fr-badge-shelf">
            {medals.map((m, i) => (
              <div key={i} className="fr-badge fr-badge-unlocked" title={m.name}>
                <div className="fr-badge-icon">{m.icon}</div>
                <div className="fr-badge-name">{m.name}</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function ChallengesManager({ children, challenges, onAdd, onRemove, onDecide }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [medalName, setMedalName] = useState("Medalla especial");
  const [medalIcon, setMedalIcon] = useState("🏅");
  const [assignId, setAssignId] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [showForm, setShowForm] = useState(false);
  const themeColor = "#A78BFA";
  const nameOf = (id) => { const c = children.find((x) => x.id === id); return c ? c.name : "Sin asignar"; };
  const statusLabel = (s) => (s === "pending" ? "⏳ Por aprobar" : s === "done" ? "✅ Conseguido" : "Abierto");

  function pickPhoto(file) {
    if (!file) return;
    setPhotoFile(file);
    setPhotoUrl("");
    const r = new FileReader();
    r.onload = (e) => setPhotoPreview(e.target.result);
    r.readAsDataURL(file);
  }
  function submit() {
    onAdd(assignId || null, title, description, medalIcon, medalName, photoFile, photoUrl);
    setTitle(""); setDescription(""); setMedalName("Medalla especial"); setMedalIcon("🏅"); setAssignId(""); setPhotoFile(null); setPhotoPreview(null); setPhotoUrl(""); setShowForm(false);
  }

  return (
    <section className="fr-dark-surface">
      <h2 className="fr-dark-title">Desafíos</h2>
      <p className="fr-tip">🏅 Los desafíos dan una medalla especial (no monedas). Perfectos para retos puntuales.</p>
      {challenges.length === 0 ? (
        <p className="fr-dark-empty">Aún no hay desafíos. Pulsa + para crear uno.</p>
      ) : (
        <div className="fr-rich-grid">
          {challenges.map((c) => (
            <RichItemCard key={c.id} photo={c.photo} iconFallback={c.medalIcon} colorFallback={themeColor}
              pill={"🏅 " + c.medalName} badge={null} title={c.title} description={c.description} onDelete={() => onRemove(c.id)}>
              <div className="fr-assign-row"><span className="fr-assign-label">👤</span><span className="fr-assign-static">{nameOf(c.childId)} · {statusLabel(c.status)}</span></div>
              {c.status === "pending" && (
                <div className="fr-approve-actions" style={{ marginTop: 6 }}>
                  <button className="fr-btn fr-btn-small fr-btn-approve" onClick={() => onDecide(c.id, "approved")}>Aprobar</button>
                  <button className="fr-btn fr-btn-small fr-btn-reject" onClick={() => onDecide(c.id, "rejected")}>Rechazar</button>
                </div>
              )}
            </RichItemCard>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fr-dark-form">
          <div className="fr-form-row">
            <label className="fr-dark-photo-picker">
              {photoPreview ? <span className="fr-onboarding-photo-preview" style={{ backgroundImage: `url(${photoPreview})` }} />
                : photoUrl ? <span className="fr-onboarding-photo-preview" style={{ backgroundImage: `url(${photoUrl})` }} />
                : <span>➕ foto</span>}
              <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => pickPhoto(e.target.files[0])} />
            </label>
            <input className="fr-dark-input" style={{ flex: 1 }} placeholder="Nombre del desafío" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <input className="fr-dark-input" placeholder="…o pega la URL de una imagen (https://...)" value={photoUrl} onChange={(e) => { setPhotoUrl(e.target.value); setPhotoFile(null); setPhotoPreview(null); }} />
          <input className="fr-dark-input" placeholder="Descripción (opcional)" value={description} onChange={(e) => setDescription(e.target.value)} />
          <div className="fr-form-row">
            <label className="fr-dark-label">Medalla:</label>
            <input className="fr-dark-input fr-dark-input-small" value={medalIcon} onChange={(e) => setMedalIcon(e.target.value)} />
            <input className="fr-dark-input" style={{ flex: 1 }} placeholder="Nombre de la medalla" value={medalName} onChange={(e) => setMedalName(e.target.value)} />
          </div>
          <div className="fr-form-row">
            <label className="fr-dark-label">Para:</label>
            <select className="fr-dark-input" value={assignId} onChange={(e) => setAssignId(e.target.value)}>
              <option value="">Sin asignar</option>
              {children.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="fr-form-row" style={{ justifyContent: "flex-end" }}>
            <button className="fr-btn fr-btn-ghost fr-btn-small" onClick={() => setShowForm(false)}>Cancelar</button>
            <button className="fr-btn fr-btn-primary" style={{ background: themeColor }} onClick={submit}>Crear desafío</button>
          </div>
        </div>
      )}

      <button className="fr-fab" style={{ background: themeColor }} onClick={() => setShowForm((s) => !s)} title="Nuevo desafío">{showForm ? "✕" : "+"}</button>
    </section>
  );
}

/* ---------------- Onboarding ---------------- */
function Onboarding({ onFinish }) {
  const [step, setStep] = useState(0);
  const [familyName, setFamilyName] = useState("");
  const [names, setNames] = useState(["", ""]);
  const [photos, setPhotos] = useState([null, null]);
  const [pin, setPin] = useState("");
  const [taskSelections, setTaskSelections] = useState([new Set(), new Set()]);
  const [rewardSelections, setRewardSelections] = useState([new Set(), new Set()]);

  async function handlePhotoPick(i, file) {
    if (!file) return;
    try {
      const dataUrl = await fileToResizedDataUrl(file);
      setPhotos((prev) => { const copy = [...prev]; copy[i] = dataUrl; return copy; });
    } catch (e) {
      console.error("No se pudo cargar la foto", e);
    }
  }

  function toggleSet(setter, childIdx, key) {
    setter((prev) => {
      const copy = prev.map((s) => new Set(s));
      if (copy[childIdx].has(key)) copy[childIdx].delete(key);
      else copy[childIdx].add(key);
      return copy;
    });
  }

  function finish() {
    const children = names
      .map((n, i) => (n.trim() ? { id: uid(), name: n.trim(), color: CHILD_COLORS[i], emoji: CHILD_EMOJIS[i], photo: photos[i] || null } : null))
      .filter(Boolean);
    const tasks = [];
    const rewards = [];
    children.forEach((c, i) => {
      taskSelections[i].forEach((idx) => {
        const preset = PRESET_TASKS[idx];
        tasks.push({ id: uid(), childId: c.id, title: preset.title, points: preset.points, frequency: preset.frequency, active: true, createdDate: todayKey(0) });
      });
      rewardSelections[i].forEach((idx) => {
        const preset = PRESET_REWARDS[idx];
        rewards.push({ id: uid(), childId: c.id, title: preset.title, cost: preset.cost, icon: preset.icon, active: true });
      });
    });
    onFinish({ pin: pin || "0000", familyName: familyName.trim(), children, tasks, rewards, logs: {}, achievements: {}, records: {}, redemptions: [], bonuses: [], praise: null, settings: { penaltyEnabled: false, graceDays: 1 } });
  }

  return (
    <div style={styles.appBg}>
      <StyleBlock />
      <div className="fr-onboarding">
        <div className="fr-brand" style={{ marginBottom: 24 }}>
          <img src={APP_ICON} alt="" className="fr-brand-icon" /><span className="fr-brand-name">Family Rewards</span>
        </div>

        {step === 0 && (
          <div className="fr-card">
            <h2 className="fr-card-title">¡Vamos a montar la fiesta!</h2>
            <p className="fr-empty">Escribe el nombre de cada hijo o hija que usará la app, y añade una foto si quieres.</p>
            <input
              className="fr-text-input fr-onboarding-input"
              placeholder="Nombre de la familia (opcional, ej. García)"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              style={{ marginBottom: 14 }}
            />
            {[0, 1].map((i) => (
              <div key={i} className="fr-onboarding-name-row">
                <label className="fr-onboarding-photo-picker" style={{ "--child-color": CHILD_COLORS[i] }}>
                  {photos[i] ? (
                    <span className="fr-onboarding-photo-preview" style={{ backgroundImage: `url(${photos[i]})` }} />
                  ) : (
                    <span>{CHILD_EMOJIS[i]}</span>
                  )}
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handlePhotoPick(i, e.target.files[0])} />
                </label>
                <input className="fr-text-input fr-onboarding-input" placeholder={`Nombre del hijo/a ${i + 1}`} value={names[i]}
                  onChange={(e) => { const copy = [...names]; copy[i] = e.target.value; setNames(copy); }} />
              </div>
            ))}
            <button className="fr-btn fr-btn-primary" disabled={!names[0].trim()} onClick={() => setStep(1)}>Continuar</button>
          </div>
        )}

        {step === 1 && (
          <div className="fr-card">
            <h2 className="fr-card-title">Elige las primeras tareas</h2>
            {names.map((n, i) => n.trim() ? (
              <div key={i} className="fr-onboarding-child-block">
                <h3 style={{ color: CHILD_COLORS[i], fontFamily: "'Fredoka', sans-serif" }}>{n}</h3>
                <div className="fr-preset-grid">
                  {PRESET_TASKS.map((preset, idx) => (
                    <button key={idx} className={"fr-preset-chip" + (taskSelections[i].has(idx) ? " fr-preset-chip-active" : "")}
                      style={{ "--child-color": CHILD_COLORS[i] }} onClick={() => toggleSet(setTaskSelections, i, idx)}>
                      {preset.title}
                    </button>
                  ))}
                </div>
              </div>
            ) : null)}
            <div className="fr-modal-actions">
              <button className="fr-btn fr-btn-ghost" onClick={() => setStep(0)}>Atrás</button>
              <button className="fr-btn fr-btn-primary" onClick={() => setStep(2)}>Continuar</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fr-card">
            <h2 className="fr-card-title">Elige las primeras recompensas</h2>
            {names.map((n, i) => n.trim() ? (
              <div key={i} className="fr-onboarding-child-block">
                <h3 style={{ color: CHILD_COLORS[i], fontFamily: "'Fredoka', sans-serif" }}>{n}</h3>
                <div className="fr-preset-grid">
                  {PRESET_REWARDS.map((preset, idx) => (
                    <button key={idx} className={"fr-preset-chip" + (rewardSelections[i].has(idx) ? " fr-preset-chip-active" : "")}
                      style={{ "--child-color": CHILD_COLORS[i] }} onClick={() => toggleSet(setRewardSelections, i, idx)}>
                      {preset.icon} {preset.title} · {preset.cost} <Coin />
                    </button>
                  ))}
                </div>
              </div>
            ) : null)}
            <div className="fr-modal-actions">
              <button className="fr-btn fr-btn-ghost" onClick={() => setStep(1)}>Atrás</button>
              <button className="fr-btn fr-btn-primary" onClick={() => setStep(3)}>Continuar</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="fr-card">
            <h2 className="fr-card-title">Crea un PIN para el modo padres</h2>
            <p className="fr-empty">Lo pedirá la app antes de aprobar tareas, canjes o cambiar ajustes.</p>
            <input type="password" inputMode="numeric" maxLength={6} className="fr-pin-input" placeholder="Ej. 1234" value={pin} onChange={(e) => setPin(e.target.value)} />
            <div className="fr-modal-actions">
              <button className="fr-btn fr-btn-ghost" onClick={() => setStep(2)}>Atrás</button>
              <button className="fr-btn fr-btn-primary" disabled={pin.length < 4} onClick={finish}>Empezar 🎉</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  appBg: { minHeight: "100%", background: "#FFF8EF", fontFamily: "'Nunito Sans', sans-serif" },
};

function StyleBlock() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito+Sans:wght@400;600;700&display=swap');

      .fr-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px 10px 20px; }
      .fr-topbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;
        width: calc(100% - 40px); max-width: 1120px; box-sizing: border-box;
        margin: calc(env(safe-area-inset-top, 0px) + 14px) auto 12px auto; padding: 12px 18px; background: rgba(255,255,255,0.78);
        backdrop-filter: blur(6px); border-radius: 22px; box-shadow: 0 4px 16px rgba(107,78,154,0.12); }
      .fr-topbar-actions { display: flex; gap: 8px; }
      .fr-brand-text { display: flex; flex-direction: column; line-height: 1.1; }
      .fr-familyname-sub { font-size: 13px; color: #8A7BB0; font-family: 'Nunito Sans', sans-serif; display: inline-flex; align-items: center; gap: 8px; margin-top: 2px; }
      .fr-familyname-editbtn { background: none; border: none; color: #A78BFA; font-size: 12px; cursor: pointer; font-family: 'Nunito Sans', sans-serif; font-weight: 700; padding: 0; }
      .fr-familyname-edit { display: inline-flex; align-items: center; gap: 6px; margin-top: 3px; }
      .fr-familyname-input { border: 2px solid #E9E0FF; border-radius: 8px; padding: 4px 8px; font-size: 13px; color: #6B4E9A; font-family: 'Nunito Sans', sans-serif; }
      .fr-mini-btn { border: none; border-radius: 8px; padding: 5px 10px; font-size: 12px; font-weight: 700; cursor: pointer; background: #FF6FA5; color: white; font-family: 'Fredoka', sans-serif; }
      .fr-mini-btn-ghost { background: #EDE7F7; color: #6B4E9A; }
      .fr-familyname-row { display: flex; align-items: center; gap: 10px; padding: 0 20px 10px 20px; flex-wrap: wrap; }
      .fr-familyname-text { font-family: 'Fredoka', sans-serif; font-size: 15px; color: #6B4E9A; }
      .fr-familyname-editbtn { background: none; border: none; color: #A78BFA; font-size: 12px; cursor: pointer; font-family: 'Nunito Sans', sans-serif; font-weight: 700; padding: 2px 0; }
      .fr-familyname-edit { display: flex; align-items: center; gap: 8px; padding: 0 20px 10px 20px; flex-wrap: wrap; }
      .fr-brand { display: flex; align-items: center; gap: 8px; }
      .fr-brand-mark { font-size: 28px; }
      .fr-brand-icon { width: 40px; height: 40px; border-radius: 11px; display: block; }
      .fr-brand-name { font-family: 'Fredoka', sans-serif; font-weight: 700; font-size: 24px; color: #A78BFA; letter-spacing: 0.3px; }
      .fr-child-tabs { display: flex; gap: 8px; padding: 0 20px 12px 20px; flex-wrap: wrap; max-width: 1120px; margin: 0 auto; }
      .fr-child-tab {
        display: flex; align-items: center; gap: 12px; border: 3px solid var(--child-color, #A78BFA);
        background: white; color: #6B4E9A; font-family: 'Fredoka', sans-serif; font-weight: 600;
        padding: 5px 22px 5px 5px; border-radius: 999px; cursor: pointer; font-size: 16px;
        box-shadow: 0 3px 0 var(--child-color, #A78BFA);
      }
      .fr-child-tab-active { background: var(--child-color, #A78BFA); color: white; }
      .fr-child-emoji { font-size: 26px; margin-left: 12px; }
      .fr-child-tab-wrap { position: relative; display: inline-flex; }
      .fr-avatar-ring { width: 66px; height: 66px; border-radius: 50%; padding: 4px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; flex: none; }
      .fr-child-avatar { width: 100%; height: 100%; border-radius: 50%; background-size: cover; background-position: center; display: block; border: 2px solid white; box-sizing: border-box; }
      .fr-child-avatar-emoji { display: flex; align-items: center; justify-content: center; background: #F3EEFF; font-size: 30px; }
      .fr-child-tab-name { white-space: nowrap; }
      .fr-photo-edit {
        position: absolute; bottom: -6px; right: -6px; width: 22px; height: 22px; border-radius: 50%;
        background: white; border: 2px solid #A78BFA; display: flex; align-items: center; justify-content: center;
        font-size: 11px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.15);
      }
      .fr-balance-bar {
        margin: 0 auto 10px auto; max-width: 1120px; background: white; border: 3px solid; border-radius: 999px;
        padding: 10px 18px; display: flex; align-items: center; gap: 8px; width: fit-content;
        font-family: 'Fredoka', sans-serif; box-shadow: 0 3px 0 rgba(0,0,0,0.05);
      }
      .fr-balance-star { font-size: 20px; }
      .fr-balance-num { font-size: 20px; font-weight: 700; color: #6B4E9A; }
      .fr-balance-label { font-size: 13px; color: #A78BFA; font-family: 'Nunito Sans', sans-serif; }
      .fr-balance-penalty { font-family: 'Fredoka', sans-serif; font-size: 13px; color: #E0573E; background: #FDEAE6; padding: 2px 10px; border-radius: 999px; }
      .fr-subtabs { display: flex; gap: 6px; padding: 0 20px 10px 20px; flex-wrap: wrap; max-width: 1120px; margin: 0 auto; }
      .fr-subtab {
        border: none; background: #F3EEFF; color: #6B4E9A; font-family: 'Fredoka', sans-serif; font-weight: 600;
        padding: 8px 16px; border-radius: 14px; cursor: pointer; font-size: 14px;
      }
      .fr-subtab-active { background: var(--child-color, #A78BFA); color: white; }
      .fr-tab-badge { display: inline-block; margin-left: 6px; background: #FF6F6F; color: white; font-size: 11px; font-weight: 700; min-width: 18px; height: 18px; line-height: 18px; text-align: center; border-radius: 999px; padding: 0 5px; }
      .fr-main { padding: 4px 20px 40px 20px; max-width: 1120px; margin: 0 auto; }
      .fr-onboarding { padding: 4px 20px 40px 20px; max-width: 640px; margin: 0 auto; }
      .fr-card { background: white; border-radius: 24px; padding: 20px; margin-bottom: 18px; box-shadow: 0 4px 14px rgba(167,139,250,0.15); border: 2px solid #F3EEFF; }
      .fr-card-title { font-family: 'Fredoka', sans-serif; font-size: 20px; color: #6B4E9A; margin: 0 0 14px 0; }
      .fr-empty { color: #A99BC7; font-size: 14px; line-height: 1.5; }
      .fr-task-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
      .fr-task-item { display: flex; align-items: center; justify-content: space-between; gap: 10px; background: #FBF9FF; border-radius: 16px; padding: 12px 14px; }
      .fr-task-title-row { display: flex; align-items: center; gap: 10px; }
      .fr-task-photo-wrap { position: relative; flex: none; }
      .fr-task-thumb { width: 40px; height: 40px; border-radius: 12px; object-fit: cover; display: block; }
      .fr-task-thumb-empty { display: flex; align-items: center; justify-content: center; background: #F3EEFF; font-size: 16px; }
      .fr-photo-edit-task { position: absolute; bottom: -6px; right: -6px; width: 18px; height: 18px; font-size: 9px; }
      .fr-upcoming-day { margin-bottom: 14px; }
      .fr-upcoming-date { font-family: 'Fredoka', sans-serif; font-size: 13px; color: #A78BFA; text-transform: capitalize; margin-bottom: 6px; }
      .fr-task-title { font-weight: 700; color: #6B4E9A; font-size: 15px; font-family: 'Nunito Sans', sans-serif; }
      .fr-task-date { color: #A99BC7; font-weight: 400; font-size: 12px; }
      .fr-points-badge { background: #FFF3D0; color: #C98A00; border-radius: 999px; padding: 2px 8px; font-size: 12px; margin-left: 4px; }
      .fr-pill { border: none; border-radius: 999px; padding: 7px 12px; font-size: 12px; font-weight: 700; font-family: 'Nunito Sans', sans-serif; cursor: default; }
      .fr-pill-approved { background: #E1F7E8; color: #2F9E5B; }
      .fr-pill-pending { background: #FFE8D6; color: #E0793A; cursor: pointer; }
      .fr-btn { border: none; border-radius: 999px; padding: 10px 18px; font-weight: 700; cursor: pointer; font-family: 'Fredoka', sans-serif; font-size: 14px; color: white; background: #A78BFA; box-shadow: 0 3px 0 rgba(0,0,0,0.12); }
      .fr-btn-small { padding: 7px 14px; font-size: 13px; }
      .fr-btn-primary { background: #FF6FA5; }
      .fr-btn-primary:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: none; }
      .fr-btn-ghost { background: white; color: #6B4E9A; border: 2px solid #D9CCFF; box-shadow: none; }
      .fr-btn-approve { background: #6FCF97; color: white; }
      .fr-btn-reject { background: #FF6F6F; color: white; }
      .fr-approve-actions { display: flex; gap: 8px; }
      .fr-trail-path { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
      .fr-stone { width: 46px; height: 46px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; color: white; box-shadow: 0 3px 0 rgba(0,0,0,0.1); }
      .fr-stone-count { background: #FF6F6F; font-size: 13px; font-weight: 700; width: auto; padding: 0 12px; font-family: 'Fredoka', sans-serif; }
      .fr-stone-milestone { background: #FFF3D0; border: 3px dashed #FFC93C; }
      .fr-trail-caption { margin-top: 12px; color: #A99BC7; font-size: 13px; }
      .fr-badge-shelf { display: flex; gap: 14px; flex-wrap: wrap; }
      .fr-badge { width: 100px; text-align: center; opacity: 0.4; }
      .fr-badge-unlocked { opacity: 1; }
      .fr-badge-icon { font-size: 32px; }
      .fr-badge-name { font-family: 'Fredoka', sans-serif; font-size: 12px; color: #6B4E9A; margin-top: 2px; }
      .fr-badge-days { font-size: 11px; color: #A99BC7; }
      .fr-reward-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 14px; }
      .fr-reward-card { background: #FBF9FF; border-radius: 18px; padding: 14px; text-align: center; }
      .fr-reward-icon { font-size: 30px; }
      .fr-reward-photo { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 12px; display: block; }
      .fr-reward-title { font-family: 'Fredoka', sans-serif; font-size: 13px; color: #6B4E9A; margin: 6px 0 2px 0; min-height: 32px; }
      .fr-reward-cost { font-size: 13px; color: #C98A00; font-weight: 700; margin-bottom: 8px; }
      .fr-form-block { display: flex; flex-direction: column; gap: 10px; margin-top: 14px; }
      .fr-form-row { display: flex; align-items: center; gap: 8px; }
      .fr-form-label { font-size: 13px; color: #6B4E9A; font-weight: 700; }
      .fr-text-input { border: 2px solid #E9E0FF; border-radius: 12px; padding: 10px 12px; font-family: 'Nunito Sans', sans-serif; font-size: 14px; color: #6B4E9A; }
      .fr-text-input-small { width: 64px; }
      .fr-freq-toggle { display: flex; gap: 8px; flex-wrap: wrap; }
      .fr-weekday-picker { display: flex; gap: 6px; }
      .fr-weekday-chip { width: 36px; height: 36px; border-radius: 50%; border: 2px solid var(--child-color); background: white; color: #6B4E9A; font-weight: 700; cursor: pointer; }
      .fr-weekday-chip-active { background: var(--child-color); color: white; }
      .fr-onboarding-input { display: block; width: 100%; box-sizing: border-box; }
      .fr-onboarding-name-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
      .fr-onboarding-photo-picker {
        flex: none; width: 48px; height: 48px; border-radius: 50%; border: 2px dashed var(--child-color);
        display: flex; align-items: center; justify-content: center; font-size: 20px; cursor: pointer;
        color: var(--child-color); background: #FBF9FF; overflow: hidden;
      }
      .fr-onboarding-photo-preview { width: 100%; height: 100%; background-size: cover; background-position: center; display: block; }
      .fr-onboarding-child-block { margin-bottom: 18px; }
      .fr-preset-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
      .fr-preset-chip { border: 2px solid var(--child-color); background: white; color: #6B4E9A; border-radius: 999px; padding: 8px 14px; font-size: 13px; cursor: pointer; font-family: 'Nunito Sans', sans-serif; font-weight: 600; }
      .fr-preset-chip-active { background: var(--child-color); color: white; }
      .fr-modal-overlay { position: fixed; inset: 0; background: rgba(107,78,154,0.5); display: flex; align-items: center; justify-content: center; z-index: 50; }
      .fr-modal { background: white; border-radius: 24px; padding: 24px; width: 280px; }
      .fr-modal-title { font-family: 'Fredoka', sans-serif; margin: 0 0 6px 0; color: #6B4E9A; }
      .fr-modal-sub { font-size: 13px; color: #A99BC7; margin: 0 0 14px 0; }
      .fr-pin-input { width: 100%; box-sizing: border-box; border: 2px solid #E9E0FF; border-radius: 12px; padding: 10px 12px; font-size: 18px; letter-spacing: 4px; text-align: center; margin-bottom: 10px; }
      .fr-error { color: #FF6F6F; font-size: 12px; margin-bottom: 10px; }
      .fr-modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 14px; }
      .fr-celebration { position: fixed; inset: 0; background: rgba(107,78,154,0.55); display: flex; align-items: center; justify-content: center; z-index: 60; }
      .fr-celebration-card { background: white; border-radius: 24px; padding: 28px; text-align: center; width: 260px; }
      .fr-celebration-title { font-family: 'Fredoka', sans-serif; color: #FF6FA5; font-size: 20px; margin-top: 8px; }
      .fr-celebration-sub { color: #6B4E9A; font-size: 14px; margin-top: 6px; }
      .fr-cal-weekdays { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; margin-bottom: 4px; }
      .fr-cal-weekday { text-align: center; font-size: 11px; color: #A99BC7; font-weight: 700; }
      .fr-cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
      .fr-cal-cell { aspect-ratio: 1; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #6B4E9A; font-weight: 700; }
      .fr-cal-cell-blank { background: transparent; }
      .fr-cal-cell-today { outline: 2px solid #6B4E9A; }
      .fr-legend { display: flex; gap: 14px; flex-wrap: wrap; margin-top: 12px; font-size: 12px; color: #6B4E9A; }
      .fr-dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 4px; }

      /* ---- Rewards & tasks sections (light surface, rich cards) ---- */
      .fr-dark-surface { position: relative; background: #F3EEFF; border-radius: 24px; padding: 18px 16px 24px 16px; margin-bottom: 18px; box-shadow: 0 4px 14px rgba(167,139,250,0.15); border: 2px solid #E9E0FF; }
      .fr-dark-title { font-family: 'Fredoka', sans-serif; font-size: 20px; color: #6B4E9A; margin: 4px 2px 14px 2px; }
      .fr-dark-empty { color: #A99BC7; font-size: 14px; line-height: 1.5; padding: 8px 2px; }
      .fr-past-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
      .fr-past-item { display: flex; align-items: center; justify-content: space-between; gap: 10px; background: white; border: 2px solid #F3EEFF; border-radius: 14px; padding: 12px 14px; }
      .fr-past-title { font-family: 'Nunito Sans', sans-serif; font-weight: 700; color: #6B4E9A; font-size: 14px; }
      .fr-past-meta { font-size: 12px; color: #A99BC7; white-space: nowrap; }
      .fr-search-bar { display: flex; align-items: center; gap: 8px; background: white; border: 2px solid #E9E0FF; border-radius: 14px; padding: 10px 14px; margin-bottom: 16px; }
      .fr-search-icon { font-size: 14px; opacity: 0.6; }
      .fr-search-input { flex: 1; background: transparent; border: none; outline: none; color: #6B4E9A; font-family: 'Nunito Sans', sans-serif; font-size: 14px; }
      .fr-search-input::placeholder { color: #A99BC7; }
      .fr-search-clear { background: none; border: none; color: #A99BC7; cursor: pointer; font-size: 14px; }
      .fr-rich-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 16px; }
      .fr-rich-card { background: white; border-radius: 20px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 4px 12px rgba(107,78,154,0.12); border: 2px solid #F3EEFF; }
      .fr-rich-card-dimmed { opacity: 0.6; }
      .fr-rich-media { position: relative; height: 130px; background-size: cover; background-position: center; display: flex; align-items: center; justify-content: center; }
      .fr-rich-media-emoji { font-size: 48px; filter: drop-shadow(0 2px 6px rgba(0,0,0,0.25)); }
      .fr-rich-pill { position: absolute; top: 10px; left: 50%; transform: translateX(-50%); background: rgba(10,12,16,0.6); color: #F4F4F8; font-family: 'Fredoka', sans-serif; font-size: 11px; padding: 4px 12px; border-radius: 999px; white-space: nowrap; max-width: 80%; overflow: hidden; text-overflow: ellipsis; }
      .fr-rich-delete { position: absolute; top: 10px; right: 10px; width: 30px; height: 30px; border: none; border-radius: 50%; background: #F0574B; color: white; font-size: 13px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.25); }
      .fr-rich-photo-actions { position: absolute; bottom: 10px; left: 10px; display: flex; gap: 6px; }
      .fr-rich-photo-edit { width: 30px; height: 30px; border: none; border-radius: 50%; background: rgba(10,12,16,0.6); display: flex; align-items: center; justify-content: center; font-size: 13px; cursor: pointer; color: white; }
      .fr-rich-badge { position: absolute; bottom: 10px; right: 10px; background: rgba(10,12,16,0.68); color: #FFD65C; font-family: 'Fredoka', sans-serif; font-weight: 600; font-size: 13px; padding: 4px 10px; border-radius: 999px; }
      .fr-rich-body { padding: 14px; display: flex; flex-direction: column; gap: 6px; }
      .fr-rich-title { font-family: 'Fredoka', sans-serif; font-size: 16px; color: #6B4E9A; }
      .fr-rich-desc { font-size: 13px; color: #A99BC7; line-height: 1.4; }
      .fr-rich-action { margin-top: 6px; border: none; border-radius: 12px; padding: 11px; font-family: 'Fredoka', sans-serif; font-weight: 600; font-size: 14px; color: white; background: #FF6FA5; cursor: pointer; width: 100%; }
      .fr-reward-progress { margin-top: 4px; }
      .fr-coin { display: inline-block; width: 1em; height: 1em; border-radius: 50%; background: radial-gradient(circle at 34% 30%, #FFE58A 0%, #F7C33A 45%, #E39A16 100%); box-shadow: inset 0 0 0 1.5px #C9820F, 0 1px 1px rgba(0,0,0,0.15); vertical-align: -0.14em; position: relative; }
      .fr-coin::after { content: ""; position: absolute; inset: 24%; border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.55); }
      .fr-coin-lg { width: 1.15em; height: 1.15em; }
      .fr-reward-progress-bar { height: 8px; background: #EDE7F7; border-radius: 999px; overflow: hidden; }
      .fr-reward-progress-bar span { display: block; height: 100%; border-radius: 999px; }
      .fr-reward-progress-text { font-size: 11px; color: #A99BC7; margin-top: 3px; text-align: right; }
      .fr-rich-action:disabled { background: #EDE7F7; color: #A99BC7; cursor: not-allowed; }
      .fr-rich-action-wait { background: #FFE8D6; color: #E0793A; }
      .fr-rich-status { margin-top: 6px; text-align: center; border-radius: 12px; padding: 10px; font-family: 'Fredoka', sans-serif; font-size: 13px; }
      .fr-rich-status-ok { background: #E1F7E8; color: #2F9E5B; }
      .fr-rich-status-wait { background: #FFE8D6; color: #E0793A; }
      .fr-fab { position: absolute; bottom: 16px; right: 16px; width: 52px; height: 52px; border-radius: 50%; border: none; color: white; font-size: 26px; font-family: 'Fredoka', sans-serif; cursor: pointer; box-shadow: 0 4px 14px rgba(107,78,154,0.3); display: flex; align-items: center; justify-content: center; }
      .fr-dark-form { background: white; border: 2px solid #E9E0FF; border-radius: 18px; padding: 16px; margin-top: 16px; display: flex; flex-direction: column; gap: 10px; }
      .fr-dark-input { background: #FBF9FF; border: 2px solid #E9E0FF; border-radius: 10px; padding: 10px 12px; color: #6B4E9A; font-family: 'Nunito Sans', sans-serif; font-size: 14px; outline: none; }
      .fr-dark-input::placeholder { color: #A99BC7; }
      .fr-dark-input-small { width: 70px; }
      .fr-dark-label { font-size: 13px; color: #6B4E9A; font-weight: 700; }
      .fr-dark-photo-picker { flex: none; min-width: 64px; height: 44px; padding: 0 12px; border-radius: 10px; border: 2px dashed #D9CCFF; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #A99BC7; cursor: pointer; overflow: hidden; }
      .fr-dark-chip { border: 2px solid var(--child-color); background: white; color: #6B4E9A; border-radius: 999px; padding: 8px 14px; font-size: 13px; cursor: pointer; font-family: 'Nunito Sans', sans-serif; font-weight: 600; }
      .fr-dark-chip-active { background: var(--child-color); color: white; }

      /* ---- Confetti ---- */
      .fr-confetti { position: fixed; inset: 0; pointer-events: none; z-index: 70; overflow: hidden; }
      .fr-confetti-piece { position: absolute; top: -20px; border-radius: 2px; opacity: 0.9; animation-name: fr-fall; animation-timing-function: ease-in; animation-fill-mode: forwards; }
      .fr-confetti-emoji { position: absolute; top: -30px; line-height: 1; animation-name: fr-fall; animation-timing-function: ease-in; animation-fill-mode: forwards; will-change: transform; }
      @keyframes fr-fall {
        0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
        100% { transform: translateY(105vh) rotate(540deg); opacity: 0.9; }
      }

      /* ---- Praise ---- */
      .fr-praise-banner { margin: 0 auto 10px auto; max-width: 1120px; color: white; border-radius: 16px; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; font-family: 'Fredoka', sans-serif; box-shadow: 0 4px 12px rgba(0,0,0,0.12); }
      .fr-praise-close { background: rgba(255,255,255,0.3); border: none; color: white; width: 24px; height: 24px; border-radius: 50%; cursor: pointer; }
      .fr-praise-card { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
      .fr-praise-text { font-weight: 700; color: #6B4E9A; font-size: 14px; }

      /* ---- Kid mode: bigger, more photo-forward ---- */
      .fr-kid .fr-rich-media { height: 156px; }
      .fr-kid .fr-rich-action { padding: 15px; font-size: 17px; border-radius: 14px; }
      .fr-kid .fr-rich-title { font-size: 17px; }
      .fr-kid .fr-subtab { font-size: 15px; padding: 10px 18px; }

      /* ---- Misc ---- */
      .fr-tip { font-size: 13px; color: #6B4E9A; background: #FFF3D0; border-radius: 12px; padding: 10px 12px; margin: 0 0 14px 0; }
      .fr-switch-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; font-weight: 700; color: #6B4E9A; font-size: 14px; margin-bottom: 8px; }
      .fr-switch-row input { width: 22px; height: 22px; accent-color: #6FCF97; }
      .fr-color-swatches { display: flex; flex-wrap: wrap; gap: 10px; }
      .fr-swatch { width: 38px; height: 38px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px #E9E0FF; cursor: pointer; }
      .fr-swatch-active { box-shadow: 0 0 0 3px #6B4E9A; }
      .fr-theme-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
      .fr-theme-chip { border: 2px solid var(--child-color); background: white; color: #6B4E9A; border-radius: 999px; padding: 9px 16px; font-size: 14px; cursor: pointer; font-family: 'Fredoka', sans-serif; font-weight: 600; }
      .fr-theme-chip-active { background: var(--child-color); color: white; }
      .fr-bg-layer { position: fixed; inset: 0; z-index: -1; background-size: cover; background-position: center top; background-repeat: no-repeat; }
      .fr-bg-unicorn { background-image: url(/themes/unicorn-phone.jpg); }
      .fr-bg-princess { background-image: url(/themes/princess-phone.jpg); }
      .fr-bg-football { background-image: url(/themes/football-phone.jpg); }
      .fr-bg-cars { background-image: url(/themes/cars-phone.jpg); }
      @media (min-width: 768px) {
        .fr-bg-unicorn { background-image: url(/themes/unicorn-tablet.jpg); }
        .fr-bg-princess { background-image: url(/themes/princess-tablet.jpg); }
        .fr-bg-football { background-image: url(/themes/football-tablet.jpg); }
        .fr-bg-cars { background-image: url(/themes/cars-tablet.jpg); }
      }
      @media (min-width: 1200px) {
        .fr-bg-unicorn { background-image: url(/themes/unicorn-web.jpg); }
        .fr-bg-princess { background-image: url(/themes/princess-web.jpg); }
        .fr-bg-football { background-image: url(/themes/football-web.jpg); }
        .fr-bg-cars { background-image: url(/themes/cars-web.jpg); }
      }
      .fr-childbar { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; }
      .fr-childbar-chip { display: inline-flex; align-items: center; gap: 8px; border: 2px solid var(--child-color); background: white; color: #6B4E9A; font-family: 'Fredoka', sans-serif; font-weight: 600; padding: 5px 14px 5px 5px; border-radius: 999px; cursor: pointer; font-size: 14px; }
      .fr-childbar-chip-active { background: var(--child-color); color: white; }
      .fr-childbar-avatar { width: 28px; height: 28px; border-radius: 50%; background-size: cover; background-position: center; display: inline-block; }
      .fr-childbar-emoji { font-size: 20px; margin-left: 6px; }
      .fr-praise-row { display: flex; gap: 8px; flex-wrap: wrap; }
      .fr-assign-row { display: flex; align-items: center; gap: 6px; margin-top: 6px; }
      .fr-assign-label { font-size: 13px; }
      .fr-assign-select { flex: 1; border: 2px solid #E9E0FF; border-radius: 10px; padding: 6px 8px; font-family: 'Nunito Sans', sans-serif; font-size: 13px; color: #6B4E9A; background: white; }
      .fr-assign-static { font-size: 12px; color: #A99BC7; }
      .fr-assign-form { display: flex; flex-direction: column; gap: 6px; }
      .fr-assign-chips { display: flex; gap: 8px; flex-wrap: wrap; }
      .fr-assign-chip { border: 2px solid var(--child-color, #A78BFA); background: white; color: #6B4E9A; border-radius: 999px; padding: 7px 14px; font-family: 'Fredoka', sans-serif; font-weight: 600; font-size: 13px; cursor: pointer; }
      .fr-assign-chip-active { background: var(--child-color, #A78BFA); color: white; }
      .fr-assign-hint { font-size: 12px; color: #A99BC7; }
    `}</style>
  );
}
