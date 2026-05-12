const { getChannel } = require('../config/rabbitmq');

const EXCHANGE_NAME = 'task_events_exchange';
const QUEUE_NAME = 'task_events';
const ROUTING_KEY = 'task.event';

const DLX_NAME = 'task_events_dlx';
const DLQ_ROUTING_KEY = 'task.event.failed';

async function publishTaskEvent(eventData) {
  const channel = getChannel();

  await channel.assertExchange(EXCHANGE_NAME, 'direct', {
    durable: true,
  });

  await channel.assertQueue(QUEUE_NAME, {
    durable: true,
    deadLetterExchange: DLX_NAME,
    deadLetterRoutingKey: DLQ_ROUTING_KEY,
  });

  await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, ROUTING_KEY);

  channel.publish(
    EXCHANGE_NAME,
    ROUTING_KEY,
    Buffer.from(JSON.stringify(eventData)),
    { persistent: true }
  );

  console.log('Evento publicado:', eventData);
}

module.exports = {
  publishTaskEvent,
  QUEUE_NAME,
  EXCHANGE_NAME,
  ROUTING_KEY,
};