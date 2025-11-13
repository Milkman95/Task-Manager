const fs = require('fs').promises;
const path = require('path');
// Change this to match your actual JSON database file name
const TASKS_FILE = path.join('utils', 'task_db.json');
async function viewTasks(req, res) {
  try {
    // Read the JSON file
    const data = await fs.readFile(TASKS_FILE, 'utf8');
    const allTasks = JSON.parse(data);
    // Return the list of tasks as a JSON response
    return res.status(200).json(allTasks);
  } catch (error) {
    // Handle case where file does not exist yet
    if (error.code === 'ENOENT') {
      return res.status(200).json([]); // return empty list if no file
    }
    // Return 500 error for other cases
    return res.status(500).json({ message: error.message });
  }
}
// Export so index.js can use it
module.exports = { viewTasks };