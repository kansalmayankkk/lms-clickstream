// ============================================================
// progress.js
// Asks the server for the learner's numbers and shows them.
// ============================================================

var statsBox = document.getElementById('stats');

fetch('api/progress')
  .then(function (r) { return r.json(); })
  .then(function (p) {
    statsBox.innerHTML =
      makeStat(p.lessonsCompleted + ' / ' + p.totalLessons, 'Lessons completed') +
      makeStat(p.videosWatched + ' / ' + p.totalVideos, 'Videos watched') +
      makeStat(p.quizScore + ' / ' + p.quizTotal, 'Best quiz score') +
      makeStat(p.quizAttempts, 'Quiz attempts') +
      makeStat(p.totalEvents, 'Events recorded');
  })
  .catch(function () {
    statsBox.textContent = 'Could not load your progress.';
  });

function makeStat(big, label) {
  return (
    '<div class="stat">' +
    '<div class="big">' + big + '</div>' +
    '<div class="label">' + label + '</div>' +
    '</div>'
  );
}
