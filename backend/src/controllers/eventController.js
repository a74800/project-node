const eventService = require('../services/eventService');

async function getAllEvents(req, res) {
  try {
    const events = await eventService.getAllEvents();
    res.json(events);
  } catch (error) {
    console.error('Erro ao obter eventos:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

async function getEventsByTaskId(req, res) {
  try {
    const { taskId } = req.params;
    const events = await eventService.getEventsByTaskId(taskId);
    res.json(events);
  } catch (error) {
    console.error('Erro ao obter eventos da task:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

module.exports = {
  getAllEvents,
  getEventsByTaskId,
};