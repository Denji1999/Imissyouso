<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>I miss you — open this</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <!-- Fullscreen start overlay (ensures user gesture to play audio) -->
  <div id="startOverlay" class="overlay">
    <div class="card">
      <h1>I miss you ❤️</h1>
      <p>Click anywhere to start the song and see the photos.</p>
      <button id="startBtn" class="btn">Play for you</button>
    </div>
  </div>

  <!-- Main content -->
  <main id="main" class="hidden">
    <header class="title">
      <h2>I miss you</h2>
      <p class="subtitle">Song: "i miss you so" — MINOVA • Every moment with you is my favorite song</p>
    </header>

    <section class="stage">
      <div id="photoCarousel" class="carousel" aria-live="polite">
        <!-- Images will be injected by JS -->
      </div>

      <div id="lyrics" class="lyrics" aria-atomic="true">
        <!-- Lyrics lines injected by JS; highlighted line gets .active -->
      </div>
    </section>

    <footer class="controls">
      <button id="playPause" class="btn">Pause</button>
      <input id="seek" type="range" min="0" max="100" value="0" />
      <button id="toggleMiniBtn" class="btn" aria-pressed="true">Mini lyrics</button>
    </footer>

    <!-- Mini lyrics floating window (mirrors the main lyrics) -->
    <aside id="miniLyrics" class="mini-lyrics" role="region" aria-label="Mini lyrics">
      <div class="mini-header">
        <strong>Lyrics</strong>
        <button id="miniClose" class="mini-close" aria-label="Close mini lyrics">×</button>
      </div>
      <div id="miniContent" class="mini-content">
        <!-- mini lyric lines injected by JS -->
      </div>
    </aside>
  </main>

  <!-- Audio: place your legally obtained file at the path below -->
  <audio id="audio" preload="auto" src="assets/i-miss-you-so-by-minova.mp3"></audio>

  <script src="script.js" defer></script>
</body>
</html>
