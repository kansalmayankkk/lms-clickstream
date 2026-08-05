// ============================================================
// quiz.js
// Loads the 5 questions, records every answer click,
// and sends the answers to the server to be marked.
// ============================================================

var questionsBox = document.getElementById('questions');
var submitBtn = document.getElementById('submit-btn');
var errorBox = document.getElementById('quiz-error');
var resultCard = document.getElementById('result-card');
var resultBox = document.getElementById('result');

var questions = [];

// 1) Get the questions from the server
fetch('api/quiz')
  .then(function (r) { return r.json(); })
  .then(function (data) {
    questions = data;
    showQuestions();
  })
  .catch(function () {
    questionsBox.textContent = 'Could not load the questions.';
  });

// 2) Draw the questions on the page
function showQuestions() {
  questionsBox.innerHTML = '';

  for (var i = 0; i < questions.length; i++) {
    var q = questions[i];

    var div = document.createElement('div');
    div.className = 'question';

    var title = document.createElement('p');
    title.textContent = (i + 1) + '. ' + q.question;
    div.appendChild(title);

    for (var j = 0; j < q.options.length; j++) {
      var label = document.createElement('label');

      var radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'q' + q.id;
      radio.value = j;
      radio.setAttribute('data-question', q.question);
      radio.setAttribute('data-option', q.options[j]);
      radio.setAttribute('data-number', i + 1);
      radio.addEventListener('change', answerClicked);

      label.appendChild(radio);
      label.appendChild(document.createTextNode(' ' + letter(j) + ') ' + q.options[j]));
      div.appendChild(label);
    }

    questionsBox.appendChild(div);
  }
}

function letter(index) {
  return ['A', 'B', 'C', 'D'][index];
}

// 3) Every time the learner picks an option we log it
function answerClicked(event) {
  var el = event.target;
  logEvent(
    PAGE_CONTEXT,
    'Quiz',
    'Quiz answer selected',
    'The user selected option ' + letter(Number(el.value)) + ' ("' + el.getAttribute('data-option') +
      '") for question ' + el.getAttribute('data-number') + '.'
  );
}

// 4) Submit
submitBtn.addEventListener('click', function () {
  var answers = {};
  var answered = 0;

  for (var i = 0; i < questions.length; i++) {
    var q = questions[i];
    var chosen = document.querySelector('input[name="q' + q.id + '"]:checked');
    if (chosen) {
      answers[q.id] = Number(chosen.value);
      answered = answered + 1;
    }
  }

  if (answered < questions.length) {
    errorBox.textContent = 'Please answer all ' + questions.length + ' questions first.';
    return;
  }

  errorBox.textContent = '';

  fetch('api/quiz/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers: answers })
  })
    .then(function (r) { return r.json(); })
    .then(function (data) {
      resultCard.style.display = 'block';
      resultBox.textContent = 'You scored ' + data.score + ' out of ' + data.total + '.';
      submitBtn.disabled = true;
      window.scrollTo(0, document.body.scrollHeight);
    })
    .catch(function () {
      errorBox.textContent = 'Could not submit the quiz.';
    });
});
