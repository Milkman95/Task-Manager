// Function to open the edit modal and pre-fill it with the selected resource's data
// function editTask(data) {
//     var selectedTask = JSON.parse(data);
//     //LINE BELOW ADDED BY ME:
//     document.getElementById("editTaskName").value = selectedTask.id;
//     // Pre-fill the modal input fields with the current resource details
//     document.getElementById("editTaskName").value = selectedTask.task_name;
//     document.getElementById("editDescription").value = selectedTask.description;
//     document.getElementById("editStatus").value = selectedTask.status;
//     document.getElementById("editDueDate").value = selectedTask.due_date;
//     // Set update button's onclick attribute to call updateResource() with resource's ID
//     document.getElementById("updateButton").setAttribute(
//         "onclick",
//         'updateTask("' + selectedTask.id + '")'
//     );
//     // Show the edit modal using Bootstrap's modal method
//     // $('#editResourceModal').modal('show');
// }
// Function to send updated resource data to the backend API
function updateTask() {
    console.log(document.getElementById("editDueDate").value)
    id = document.getElementById('editId').value
    var response = "";
    // Create a JSON object from the modal input fields
    var jsonData = {
        task_name: document.getElementById("editTaskName").value,
        description: document.getElementById("editDescription").value,
        status: document.getElementById("editStatus").value,
        due_date: new Date(document.getElementById("editDueDate").value)
    };
    // Basic validation to ensure all fields are filled
    //First error handling to check if all fields are entered
    if (jsonData.task_name == "" || jsonData.description == "" || jsonData.status == "" ||
        jsonData.due_date == "") {
        alert('All fields are required!');
        return; // Stop execution if validation fails
    }
    //Second error handling to check if ID fields is number
    if (isNaN(Number(id))) {
        alert('Id field needs to be numbers only!');
        return;
    }
    // Configure the request as PUT to the edit-resource endpoint with the resource ID
    var request = new XMLHttpRequest();
    request.open("PUT", "/edit-task/" + id, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function () {
        response = JSON.parse(request.responseText); // Parse JSON response
        // If the backend confirms success, show an alert and reload the page
        if (response.message == "Task updated successfully!") {
            alert('Edited Task: ' + jsonData.task_name + '!');
            // $('#editResourceModal').modal('hide'); // Close modal
            // viewResources(); // Reload table content
        } else {
            // Show error if update failed
            alert('Unable to edit task!');
        }
    };
    // Send the JSON data to the server
    request.send(JSON.stringify(jsonData));
}