function deleteTask() {
    // Get task ID and confirmation input values
    var id = document.getElementById("task_id").value.trim();
    var confirmationInput = document.getElementById("confirmation").value.trim();

    // Check for empty input
    if (confirmationInput === "") {
        alert("Please type 'confirm' to proceed.");
        return;
    }

    // Check if input matches "confirm"
    if (confirmationInput.toLowerCase() !== "confirm") {
        alert("Please ensure 'confirm' is spelled correctly.");
        return;
    }

    // Final confirmation popup
    if (!confirm("Are you sure you want to delete this task?")) {
        return;
    }

    var request = new XMLHttpRequest();
    request.open("DELETE", "/delete-task/" + id, true);
    request.setRequestHeader("Content-Type", "application/json");

    request.onload = function () {
        var response = JSON.parse(request.responseText);
        if (request.status === 200) {
            alert(response.message);
        } else {
            alert(response.message || "Unable to delete task.");
        }
    };

    request.send();
}
