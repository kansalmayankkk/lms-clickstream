// ============================================================
// clickstream.js
// This file is loaded on every page.
// It sends events to the server so they can be saved in the database.
// ============================================================

// The context of the current page. Each page sets this itself,
// for example:  var PAGE_CONTEXT = 'Lesson: Clickstream Data';
if (typeof PAGE_CONTEXT === 'undefined') {
  var PAGE_CONTEXT = 'Site: Simple LMS';
}

// ------------------------------------------------------------
// The main helper function. Call it whenever something happens.
// ------------------------------------------------------------
function logEvent(context, component, eventName, description, extra) {
  var data = {
    context: context,
    component: component,
    eventName: eventName,
    description: description
  };

  // extra is optional (we use it to send the video name)
  if (extra && extra.videoKey) {
    data.videoKey = extra.videoKey;
  }

  fetch('/api/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).catch(function () {
    // If the server is down we simply ignore it. Keep it simple.
  });
}

// ------------------------------------------------------------
// Show the username in the navbar
// ------------------------------------------------------------
function loadUsername() {
  var box = document.getElementById('who');
  if (!box) return;

  fetch('/api/me')
    .then(function (r) {
      return r.json();
    })
    .then(function (data) {
      box.textContent = 'Logged in as: ' + data.username;
    })
    .catch(function () {});
}

// ------------------------------------------------------------
// Automatically log every button and link click on the page
// ------------------------------------------------------------
function trackClicks() {
  document.addEventListener('click', function (event) {
    var el = event.target;

    if (el.tagName === 'BUTTON' || (el.tagName === 'A' && el.className.indexOf('btn') >= 0)) {
      var text = (el.textContent || 'button').trim();
      logEvent(PAGE_CONTEXT, 'System', 'Button clicked', 'The user clicked the button "' + text + '".');
    } else if (el.tagName === 'A') {
      var linkText = (el.textContent || 'link').trim();
      logEvent(PAGE_CONTEXT, 'System', 'Link clicked', 'The user clicked the link "' + linkText + '".');
    }
  });
}

// ------------------------------------------------------------
// Run when the page is ready
// ------------------------------------------------------------
window.addEventListener('DOMContentLoaded', function () {
  loadUsername();
  trackClicks();
});
