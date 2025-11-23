// Simple player + photo carousel + lyrics sync
// Assets:
// - audio: assets/i-miss-you-so-by-minova.mp3 (place your legally obtained copy here)
// - photos: assets/images/1.jpg ... 5.jpg
//
// Mini lyrics window added: mirrors main lyrics and highlights current line.

const audio = document.getElementById('audio');
const startOverlay = document.getElementById('startOverlay');
const startBtn = document.getElementById('startBtn');
const main = document.getElementById('main');
const playPauseBtn = document.getElementById('playPause');
const seek = document.getElementById('seek');
const carousel = document.getElementById('photoCarousel');
const lyricsContainer = document.getElementById('lyrics');

const miniLyrics = document.getElementById('miniLyrics');
const miniContent = document.getElementById('miniContent');
const toggleMiniBtn = document.getElementById('toggleMiniBtn');
const miniClose = document.getElementById('miniClose');

let photos = [
  'assets/images/1.jpg',
  'assets/images/2.jpg',
  'assets/images/3.jpg',
  'assets/images/4.jpg',
  'assets/images/5.jpg'
];

// Edit these lyric lines as you like. Add { time: 12.5, text: "..." } for precise sync.
let lyrics = [
  { text: "Wait a while, you don't have to leave now" },
  { text: "I know you're movin' out of town" },
  { text: "Just hold me in your arms" },
  { text: "Say you'll try to call me when you're feelin' down" },
  { text: "I know it's hard to come around" },
  { text: "But we'll try and figure it out" },
  { text: "I miss you so" },
  { text: "I sit by the phone" },
  { text: "And wait for your call" },
  { text: "Days went by since you had to leave town" },
  { text: "I know you needed to move out" },
  { text: "It's lonely when you're gone" },
  { text: "Say you'll try to call me when you're feelin' down" },
  { text: "I know it's hard to come around" },
  { text: "But we'll try and figure it out" },
  { text: "I miss you so" },
  { text: "I sit by the phone" },
  { text: "And wait for your call" },
  { text: "I miss you so" },
  { text: "I sit by the phone" },
  { text: "And wait for your call" },
  { text: "Say what you want, it's not your fault" },
  { text: "Take what I got, 'cause now it's yours" },
  { text: "You mean a lot to me" },
  { text: "I'd give you everything and more" },
  { text: "I miss you so" },
  { text: "I sit by the phone" },
  { text: "And wait for your call" },
  { text: "I miss you so" },
  { text: "I sit by the phone" }
];

// --- Build DOM ---
function buildCarousel() {
  carousel.innerHTML = '';
  photos.forEach((src, i) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Photo ${i+1}`;
    if (i === 0) img.classList.add('visible');
    carousel.appendChild(img);
  });
}

function buildLyrics() {
  lyricsContainer.innerHTML = '';
  lyrics.forEach((line, idx) => {
    const d = document.createElement('div');
    d.className = 'line';
    d.dataset.idx = idx;
    d.textContent = line.text;
    lyricsContainer.appendChild(d);
  });
}

function buildMiniLyrics() {
  miniContent.innerHTML = '';
  lyrics.forEach((line, idx) => {
    const m = document.createElement('div');
    m.className = 'mini-line';
    m.dataset.idx = idx;
    m.textContent = line.text;
    miniContent.appendChild(m);
  });
}

buildCarousel();
buildLyrics();
buildMiniLyrics();

// --- Playback and UI ---
let currentIndex = 0;
let rafId = null;

function showPhoto(index) {
  const imgs = Array.from(carousel.querySelectorAll('img'));
  imgs.forEach((img, i) => {
    img.classList.remove('visible','left','right');
    if (i === index) img.classList.add('visible');
    else if (i < index) img.classList.add('left');
    else img.classList.add('right');
  });
}

function highlightLyric(idx) {
  // main lyrics
  const lines = Array.from(lyricsContainer.querySelectorAll('.line'));
  lines.forEach((l, i) => {
    l.classList.toggle('active', i === idx);
  });
  // mini lyrics
  const mlines = Array.from(miniContent.querySelectorAll('.mini-line'));
  mlines.forEach((m, i) => {
    m.classList.toggle('active', i === idx);
  });
  // ensure both scroll into view
  const activeMain = lyricsContainer.querySelector('.line.active');
  if (activeMain) activeMain.scrollIntoView({ behavior: 'smooth', block: 'center' });
  const activeMini = miniContent.querySelector('.mini-line.active');
  if (activeMini) activeMini.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Map lyrics to times. If times are missing or all zero, distribute evenly.
function computeTimings() {
  const hasTimes = lyrics.some(l => typeof l.time === 'number' && l.time > 0);
  if (hasTimes) {
    lyrics.sort((a,b)=> (a.time||0)-(b.time||0));
    return lyrics.map(l => (typeof l.time === 'number' ? l.time : null));
  } else {
    const dur = audio.duration || 0;
    if (!isFinite(dur) || dur === 0) {
      return [];
    }
    const step = dur / Math.max(lyrics.length,1);
    return lyrics.map((l,i)=> step * i);
  }
}

let timings = [];

// update seek bar
audio.addEventListener('timeupdate', () => {
  if (!isFinite(audio.duration) || audio.duration === 0) return;
  seek.value = (audio.currentTime / audio.duration) * 100;
});

// seek control
seek.addEventListener('input', (e) => {
  if (!audio.duration) return;
  audio.currentTime = (seek.value / 100) * audio.duration;
  updateState();
});

// play/pause
playPauseBtn.addEventListener('click', () => {
  if (audio.paused) audio.play();
  else audio.pause();
  playPauseBtn.textContent = audio.paused ? 'Play' : 'Pause';
});

// Start overlay click: considered a user gesture, good for autoplay
function startExperience() {
  startOverlay.classList.add('hidden');
  startOverlay.style.display = 'none';
  main.classList.remove('hidden');
  // mini open by default (button pressed)
  miniLyrics.classList.remove('hidden');
  toggleMiniBtn.setAttribute('aria-pressed', 'true');
  audio.play().catch(()=> {
    playPauseBtn.textContent = 'Play';
  });
}

// toggle mini window
toggleMiniBtn.addEventListener('click', () => {
  const isHidden = miniLyrics.classList.toggle('hidden');
  toggleMiniBtn.setAttribute('aria-pressed', String(!isHidden));
  // small visual feedback
  toggleMiniBtn.textContent = isHidden ? 'Mini lyrics' : 'Hide mini';
});
miniClose.addEventListener('click', () => {
  miniLyrics.classList.add('hidden');
  toggleMiniBtn.setAttribute('aria-pressed', 'false');
  toggleMiniBtn.textContent = 'Mini lyrics';
});

startBtn.addEventListener('click', startExperience);
startOverlay.addEventListener('click', (e)=>{
  // clicking overlay anywhere starts
  if (e.target === startOverlay) startExperience();
});

// update sync periodically
function updateState() {
  if (!audio.duration || timings.length === 0) return;
  const t = audio.currentTime;
  // find current lyric index
  let idx = timings.length - 1;
  for (let i=0;i<timings.length;i++){
    if (i===timings.length-1 || (t >= timings[i] && t < timings[i+1])) {
      idx = i;
      break;
    }
  }
  if (idx !== currentIndex) {
    currentIndex = idx;
    highlightLyric(idx);
    // map lyric index to photo index (wrap around if more lyrics than photos)
    showPhoto(idx % photos.length);
  }
}

function loop() {
  updateState();
  rafId = requestAnimationFrame(loop);
}

// on audio metadata load compute timings and start loop if playing
audio.addEventListener('loadedmetadata', () => {
  const computed = computeTimings();
  if (computed.length) timings = computed;
  if (!audio.paused && !rafId) loop();
});

audio.addEventListener('play', () => {
  playPauseBtn.textContent = 'Pause';
  if (timings.length === 0) {
    const computed = computeTimings();
    if (computed.length) timings = computed;
  }
  if (!rafId) loop();
});

audio.addEventListener('pause', () => {
  playPauseBtn.textContent = 'Play';
  if (rafId) { cancelAnimationFrame(rafId); rafId=null; }
});

audio.addEventListener('ended', () => {
  playPauseBtn.textContent = 'Play';
  audio.currentTime = 0;
  currentIndex = 0;
  highlightLyric(0);
  showPhoto(0);
});

// Safety: if metadata was already loaded earlier compute timings
if (audio.readyState >= 1) {
  const computed = computeTimings();
  if (computed.length) timings = computed;
}

// Initialize small UI state
showPhoto(0);
highlightLyric(0);

// Optional: keyboard controls (space toggles play/pause)
document.addEventListener('keydown', (e)=>{
  if (e.code === 'Space') {
    e.preventDefault();
    if (audio.paused) audio.play();
    else audio.pause();
  }
});
