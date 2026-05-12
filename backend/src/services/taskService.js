const redisClient = require('../config/redis');
const { publishTaskEvent } = require('../utils/publisher');
const TASKS_KEY = 'tasks:all';
const TASK_KEY_PREFIX = 'tasks:';

const taskRepository = require('../repositories/taskRepository');

const ALLOWED_STATUS = ['pending', 'in_progress', 'done'];

function validateStatus(status) {
  return ALLOWED_STATUS.includes(status);
}

async function getAllTasks() {
  // 1. tentar ir ao Redis
  const cached = await redisClient.get(TASKS_KEY);

  if (cached) {
    console.log('Cache HIT - tasks');
    return JSON.parse(cached);
  }

  console.log('Cache MISS - tasks');

  // 2. ir ao MySQL
  const tasks = await taskRepository.getAllTasks();

  // 3. guardar no Redis (TTL 60s)
  await redisClient.setEx(TASKS_KEY, 60, JSON.stringify(tasks));

  return tasks;
}

async function getTaskById(id) {
  const key = TASK_KEY_PREFIX + id;

  const cached = await redisClient.get(key);

  if (cached) {
    console.log(`Cache HIT - task ${id}`);
    return JSON.parse(cached);
  }

  console.log(`Cache MISS - task ${id}`);

  const task = await taskRepository.getTaskById(id);

  if (!task) {
    const error = new Error('Task não encontrada');
    error.statusCode = 404;
    throw error;
  }

  // guardar no Redis
  await redisClient.setEx(key, 60, JSON.stringify(task));

  return task;
}

async function createTask(data) {
  const { title, description, status } = data;

  if (!title || title.trim() === '') {
    const error = new Error('O campo title é obrigatório');
    error.statusCode = 400;
    throw error;
  }

  const taskStatus = status || 'pending';

  if (!validateStatus(taskStatus)) {
    const error = new Error('Status inválido');
    error.statusCode = 400;
    throw error;
  }

  const newTask = await taskRepository.createTask({
    title: title.trim(),
    description: description || null,
    status: taskStatus,
  });

  await redisClient.del(TASKS_KEY);

  await publishTaskEvent({
    event: 'task.created',
    taskId: newTask.id,
    title: newTask.title,
    status: newTask.status,
    timestamp: new Date().toISOString(),
  });

  return newTask;
}

async function updateTask(id, data) {
  const existingTask = await taskRepository.getTaskById(id);

  if (!existingTask) {
    const error = new Error('Task não encontrada');
    error.statusCode = 404;
    throw error;
  }

  const { title, description, status } = data;

  if (!title || title.trim() === '') {
    const error = new Error('O campo title é obrigatório');
    error.statusCode = 400;
    throw error;
  }

  const taskStatus = status || 'pending';

  if (!validateStatus(taskStatus)) {
    const error = new Error('Status inválido');
    error.statusCode = 400;
    throw error;
  }

  await taskRepository.updateTask(id, {
    title: title.trim(),
    description: description || null,
    status: taskStatus,
  });

  await redisClient.del(TASKS_KEY);
  await redisClient.del(TASK_KEY_PREFIX + id);

  const updatedTask = await taskRepository.getTaskById(id);

  await publishTaskEvent({
    event: 'task.updated',
    taskId: updatedTask.id,
    title: updatedTask.title,
    status: updatedTask.status,
    timestamp: new Date().toISOString(),
  });

  return updatedTask;
}

async function deleteTask(id) {
  const existingTask = await taskRepository.getTaskById(id);

  if (!existingTask) {
    const error = new Error('Task não encontrada');
    error.statusCode = 404;
    throw error;
  }

  await taskRepository.deleteTask(id);

  await redisClient.del(TASKS_KEY);
  await redisClient.del(TASK_KEY_PREFIX + id);

  await publishTaskEvent({
    event: 'task.deleted',
    taskId: existingTask.id,
    title: existingTask.title,
    status: existingTask.status,
    timestamp: new Date().toISOString(),
  });

  return { message: 'Task removida com sucesso' };
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};