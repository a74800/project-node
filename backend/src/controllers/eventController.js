const eventRepository = require('../repositories/eventRepository');

async function getAllEvents(req, res) {
  try {
    const userId = req.user.id;

    const events = await eventRepository.getAllEvents(userId);

    res.json(events);
  } catch (error) {
    console.error('Erro ao obter eventos:', error.message);
    res.status(500).json({
      error: 'Erro ao obter eventos',
    });
  }
}

async function getEventsByTaskId(req, res) {
  try {
    const userId = req.user.id;
    const { taskId } = req.params;

    const events = await eventRepository.getEventsByTaskId(taskId, userId);

    res.json(events);
  } catch (error) {
    console.error('Erro ao obter eventos da task:', error.message);
    res.status(500).json({
      error: 'Erro ao obter eventos da task',
    });
  }
}

module.exports = {
  getAllEvents,
  getEventsByTaskId,
};