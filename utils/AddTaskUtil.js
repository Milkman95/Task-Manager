const { Task } = require('../models/task_resource');
const fs = require('fs').promises;
const path = require('path');

const TASKS_FILE = path.join('utils', 'task_db.json');
const TEMPLATE_FILE = path.join('utils', 'task.template.json');


async function addTask(req, res) {
    try {
        const { task_name, description, status, due_date } = req.body;

        // Create new task instance using the Task class
        const newTask = new Task(task_name, description, status, due_date);

        let tasks = [];

        try {
            // Try reading the existing tasks.json
            const data = await fs.readFile(TASKS_FILE, 'utf8');
            tasks = JSON.parse(data);
        } catch (err) {
            if (err.code === 'ENOENT') {
                // If task_db.json doesn't exist, create it from the template
                const templateData = await fs.readFile(TEMPLATE_FILE, 'utf8');
                tasks = JSON.parse(templateData);
                await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2), 'utf8');
            } else {
                throw err;
            }
        }

        // Add new task and save to file
        tasks.push(newTask);
        await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2), 'utf8');

        return res.status(201).json(tasks);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { addTask };