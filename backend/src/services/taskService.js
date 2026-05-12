const redisClient = require('../config/redis');
const { publishTaskEvent } = require('../utils/publisher');
const taskRepository = require('../repositories/taskRepository');

const ALLOWED_STATUS = ['pending', 'in_progress', 'done'];

function validateStatus(status) {
  return ALLOWED_STATUS.includes(status);
}

function getTasksKey(userId) {
  return `tasks:user:${userId}:all`;
}

function getTaskKey(userId, taskId) {
  return `tasks:user:${userId}:task:${taskId}`;
}

async function getAllTasks(userId) {
  const cacheKey = getTasksKey(userId);

  const cached = await redisClient.get(cacheKey);

  if (cached) {
    console.log(`Cache HIT - ${cacheKey}`);
    return JSON.parse(cached);
  }

  console.log(`Cache MISS - ${cacheKey}`);

  const tasks = await taskRepository.getAllTasks(userId);

  await redisClient.setEx(cacheKey, 60, JSON.stringify(tasks));

  return tasks;
}

async function getTaskById(id, userId) {
  const cacheKey = getTaskKey(userId, id);

  const cached = await redisClient.get(cacheKey);

  if (cached) {
    console.log(`Cache HIT - ${cacheKey}`);
    return JSON.parse(cached);
  }

  console.log(`Cache MISS - ${cacheKey}`);

  const task = await taskRepository.getTaskById(id, userId);

  if (!task) {
    const error = new Error('Task não encontrada');
    error.statusCode = 404;
    throw error;
  }

  await redisClient.setEx(cacheKey, 60, JSON.stringify(task));

  return task;
}

async function createTask(userId, data) {
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
    userId,
    title: title.trim(),
    description: description || null,
    status: taskStatus,
  });

  await redisClient.del(getTasksKey(userId));

  await publishTaskEvent({
    event: 'task.created',
    userId,
    taskId: newTask.id,
    title: newTask.title,
    status: newTask.status,
    timestamp: new Date().toISOString(),
  });

  return newTask;
}

async function updateTask(id, userId, data) {
  const existingTask = await taskRepository.getTaskById(id, userId);

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

  await taskRepository.updateTask(id, userId, {
    title: title.trim(),
    description: description || null,
    status: taskStatus,
  });

  await redisClient.del(getTasksKey(userId));
  await redisClient.del(getTaskKey(userId, id));

  const updatedTask = await taskRepository.getTaskById(id, userId);

  await publishTaskEvent({
    event: 'task.updated',
    userId,
    taskId: updatedTask.id,
    title: updatedTask.title,
    status: updatedTask.status,
    timestamp: new Date().toISOString(),
  });

  return updatedTask;
}

async function deleteTask(id, userId) {
  const existingTask = await taskRepository.getTaskById(id, userId);

  if (!existingTask) {
    const error = new Error('Task não encontrada');
    error.statusCode = 404;
    throw error;
  }

  await taskRepository.deleteTask(id, userId);

  await redisClient.del(getTasksKey(userId));
  await redisClient.del(getTaskKey(userId, id));

  await publishTaskEvent({
    event: 'task.deleted',
    userId,
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