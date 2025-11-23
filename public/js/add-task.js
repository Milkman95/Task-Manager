function updateCharCount() {
    var description = document.getElementById("description").value;
    document.getElementById("charCount").textContent = description.length;
}

function addTask() {
    var response = "";

    // object for form data
    var jsonData = new Object();
    jsonData.task_name = document.getElementById("task_name").value;
    jsonData.description = document.getElementById("description").value;
    jsonData.status = document.getElementById("status").value;
    jsonData.due_date = document.getElementById("due_date").value;

    // frontend validation
    if (jsonData.task_name == "" || jsonData.description == "") {
        alert('Task name and description are required!');
        return;
    }

    if (jsonData.task_name.trim().length < 3) {
        alert('Task name must be at least 3 characters long!');
        return;
    }

    if (jsonData.description.length > 500) {
        alert('Description cannot exceed 500 characters!');
        return;
    }

    if (jsonData.status == "" || jsonData.status == null) {
        alert('Please select a task status!');
        return;
    }

    if (jsonData.due_date != "") {
        var selectedDate = new Date(jsonData.due_date);
        var today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            alert('Due date cannot be in the past!');
            return;
        }
    }

    var request = new XMLHttpRequest();
    request.open("POST", "/add-task", true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function () {
        console.log('Status:', request.status);
        console.log('Response:', request.responseText);

        try {
            //success
            response = JSON.parse(request.responseText);
            if (request.status === 201) {
                alert('✓ Task created successfully: ' + jsonData.task_name);

                // clear form 
                document.getElementById("task_name").value = "";
                document.getElementById("description").value = "";
                document.getElementById("status").value = "";
                document.getElementById("due_date").value = "";
                document.getElementById("charCount").textContent = "0";

                // close window
                $('#taskModal').modal('hide');

                console.log('New task:', response.task);
            }
            // error
            else {
                alert('Error: ' + response.message);
            }
        } catch (e) {
            console.error('JSON parse error:', e);
            console.error('Response was:', request.responseText);
            alert('Server error - check console for details');
        }
    };

    request.onerror = function () {
        console.error('Request failed');
        alert('Network error - could not reach server');
    };

    request.send(JSON.stringify(jsonData));
}