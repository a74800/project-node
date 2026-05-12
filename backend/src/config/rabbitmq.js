const amqp = require('amqplib');
const retry = require('../utils/retry');
require('dotenv').config();

let channel = null;
let connection = null;

async function connectRabbitMQ() {
  try {
    //connection = await amqp.connect(process.env.RABBITMQ_URL);
    connection = await retry(() => 
      amqp.connect(process.env.RABBITMQ_URL)
    );
    channel = await connection.createChannel();

    console.log('Ligado ao RabbitMQ');

    return channel;
  } catch (error) {
    console.error('Erro ao ligar ao RabbitMQ:', error.message);
    throw error;
  }
}

function getChannel() {
  if (!channel) {
    throw new Error('RabbitMQ channel não inicializado');
  }
  return channel;
}

module.exports = {
  connectRabbitMQ,
  getChannel,
};