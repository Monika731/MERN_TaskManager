const Task = require('../models/Task');

// ✅ Get all tasks for the logged-in user
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id }).sort({ dueDate: 1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Create a new task
const createTask = async (req, res) => {
    const { title, description, priority, dueDate } = req.body;

    try {
        const task = new Task({
            user: req.user.id,
            title,
            description,
            completed: false, // Default to incomplete
            priority: priority || "medium", // Default priority if not provided
            dueDate
        });

        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Update a task
const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, completed, priority, dueDate } = req.body;

    try {
        const task = await Task.findOne({ _id: id, user: req.user.id });

        if (!task) {
            return res.status(404).json({ message: 'Task not found or not authorized' });
        }

        // Update fields only if provided
        task.title = title || task.title;
        task.description = description || task.description;
        task.completed = completed !== undefined ? completed : task.completed;
        task.priority = priority || task.priority;
        task.dueDate = dueDate || task.dueDate;

        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Delete a task
const deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findOne({ _id: id, user: req.user.id });

        if (!task) {
            return res.status(404).json({ message: 'Task not found or not authorized' });
        }

        await task.deleteOne();
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };