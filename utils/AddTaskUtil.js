const { Task } = require('../models/task_resource');
const fs = require('fs').promises;
const path = require('path');

const TASKS_FILE = path.join('utils', 'task_db.json');
const TEMPLATE_FILE = path.join('utils', 'task.template.json');

//the only accepted status values
const VALID_STATUSES = ['todo', 'in-progress', 'completed'];

async function addTask(req, res) {
    try {
        const { task_name, description, status, due_date } = req.body;

        //missing fields
        if (!task_name || task_name.trim() === '') {
            return res.status(400).json({
                message: 'Task name is required and cannot be empty'
            });
        }

        if (!description || description.trim() === '') {
            return res.status(400).json({
                message: 'Description is required and cannot be empty'
            });
        }

        if (!status || status.trim() === '') {
            return res.status(400).json({
                message: 'Status is required and cannot be empty'
            });
        }

        //task name too short
        if (task_name.trim().length < 3) {
            return res.status(400).json({
                message: 'Task name must be at least 3 characters long'
            });
        }

        //invalid status
        if (!VALID_STATUSES.includes(status.toLowerCase())) {
            return res.status(400).json({
                message: `Invalid status. Allowed values are: ${VALID_STATUSES.join(', ')}`
            });
        }

        //description too long
        if (description.length > 500) {
            return res.status(400).json({
                message: 'Description cannot exceed 500 characters'
            });
        }

        //invalid due date
        if (due_date) {
            const selectedDate = new Date(due_date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                return res.status(400).json({
                    message: 'Due date cannot be in the past'
                });
            }

            //check if date is valid
            if (isNaN(selectedDate.getTime())) {
                return res.status(400).json({
                    message: 'Invalid due date format'
                });
            }
        }

        // read tasks
        let tasks = [];
        try {
            const data = await fs.readFile(TASKS_FILE, 'utf8');
            tasks = JSON.parse(data);
        } catch (err) {
            if (err.code === 'ENOENT') {
                //if task dont exist create it from template
                const templateData = await fs.readFile(TEMPLATE_FILE, 'utf8');
                tasks = JSON.parse(templateData);
                await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2), 'utf8');
            } else {
                throw err;
            }
        }

        //duplicate task name
        const duplicateTask = tasks.find(
            task => task.task_name.toLowerCase() === task_name.trim().toLowerCase()
        );

        if (duplicateTask) {
            return res.status(409).json({
                message: 'A task with this name already exists. Please use a different name.'
            });
        }

        //if success create new task
        const newTask = new Task(
            task_name.trim(),
            description.trim(),
            status.toLowerCase(),
            due_date
        );

        //save to db
        tasks.push(newTask);
        await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2), 'utf8');

        return res.status(201).json({
            message: 'Task created successfully',
            task: newTask,
            totalTasks: tasks.length
        });

    } catch (error) {
        console.error('Error in addTask:', error);
        return res.status(500).json({
            message: 'Internal server error: ' + error.message
        });
    }
}

module.exports = { addTask };