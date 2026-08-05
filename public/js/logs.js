// ============================================================
// logs.js
// Loads all the clickstream rows and puts them in the table.
// ============================================================

var rowsBox = document.getElementById('log-rows');
var countBox = document.getElementById('count');
var refreshBtn = document.getElementById('refresh-btn');

function loadLogs() {
  fetch('api/logs')
    .then(function (r) { return r.json(); })
    .then(function (rows) {
      rowsBox.innerHTML = '';

      if (rows.length === 0) {
        rowsBox.innerHTML = '<tr><td colspan="8">No logs yet.</td></tr>';
        return;
      }

      countBox.textContent = ' ' + rows.length + ' events recorded.';

      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var tr = document.createElement('tr');
        tr.appendChild(makeCell(row.timestamp));
        tr.appendChild(makeCell(row.username));
        tr.appendChild(makeCell(row.event_context));
        tr.appendChild(makeCell(row.component));
        tr.appendChild(makeCell(row.event_name));
        tr.appendChild(makeCell(row.description));
        tr.appendChild(makeCell(row.origin));
        tr.appendChild(makeCell(row.ip_address));
        rowsBox.appendChild(tr);
      }
    })
    .catch(function () {
      rowsBox.innerHTML = '<tr><td colspan="8">Could not load the logs.</td></tr>';
    });
}

function makeCell(text) {
  var td = document.createElement('td');
  td.textContent = text;
  return td;
}

refreshBtn.addEventListener('click', loadLogs);

loadLogs();
