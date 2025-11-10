function addTask() {
    var response = "";

    // Create an object to hold form data
    var jsonData = new Object();
    jsonData.task_name = document.getElementById("task_name").value;
    jsonData.description = document.getElementById("description").value;
    jsonData.status = document.getElementById("status").value;
    jsonData.due_date = document.getElementById("due_date").value;

    // Validate required fields (task_name and description must be filled in)
    if (jsonData.task_name == "" || jsonData.description == "") {
        alert('Task name and description are required!');
        return; // Stop execution if validation fails
    }

    // Validate status is selected
    if (jsonData.status == "" || jsonData.status == null) {
        alert('Please select a task status!');
        return;
    }

    // Validate due date (optional: ensure it's not in the past)
    if (jsonData.due_date != "") {
        var selectedDate = new Date(jsonData.due_date);
        var today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day for fair comparison

        if (selectedDate < today) {
            alert('Due date cannot be in the past!');
            return;
        }
    }

    // Configure the request to POST data to /api/tasks
    var request = new XMLHttpRequest();
    request.open("POST", "/add-task", true);
    request.setRequestHeader('Content-Type', 'application/json');

    // Define what happens when the server responds
    request.onload = function () {
        response = JSON.parse(request.responseText); // Parse JSON response
        console.log(response)

        // If no error message is returned → success
        if (response.message == undefined) {
            alert('Added Task: ' + jsonData.task_name + '!');

            // Clear form fields after success
            document.getElementById("task_name").value = "";
            document.getElementById("description").value = "";
            document.getElementById("status").value = "";
            document.getElementById("due_date").value = "";

            // Close modal
            $('#taskModal').modal('hide');

            // Reload table content (you'll need to create this function)
            viewTasks();
        } else {
            // Show error if task could not be added
            alert('Unable to add task!');
        }
    };

    // Send the request with JSON-formatted data
    request.send(JSON.stringify(jsonData));
}