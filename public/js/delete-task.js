function deleteTask() {
    // Get task ID and confirmation input values
    var id = document.getElementById("task_id").value.trim();
    var confirmationInput = document.getElementById("confirmation").value.trim();

    if (confirmationInput.toLowerCase() !== "confirm") {
        alert("Please type 'confirm' to delete the task.");
        return; // Stop deletion if confirmation word is incorrect
    }

    if (!confirm("Are you sure you want to delete this task?")) {
        return; // Exit function if user cancels
    }

    var request = new XMLHttpRequest();
    request.open("DELETE", "/delete-task/" + id, true);
    request.setRequestHeader("Content-Type", "application/json");

    request.onload = function () {
        var response = JSON.parse(request.responseText); // Parse JSON response
        if (request.status === 200) {
            alert(response.message); // Show success message
        } else {
            alert(response.message || "Unable to delete task."); // Show error
        }
    };

    request.send();
}