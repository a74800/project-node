const app = require('./app');
const redisClient = require('./config/redis');
const { connectRabbitMQ } = require('./config/rabbitmq')
require('dotenv').config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await redisClient.connect();
    console.log('Ligado ao Redis');

    await connectRabbitMQ();

    app.listen(PORT, () => {
      console.log(`Servidor a correr na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao arrancar servidor:', error.message);
    process.exit(1);
  }
}

startServer();