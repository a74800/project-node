const taskService = require('../services/taskService');

async function getAllTasks(req, res) {
  try {
    const tasks = await taskService.getAllTasks();
    res.json(tasks);
  } catch (error) {
    console.error('Erro ao obter tasks:', error.message);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Erro interno do servidor',
    });
  }
}

async function getTaskById(req, res) {
  try {
    const { id } = req.params;
    const task = await taskService.getTaskById(id);
    res.json(task);
  } catch (error) {
    console.error('Erro ao obter task:', error.message);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Erro interno do servidor',
    });
  }
}

async function createTask(req, res) {
  try {
    const task = await taskService.createTask(req.body);
    res.status(201).json(task);
  } catch (error) {
    console.error('Erro ao criar task:', error.message);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Erro interno do servidor',
    });
  }
}

async function updateTask(req, res) {
  try {
    const { id } = req.params;
    const updatedTask = await taskService.updateTask(id, req.body);
    res.json(updatedTask);
  } catch (error) {
    console.error('Erro ao atualizar task:', error.message);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Erro interno do servidor',
    });
  }
}

async function deleteTask(req, res) {
  try {
    const { id } = req.params;
    const result = await taskService.deleteTask(id);
    res.json(result);
  } catch (error) {
    console.error('Erro ao remover task:', error.message);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Erro interno do servidor',
    });
  }
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};