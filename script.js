const STORAGE_KEY = "anniversarySiteDataV2";
const LEGACY_STORAGE_KEY = "anniversarySiteDataV1";
const ADMIN_PASSWORD = "1234";

const defaultData = {
  "heroTitle": "Every day with you feels like a soft kind of forever.",
  "heroSubtitle": "A modern little anniversary page for our story, our favorite moments, and all the beautiful plans still waiting for us.",
  "dedicationLine": "For my favorite person Armita",
  "smallLoveNote": "I hope this little universe reminds you how deeply loved you are today.",
  "dates": {
    "firstMeeting": "2025-06-26T22:37",
    "nextDate": "2026-06-21T13:00"
  },
  "timeline": [
    {
      "title": "Our First Date",
      "date": "October 22, 2025",
      "image": "media/OurFirstDate.jpg",
      "text": "A simple day that became unforgettable because it was ours."
    },
    {
      "title": "Our First Photo",
      "date": "October 22, 2025",
      "image": "media/OurFirstPhoto.jpg",
      "text": "The first little frame that started becoming part of our shared history."
    },
    {
      "title": "A Favorite Memory",
      "date": "March 20, 2024",
      "image": "media/AFavoriteMemory.jpg",
      "text": " one of those memories that still makes we smile."
    }
  ],
  "gallery": [
    {
      "type": "image",
      "src": "",
      "caption": "New gallery caption"
    }
  ],
  "letter": "Armita, I was just thinking about how lucky I am to have you in my life. Honestly, I don’t think I tell you enough how much I appreciate you. Your kindness is something I admire every single day, and your smile… it’s the best part of my day—it just lights everything up. Whenever I look into your eyes, I feel so at peace. Thank you for being you, and for making my life so much better just by being in it.",
  "reasons": [
    "You make ordinary moments feel special.",
    "Your smile changes the whole day.",
    "You feel like home to my heart.",
    "You make the future feel gentle and bright.",
    "You notice the little things.",
    "Being with you feels peaceful."
  ],
  "surpriseMessage": "You are my favorite chapter, my calm place, and the sweetest part of every tomorrow.",
  "songs": [
    {
      "title": "Cheshmami",
      "description": "“The first romantic song that was pinned in the chat.”\n",
      "cover": "media/Cheshmami.jpg",
      "audio": "media/Cheshmami.mp3"
    },
    {
      "title": "Didar",
      "description": "“I played this song the entire way while driving from Urmia to Tehran.”\n\n",
      "cover": "media/Didar.jpg",
      "audio": "media/Didar.mp3"
    },
    {
      "title": "Mahram",
      "description": "“When I found out that you love me too.”\n\n",
      "cover": "media/Marham.jpg",
      "audio": "media/Marham.mp3"
    },
    {
      "title": "Video Games",
      "description": "“The song that both of us really love.”\n\n",
      "cover": "media/VideoGames.jpg",
      "audio": "media/VideoGames.mp3"
    }
  ],
  "places": [
    {
      "name": "A quiet café date",
      "image": "",
      "note": "Coffee, soft light, and a long conversation with no rush.",
      "status": "Planned"
    },
    {
      "name": "A seaside walk",
      "image": "",
      "note": "A calm walk by the water when the air is cool and kind.",
      "status": "Soon"
    },
    {
      "name": "A cozy weekend trip",
      "image": "",
      "note": "Somewhere peaceful, with beautiful views and time just for us.",
      "status": "Dream list"
    }
  ],
  "chats": [
    {
      "date": "May 30, 2026",
      "image": "media/chat1.png",
      "text": "",
      "caption": "Agheli's Birthday"
    },
    {
      "date": "May 5, 2026",
      "image": "media/chat2.png",
      "text": "",
      "caption": "Armita's Birthday"
    },
    {
      "date": "October 22,2025",
      "image": "media/chat3.jpg",
      "text": "",
      "caption": "A memorable night"
    },
    {
      "date": "January 28,2026",
      "image": "media/chat4.jpg",
      "text": "",
      "caption": "A promise kept to the end"
    },
    {
      "date": "today",
      "image": "media/chat5.jpg",
      "text": "",
      "caption": "Look how far we've come"
    }
  ]
}

let data = loadData();
let currentSlide = 0;
let typewriterTimer;
let counterTimer;
let observer;
const ROUTES = ["home", "timeline", "gallery", "counter", "letter", "reasons", "surprise", "music", "future", "memories", "admin"];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return mergeData(clone(defaultData), JSON.parse(stored));

    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
      const migrated = migrateLegacyData(JSON.parse(legacy));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }

    return clone(defaultData);
  } catch {
    return clone(defaultData);
  }
}

function migrateLegacyData(legacy) {
  const migrated = mergeData(clone(defaultData), legacy || {});
  if (legacy?.heroMessage && !legacy.heroTitle) migrated.heroTitle = legacy.heroMessage;
  migrated.heroSubtitle = legacy?.heroSubtitle || defaultData.heroSubtitle;
  migrated.dedicationLine = legacy?.dedicationLine || defaultData.dedicationLine;
  migrated.smallLoveNote = legacy?.smallLoveNote || defaultData.smallLoveNote;
  return migrated;
}

function mergeData(base, saved) {
  const merged = { ...base, ...saved };
  merged.dates = { ...base.dates, ...(saved.dates || {}) };
  ["timeline", "gallery", "reasons", "songs", "places", "chats"].forEach((section) => {
    merged[section] = Array.isArray(saved[section]) ? saved[section] : base[section];
  });
  return merged;
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
}

function isPersian(value = "") {
  return /[\u0600-\u06FF]/.test(String(value));
}

function textClass(value = "") {
  return isPersian(value) ? "fa-text" : "";
}

function formatDate(value) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Add your date";
  return parsed.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function placeholderSvg(label) {
  const safeLabel = escapeHtml(label || "Add your memory");
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='900' height='620' viewBox='0 0 900 620'><defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'><stop stop-color='#fff8f2'/><stop offset='1' stop-color='#ffe7eb'/></linearGradient></defs><rect width='900' height='620' fill='url(#g)'/><circle cx='720' cy='145' r='120' fill='#f7cbd2' opacity='.62'/><circle cx='170' cy='500' r='145' fill='#dcc4a8' opacity='.28'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#8f4f60' font-family='Arial, sans-serif' font-size='34'>${safeLabel}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function mediaSrc(src, label) {
  return src || placeholderSvg(label);
}

function renderAll() {
  $("#heroTitle").textContent = data.heroTitle || defaultData.heroTitle;
  $("#heroTitle").className = textClass(data.heroTitle);
  $("#heroSubtitle").textContent = data.heroSubtitle || defaultData.heroSubtitle;
  $("#heroSubtitle").className = `hero-subtitle ${textClass(data.heroSubtitle)}`.trim();
  $("#dedicationLine").textContent = data.dedicationLine || defaultData.dedicationLine;
  $("#dedicationLine").className = `dedication-badge ${textClass(data.dedicationLine)}`.trim();
  $("#smallLoveNote").textContent = data.smallLoveNote || defaultData.smallLoveNote;
  $("#smallLoveNote").className = textClass(data.smallLoveNote);
  $("#heroDateLabel").textContent = formatDate(data.dates.firstMeeting);
  renderTimeline();
  renderGallery();
  renderCounters();
  renderLetter();
  renderReasons();
  renderSurprise();
  renderSongs();
  renderPlaces();
  renderChats();
  setupRevealObserver();
}

function renderTimeline() {
  const items = data.timeline.length ? data.timeline : [{ title: "No timeline items yet", date: "Add a date", image: "", text: "Open the admin panel to add your story." }];
  $("#timelineList").innerHTML = items.map((item) => `
    <article class="timeline-item fade-in">
      <span class="timeline-dot"></span>
      <div class="timeline-card">
        <img src="${mediaSrc(item.image, item.title)}" alt="${escapeHtml(item.title)}">
        <div class="${textClass(`${item.title} ${item.text}`)}"><span class="date">${escapeHtml(item.date)}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p></div>
      </div>
    </article>`).join("");
}

function renderGallery() {
  const hasItems = data.gallery.length > 0;
  const items = hasItems ? data.gallery : [{ type: "image", src: "", caption: "No photos or videos yet. Upload your favorites from the admin panel." }];
  if (currentSlide >= items.length) currentSlide = 0;
  $("#gallerySlider").innerHTML = items.map((item, index) => `
    <div class="slide ${index === currentSlide ? "active" : ""}">
      ${item.type === "video" && item.src ? `<video src="${item.src}" controls></video>` : `<img src="${mediaSrc(item.src, item.caption)}" alt="${escapeHtml(item.caption)}">`}
      <div class="slide-caption ${textClass(item.caption)}">${escapeHtml(item.caption)}</div>
    </div>`).join("");
  $("#galleryDots").innerHTML = items.map((_, index) => `<button class="dot ${index === currentSlide ? "active" : ""}" type="button" aria-label="Slide ${index + 1}" data-slide="${index}"></button>`).join("");
  $$(".dot").forEach((dot) => dot.addEventListener("click", () => { currentSlide = Number(dot.dataset.slide); renderGallery(); }));
}

function renderCounters() {
  clearInterval(counterTimer);
  updateCounters();
  counterTimer = setInterval(updateCounters, 1000);
}

function diffParts(ms) {
  const absolute = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(absolute / 86400),
    hours: Math.floor((absolute % 86400) / 3600),
    minutes: Math.floor((absolute % 3600) / 60),
    seconds: absolute % 60
  };
}

function timeTemplate(parts) {
  return [
    [parts.days, "Days"], [parts.hours, "Hours"], [parts.minutes, "Minutes"], [parts.seconds, "Seconds"]
  ].map(([value, label]) => `<div class="time-box"><strong>${value.toLocaleString("en-US")}</strong><span>${label}</span></div>`).join("");
}

function updateCounters() {
  const now = new Date();
  const first = new Date(data.dates.firstMeeting);
  const next = new Date(data.dates.nextDate);
  $("#passedCounter").innerHTML = Number.isNaN(first.getTime()) ? `<p class="empty-state">Add your relationship start date in the admin panel.</p>` : timeTemplate(diffParts(now - first));
  $("#nextCounter").innerHTML = !Number.isNaN(next.getTime()) && next > now ? timeTemplate(diffParts(next - now)) : `<p class="empty-state">Add the next special date in the admin panel.</p>`;
}

function renderLetter() {
  const target = $("#letterText");
  clearInterval(typewriterTimer);
  target.textContent = "";
  target.className = `typewriter ${textClass(data.letter)}`.trim();
  let index = 0;
  const letter = data.letter || "Open the admin panel to write your love letter.";
  typewriterTimer = setInterval(() => {
    target.textContent += letter[index] || "";
    index += 1;
    if (index >= letter.length) clearInterval(typewriterTimer);
  }, 18);
}

function renderReasons() {
  const items = data.reasons.length ? data.reasons : ["Add your first reason in the admin panel."];
  $("#reasonsList").innerHTML = items.map((reason, index) => `<div class="reason-card ${textClass(reason)}" style="transition-delay:${Math.min(index * 35, 420)}ms">${escapeHtml(reason)}</div>`).join("");
}

function renderSurprise() {
  $("#surpriseMessage").textContent = data.surpriseMessage;
  $("#surpriseMessage").className = `hidden-message ${textClass(data.surpriseMessage)}`.trim();
}

function renderSongs() {
  if (!data.songs.length) {
    $("#songsList").innerHTML = `<div class="empty-state">No music uploaded yet. Add a local audio file and song title from the admin panel.</div>`;
    return;
  }
  $("#songsList").innerHTML = data.songs.map((song, index) => `
    <article class="simple-card fade-in ${textClass(`${song.title} ${song.description}`)}">
      <img src="${mediaSrc(song.cover, song.title)}" alt="${escapeHtml(song.title)}">
      <h3>${escapeHtml(song.title)}</h3><p>${escapeHtml(song.description)}</p>
      <div class="song-actions"><button class="audio-button" type="button" data-audio="song-${index}" aria-label="Play ${escapeHtml(song.title)}">▶</button><audio id="song-${index}" src="${song.audio || ""}"></audio><span>${song.audio ? "Play / Pause" : "Upload audio in Admin"}</span></div>
    </article>`).join("");
  $$(".audio-button").forEach((button) => button.addEventListener("click", () => toggleAudio(button)));
}

function toggleAudio(button) {
  const audio = document.getElementById(button.dataset.audio);
  if (!audio || !audio.getAttribute("src")) return;
  $$("audio").forEach((item) => { if (item !== audio) { item.pause(); item.previousElementSibling && (item.previousElementSibling.textContent = "▶"); } });
  audio.paused ? audio.play() : audio.pause();
  button.textContent = audio.paused ? "▶" : "❚❚";
}

function renderPlaces() {
  const items = data.places.length ? data.places : [{ name: "No plans yet", image: "", note: "Add future plans in the admin panel.", status: "New" }];
  $("#placesList").innerHTML = items.map((place) => `
    <article class="simple-card fade-in ${textClass(`${place.name} ${place.note}`)}"><img src="${mediaSrc(place.image, place.name)}" alt="${escapeHtml(place.name)}"><h3>${escapeHtml(place.name)}</h3><p>${escapeHtml(place.note)}</p><span class="status">${escapeHtml(place.status)}</span></article>`).join("");
}

function renderChats() {
  const items = data.chats.length ? data.chats : [{ date: "No memories yet", image: "", text: "Add chat memories in the admin panel.", caption: "" }];
  $("#chatsList").innerHTML = items.map((chat) => `
    <article class="chat-card fade-in ${textClass(`${chat.text} ${chat.caption}`)}"><span class="date">${escapeHtml(chat.date)}</span>${chat.image ? `<img src="${chat.image}" alt="${escapeHtml(chat.caption)}">` : ""}<div class="chat-bubble">${escapeHtml(chat.text)}</div><p>${escapeHtml(chat.caption)}</p></article>`).join("");
}

function setupRevealObserver() {
  if (observer) observer.disconnect();
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.14 });
  $$(".active-view .fade-in, .active-view .reason-card").forEach((item) => observer.observe(item));
}

function currentRoute() {
  const route = window.location.hash.replace("#", "");
  return ROUTES.includes(route) ? route : "home";
}

function showView(route = currentRoute(), updateHash = true) {
  const previousRoute = document.querySelector(".page-view.active-view")?.id;
  const safeRoute = ROUTES.includes(route) ? route : "home";
  $$(".page-view").forEach((view) => {
    const isActive = view.id === safeRoute;
    view.classList.toggle("active-view", isActive);
    view.classList.toggle("leaving-view", Boolean(previousRoute && previousRoute !== safeRoute && view.id === previousRoute));
    view.setAttribute("aria-hidden", String(!isActive));
  });
  $$(".main-nav a").forEach((link) => {
    const isActive = link.getAttribute("href") === `#${safeRoute}`;
    link.classList.toggle("active", isActive);
    if (isActive) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  if (updateHash && window.location.hash !== `#${safeRoute}`) history.pushState(null, "", `#${safeRoute}`);
  document.body.dataset.route = safeRoute;
  window.scrollTo({ top: 0, behavior: previousRoute && previousRoute !== safeRoute ? "smooth" : "auto" });
  setupRevealObserver();
}

function createHearts() {
  for (let index = 0; index < 28; index += 1) {
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = "♡";
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${18 + Math.random() * 28}px`;
    heart.style.animationDelay = `${Math.random() * 1.2}s`;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 5200);
  }
}

function initAdmin() {
  $("#openAdmin").addEventListener("click", () => {
    const pass = prompt("Enter admin password:");
    if (pass === ADMIN_PASSWORD) {
      $("#adminLocked").classList.add("hidden");
      $("#adminPanel").classList.remove("hidden");
      renderAdminPanel();
    } else if (pass !== null) alert("Incorrect password.");
  });
}

function field(label, path, value, type = "text", help = "") {
  const input = type === "textarea" ? `<textarea data-path="${path}">${escapeHtml(value)}</textarea>` : `<input type="${type}" data-path="${path}" value="${escapeHtml(value)}">`;
  return `<div class="admin-row"><label>${label}</label>${input}${help ? `<small>${help}</small>` : ""}</div>`;
}

function itemEditor(section, index, fields, mediaFields = []) {
  const mediaInputs = mediaFields.map(({ key, label, accept }) => `<div class="admin-row"><label>${label}</label><input type="file" accept="${accept}" data-file-section="${section}" data-file-index="${index}" data-file-key="${key}"></div>`).join("");
  return `<div class="admin-list-item">${fields}${mediaInputs}<button class="danger-button delete-item" type="button" data-section="${section}" data-index="${index}">Delete item</button></div>`;
}

function renderAdminPanel() {
  const panel = $("#adminPanel");
  panel.innerHTML = `
    <div class="admin-group"><h3>Home</h3>${field("Nickname / dedication line", "dedicationLine", data.dedicationLine, "text", "Example: For my favorite person")}${field("Hero title", "heroTitle", data.heroTitle, "textarea")}${field("Hero subtitle", "heroSubtitle", data.heroSubtitle, "textarea")}${field("Small love note", "smallLoveNote", data.smallLoveNote, "textarea", "Shown on the Home page as today’s love note.")}</div>
    <div class="admin-group"><h3>Dates</h3>${field("Together since date", "dates.firstMeeting", data.dates.firstMeeting, "datetime-local")}${field("Next special date", "dates.nextDate", data.dates.nextDate, "datetime-local")}</div>
    <div class="admin-group"><h3>Love Letter</h3>${field("Letter text", "letter", data.letter, "textarea")}</div>
    <div class="admin-group"><h3>Surprise</h3>${field("Hidden message", "surpriseMessage", data.surpriseMessage, "textarea")}</div>
    ${arrayAdmin("timeline", "Timeline Items", ["title", "date", "image", "text"], [{ key: "image", label: "Upload image", accept: "image/*" }])}
    ${arrayAdmin("gallery", "Gallery Items", ["type", "src", "caption"], [{ key: "src", label: "Upload image or video", accept: "image/*,video/*" }])}
    ${reasonsAdmin()}
    ${arrayAdmin("songs", "Music", ["title", "description", "cover", "audio"], [{ key: "cover", label: "Upload cover image", accept: "image/*" }, { key: "audio", label: "Upload audio file", accept: "audio/*" }])}
    ${arrayAdmin("places", "Future Plans", ["name", "image", "note", "status"], [{ key: "image", label: "Upload image", accept: "image/*" }])}
    ${arrayAdmin("chats", "Chat Memories", ["date", "image", "text", "caption"], [{ key: "image", label: "Upload screenshot", accept: "image/*" }])}
    <div class="admin-actions"><button id="saveAdmin" class="primary-button" type="button">Save changes</button><button id="resetAdmin" class="danger-button" type="button">Reset defaults</button></div>`;
  bindAdminEvents();
}

function labelFor(key) {
  return ({ title: "Title", date: "Date", image: "Image URL/Data", text: "Text", type: "Type", src: "File URL/Data", caption: "Caption", description: "Description", cover: "Cover image", audio: "Audio file", name: "Name", note: "Note", status: "Status" })[key] || key;
}

function arrayAdmin(section, title, keys, mediaFields) {
  const items = data[section].map((item, index) => {
    const fields = keys.map((key) => {
      if (key === "type") return `<div class="admin-row"><label>Type</label><select data-path="${section}.${index}.${key}"><option value="image" ${item[key] === "image" ? "selected" : ""}>Image</option><option value="video" ${item[key] === "video" ? "selected" : ""}>Video</option></select></div>`;
      const long = ["text", "description", "note", "caption", "src", "image", "audio", "cover"].includes(key);
      return field(labelFor(key), `${section}.${index}.${key}`, item[key] || "", long ? "textarea" : "text");
    }).join("");
    return itemEditor(section, index, fields, mediaFields);
  }).join("");
  return `<div class="admin-group"><h3>${title}</h3>${items || `<p class="empty-state">No items yet. Add one below.</p>`}<button class="secondary-button add-item" type="button" data-section="${section}">Add item</button></div>`;
}

function reasonsAdmin() {
  const items = data.reasons.map((reason, index) => itemEditor("reasons", index, field("Reason", `reasons.${index}`, reason, "textarea"))).join("");
  return `<div class="admin-group"><h3>Reasons Why I Love You</h3>${items || `<p class="empty-state">No reasons yet. Add one below.</p>`}<button class="secondary-button add-item" type="button" data-section="reasons">Add reason</button></div>`;
}

function bindAdminEvents() {
  $$("[data-path]").forEach((input) => input.addEventListener("input", () => setByPath(input.dataset.path, input.value)));
  $$(".add-item").forEach((button) => button.addEventListener("click", () => addItem(button.dataset.section)));
  $$(".delete-item").forEach((button) => button.addEventListener("click", () => deleteItem(button.dataset.section, Number(button.dataset.index))));
  $$("[type='file'][data-file-section]").forEach((input) => input.addEventListener("change", handleFileUpload));
  $("#saveAdmin").addEventListener("click", () => { saveData(); renderAll(); renderAdminPanel(); alert("Changes saved locally."); });
  $("#resetAdmin").addEventListener("click", () => {
    if (confirm("Reset all local edits and restore the default placeholder content?")) {
      data = clone(defaultData);
      saveData();
      renderAll();
      showView(currentRoute(), false);
      renderAdminPanel();
    }
  });
}

function setByPath(path, value) {
  const parts = path.split(".");
  let target = data;
  while (parts.length > 1) target = target[parts.shift()];
  target[parts[0]] = value;
}

function blankItem(section) {
  const blanks = {
    timeline: { title: "New memory", date: "Add a date", image: "", text: "Write the story here." },
    gallery: { type: "image", src: "", caption: "New gallery caption" },
    reasons: "A new reason I love you.",
    songs: { title: "New song", description: "Why this song matters to us.", cover: "", audio: "" },
    places: { name: "New plan", image: "", note: "A sweet plan for later.", status: "Planned" },
    chats: { date: "Add a date", image: "", text: "Add a message memory.", caption: "Caption" }
  };
  return typeof blanks[section] === "string" ? blanks[section] : { ...blanks[section] };
}

function addItem(section) {
  data[section].push(blankItem(section));
  renderAdminPanel();
}

function deleteItem(section, index) {
  data[section].splice(index, 1);
  renderAdminPanel();
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const { fileSection, fileIndex, fileKey } = event.target.dataset;
    const item = data[fileSection][Number(fileIndex)];
    item[fileKey] = reader.result;
    if (fileSection === "gallery" && fileKey === "src") item.type = file.type.startsWith("video/") ? "video" : "image";
    saveData();
    renderAll();
    renderAdminPanel();
  };
  reader.readAsDataURL(file);
}

function setupInteractions() {
  const menuToggle = $(".menu-toggle");
  menuToggle.addEventListener("click", () => {
    document.body.classList.toggle("nav-open");
    menuToggle.setAttribute("aria-expanded", document.body.classList.contains("nav-open"));
  });
  $$(".main-nav a").forEach((link) => link.addEventListener("click", (event) => {
    const route = link.getAttribute("href").replace("#", "");
    if (ROUTES.includes(route)) {
      event.preventDefault();
      showView(route);
    }
    document.body.classList.remove("nav-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }));
  window.addEventListener("hashchange", () => showView(currentRoute(), false));
  $("#prevSlide").addEventListener("click", () => {
    const length = data.gallery.length || 1;
    currentSlide = (currentSlide - 1 + length) % length;
    renderGallery();
  });
  $("#nextSlide").addEventListener("click", () => {
    const length = data.gallery.length || 1;
    currentSlide = (currentSlide + 1) % length;
    renderGallery();
  });
  $("#surpriseButton").addEventListener("click", () => { createHearts(); $("#surpriseMessage").classList.add("show"); });
  $("#toTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  window.addEventListener("scroll", () => $("#toTop").classList.toggle("show", window.scrollY > 600));
}

setupInteractions();
initAdmin();
renderAll();
showView(currentRoute(), window.location.hash === "");
