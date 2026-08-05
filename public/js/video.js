// ============================================================
// video.js
// Uses the free YouTube player API so we can know when the learner
// plays, pauses or finishes the video, and log those events.
// The lesson page must set VIDEO_ID, VIDEO_KEY and VIDEO_TITLE.
// ============================================================

var player;

// Load the YouTube player script
var tag = document.createElement('script');
tag.src = 'https://www.youtube.com/iframe_api';
document.head.appendChild(tag);

// YouTube calls this function automatically when its script is ready
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    videoId: VIDEO_ID,
    playerVars: { rel: 0 },
    events: {
      onStateChange: onPlayerStateChange
    }
  });
}

// This runs every time the video state changes
function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    logEvent(PAGE_CONTEXT, 'Video', 'Video played', 'The user started playing the video "' + VIDEO_TITLE + '".', {
      videoKey: VIDEO_KEY
    });
  }

  if (event.data === YT.PlayerState.PAUSED) {
    logEvent(PAGE_CONTEXT, 'Video', 'Video paused', 'The user paused the video "' + VIDEO_TITLE + '".', {
      videoKey: VIDEO_KEY
    });
  }

  if (event.data === YT.PlayerState.ENDED) {
    logEvent(PAGE_CONTEXT, 'Video', 'Video ended', 'The user finished watching the video "' + VIDEO_TITLE + '".', {
      videoKey: VIDEO_KEY
    });
  }
}

// A simple button so the video can also be marked as watched by hand
// (useful in a short demo when you do not want to watch 20 minutes)
function markVideoWatched() {
  logEvent(PAGE_CONTEXT, 'Video', 'Video ended', 'The user marked the video "' + VIDEO_TITLE + '" as watched.', {
    videoKey: VIDEO_KEY
  });
  var msg = document.getElementById('video-msg');
  if (msg) {
    msg.textContent = 'Video marked as watched. It now counts on your Progress page.';
  }
}
