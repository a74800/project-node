const eventRepository = require('../repositories/eventRepository');

async function getAllEvents() {
  return await eventRepository.getAllEvents();
}

async function getEventsByTaskId(taskId) {
  return await eventRepository.getEventsByTaskId(taskId);
}

async function getEventCountsByType() {
  return await eventRepository.getEventCountsByType();
}

module.exports = {
  getAllEvents,
  getEventsByTaskId,
  getEventCountsByType,
};