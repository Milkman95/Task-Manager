function viewTasks() {
  var request = new XMLHttpRequest();
  request.open('GET', '/view-tasks', true);
  request.setRequestHeader('Content-Type', 'application/json');

  request.onload = function () {
    if (request.status === 200) {
      try {
        var response = JSON.parse(request.responseText);
        if (Array.isArray(response) && response.length > 0) {
          displayTasks(response);
          showMessage("All tasks loaded successfully.", "success");
        } else {
          showMessage("No tasks found in the system.", "warning");
        }
      } catch (error) {
        showMessage("Error parsing task data. Please try again.", "danger");
      }
    } else {
      showMessage("Failed to fetch tasks. Server responded with an error.", "danger");
    }
  };

  request.onerror = function () {
    showMessage("Network error while fetching tasks. Please check your connection.", "danger");
  };

  request.send();
}

// Function to display tasks in table
function displayTasks(tasks) {
  var html = '';
  for (var i = 0; i < tasks.length; i++) {
    html += '<tr>' +
      '<td>' + (i + 1) + '</td>' +
      '<td>' + tasks[i].id + '</td>' +
      '<td>' + tasks[i].task_name + '</td>' +
      '<td>' + tasks[i].description + '</td>' +
      '<td>' + tasks[i].status + '</td>' +
      '<td>' + new Date(tasks[i].due_date).toLocaleDateString() + '</td>' +
      '</tr>';
  }
  document.getElementById('taskTableContent').innerHTML = html;
}

// Function to show messages dynamically
function showMessage(message, type) {
  var box = document.getElementById('messageBox');
  box.className = 'alert alert-' + type;
  box.textContent = message;
  box.classList.remove('d-none');
}

// Function to hide message
function hideMessage() {
  document.getElementById('messageBox').classList.add('d-none');
}

// Search button function
function searchTasks() {
  var query = document.getElementById('searchInput').value.trim().toLowerCase();

  if (query === "") {
    showMessage("Please enter a search term before searching.", "warning");
    return;
  }

  var request = new XMLHttpRequest();
  request.open('GET', '/view-tasks', true);
  request.setRequestHeader('Content-Type', 'application/json');

  request.onload = function () {
    if (request.status === 200) {
      try {
        var tasks = JSON.parse(request.responseText);
        var results = tasks.filter(task =>
          task.task_name.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.id.toLowerCase().includes(query) ||
          task.status.toLowerCase().includes(query)   
        );

        if (results.length > 0) {
          displayTasks(results);
          showMessage(results.length + " task(s) found matching '" + query + "'.", "success");
        } else {
          displayTasks([]); // clear table
          showMessage("No matching tasks found for '" + query + "'.", "warning");
        }

      } catch (error) {
        showMessage("Error processing search results.", "danger");
      }
    } else {
      showMessage("Server error while searching tasks.", "danger");
    }
  };

  request.onerror = function () {
    showMessage("Network error during search. Please try again.", "danger");
  };

  request.send();
}

// Reset to view all tasks again
function resetTasks() {
  hideMessage();
  document.getElementById('searchInput').value = "";
  viewTasks();
}
