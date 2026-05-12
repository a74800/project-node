const amqp = require('amqplib');
const retry = require('../utils/retry');
const path = require('path');
const db = require('./db');

require('dotenv').config({
  path: path.resolve(__dirname, '../.env'),
});

const EXCHANGE_NAME = 'task_events_exchange';
const QUEUE_NAME = 'task_events';
const ROUTING_KEY = 'task.event';

const DLX_NAME = 'task_events_dlx';
const DLQ_NAME = 'task_events_dlq';
const DLQ_ROUTING_KEY = 'task.event.failed';

async function saveEvent(event) {
  await db.query(
    `INSERT INTO task_events (user_id, task_id, event_type, payload)
     VALUES (?, ?, ?, ?)`,
    [
      event.userId,
      event.taskId || null,
      event.event,
      JSON.stringify(event),
    ]
  );
}

async function startConsumer() {
  try {
    //const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const connection = await retry(() =>
      amqp.connect(process.env.RABBITMQ_URL)
    );
    const channel = await connection.createChannel();

    await channel.assertExchange(EXCHANGE_NAME, 'direct', {
      durable: true,
    });

    await channel.assertExchange(DLX_NAME, 'direct', {
      durable: true,
    });

    await channel.assertQueue(DLQ_NAME, {
      durable: true,
    });

    await channel.bindQueue(DLQ_NAME, DLX_NAME, DLQ_ROUTING_KEY);

    await channel.assertQueue(QUEUE_NAME, {
      durable: true,
      deadLetterExchange: DLX_NAME,
      deadLetterRoutingKey: DLQ_ROUTING_KEY,
    });

    await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, ROUTING_KEY);

    console.log(`Consumer à escuta da fila: ${QUEUE_NAME}`);
    console.log(`DLQ configurada: ${DLQ_NAME}`);

    channel.consume(QUEUE_NAME, async (message) => {
      if (!message) return;

      try {
        const content = message.content.toString();
        const event = JSON.parse(content);

        console.log('Evento recebido:', event);

        await saveEvent(event);

        console.log('Evento guardado na BD');

        channel.ack(message);
      } catch (error) {
        console.error('Erro ao processar mensagem:', error.message);

        channel.nack(message, false, false);
      }
    });
  } catch (error) {
    console.error('Erro no consumer:', error.message);
    process.exit(1);
  }
}

startConsumer();