const db = require('../config/db');
const redisClient = require('../config/redis');
const { getChannel } = require('../config/rabbitmq');

async function checkDatabase() {
  try {
    await db.query('SELECT 1');
    return 'ok';
  } catch (error) {
    return 'error';
  }
}

async function checkRedis() {
  try {
    await redisClient.ping();
    return 'ok';
  } catch (error) {
    return 'error';
  }
}

function checkRabbitMQ() {
  try {
    const channel = getChannel();

    if (!channel) {
      return 'error';
    }

    return 'ok';
  } catch (error) {
    return 'error';
  }
}

async function getHealth(req, res) {
  const services = {
    api: 'ok',
    database: await checkDatabase(),
    redis: await checkRedis(),
    rabbitmq: checkRabbitMQ(),
  };

  const allOk = Object.values(services).every(status => status === 'ok');

  res.status(allOk ? 200 : 503).json({
    status: allOk ? 'ok' : 'degraded',
    services,
  });
}

module.exports = {
  getHealth,
};