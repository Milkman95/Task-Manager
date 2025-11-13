const fs = require('fs').promises;
const path = require('path');
const RESOURCES_FILE = path.join('utils', 'task_db.json');
async function editTask(req, res) {
    try {
        const { id } = req.params;
        const { task_name, description, status, due_date } = req.body;
        let resources = [];
        try {
            const data = await fs.readFile(RESOURCES_FILE, 'utf8');
            resources = JSON.parse(data);
        } catch (err) {
            if (err.code === 'ENOENT') {
                return res.status(404).json({ message: 'No tasks found to edit.' });
            } else {
                throw err;
            }
        }
        const resourceIndex = resources.findIndex(r => r.id == id);
        if (resourceIndex === -1) {
            return res.status(404).json({ message: 'Task not found.' });
        }
        // Update resource fields
        resources[resourceIndex] = {
            ...resources[resourceIndex],
            task_name: task_name || resources[resourceIndex].task_name,
            description: description || resources[resourceIndex].description,
            status: status || resources[resourceIndex].status,
            due_date: due_date || resources[resourceIndex].due_date
        };
        await fs.writeFile(RESOURCES_FILE, JSON.stringify(resources, null, 2), 'utf8');
        return res.status(200).json({
            message: 'Task updated successfully!',
            resource: resources[resourceIndex]
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}
module.exports = { editTask }