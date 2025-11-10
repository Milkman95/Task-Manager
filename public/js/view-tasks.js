function viewTasks() {
  var request = new XMLHttpRequest();
  request.open('GET', '/view-tasks', true);
  request.setRequestHeader('Content-Type', 'application/json');

  request.onload = function () {
    var response = JSON.parse(request.responseText);
    var html = '';

    for (var i = 0; i < response.length; i++) {
      html += '<tr>' +
        '<td>' + (i + 1) + '</td>' +
        '<td>' + response[i].id + '</td>' +
        '<td>' + response[i].task_name + '</td>' +
        '<td>' + response[i].description + '</td>' +
        '<td>' + response[i].status + '</td>' +
        '<td>' + new Date(response[i].due_date).toLocaleDateString() + '</td>' +
        // Optional: Add Edit/Delete buttons if needed
        '</tr>';
    }

    document.getElementById('taskTableContent').innerHTML = html;
  };

  request.send();
}

function filterTasks() {
  var input = document.getElementById('searchInput').value.toLowerCase();
  var table = document.getElementById('taskTableContent');
  var rows = table.getElementsByTagName('tr');

  for (var i = 0; i < rows.length; i++) {
    var cells = rows[i].getElementsByTagName('td');
    var match = false;

    for (var j = 1; j < cells.length; j++) { // skip the first column (#)
      if (cells[j].innerText.toLowerCase().includes(input)) {
        match = true;
        break;
      }
    }

    rows[i].style.display = match ? '' : 'none';
  }
}

