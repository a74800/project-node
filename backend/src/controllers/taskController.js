const taskService = require('../services/taskService');

async function getAllTasks(req, res) {
  try {
    const userId = req.user.id;

    const tasks = await taskService.getAllTasks(userId);

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
    const userId = req.user.id;

    const task = await taskService.getTaskById(id, userId);

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
    const userId = req.user.id;

    const task = await taskService.createTask(userId, req.body);

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
    const userId = req.user.id;

    const updatedTask = await taskService.updateTask(id, userId, req.body);

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
    const userId = req.user.id;

    const result = await taskService.deleteTask(id, userId);

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