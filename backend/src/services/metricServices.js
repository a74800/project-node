const taskRepository = require('../repositories/taskRepository');
const eventRepository = require('../repositories/eventRepository');

async function getTaskCountsByStatus() {
  return await taskRepository.getTaskCountsByStatus();
}

async function getEventCountsByType() {
  return await eventRepository.getEventCountsByType();
}

module.exports = {
  getTaskCountsByStatus,
  getEventCountsByType,
};