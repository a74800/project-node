const db = require('./db');

async function testConnection() {
  try {
    const connection = await db.getConnection();
    console.log('Ligação ao MySQL com sucesso!');
    connection.release();
  } catch (error) {
    console.error('Erro ao ligar ao MySQL:', error.message);
  }
}

testConnection();