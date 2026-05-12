const taskRepository = require('../repositories/taskRepository');
const eventRepository = require('../repositories/eventRepository');

async function getTaskCountsByStatus(req, res) {
  try {
    const userId = req.user.id;

    const result = await taskRepository.getTaskCountsByStatus(userId);

    res.json(result);
  } catch (error) {
    console.error('Erro ao obter métricas de tasks:', error.message);
    res.status(500).json({
      error: 'Erro ao obter métricas de tasks',
    });
  }
}

async function getEventCountsByType(req, res) {
  try {
    const userId = req.user.id;

    const result = await eventRepository.getEventCountsByType(userId);

    res.json(result);
  } catch (error) {
    console.error('Erro ao obter métricas de eventos:', error.message);
    res.status(500).json({
      error: 'Erro ao obter métricas de eventos',
    });
  }
}

module.exports = {
  getTaskCountsByStatus,
  getEventCountsByType,
};