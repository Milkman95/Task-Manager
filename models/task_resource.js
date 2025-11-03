class Task {
  constructor(task_name, description, status, due_date) {
    this.task_name = task_name;
    this.description = description;
    this.status = status;

    // Convert due_date (if given) into a proper Date object
    // If none is given, default to today's date
    this.due_date = due_date ? new Date(due_date) : new Date();

    // Generate a unique ID: timestamp + 3 random digits
    const timestamp = new Date().getTime(); // e.g. 1734567890123
    const random = Math.floor(Math.random() * 1000); // e.g. 432
    this.id = timestamp + random.toString().padStart(3, '0'); // "1734567890123432"
  }
}

module.exports = { Task };
