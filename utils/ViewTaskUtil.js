const fs = require('fs').promises;
const path = require('path');

const TASKS_FILE = path.join('utils', 'task_db.json');
async function viewTasks(req, res) {
  try {
    // Reads the JSON file
    const data = await fs.readFile(TASKS_FILE, 'utf8');
    const allTasks = JSON.parse(data);
    // Returns the list of tasks as a JSON response
    return res.status(200).json(allTasks);
  } catch (error) {
    // Handles case where file does not exist yet
    if (error.code === 'ENOENT') {
      return res.status(200).json([]); 
    }
   
    return res.status(500).json({ message: error.message });
  }
}
//(reminder: Dont forget do view-task)
module.exports = { viewTasks };