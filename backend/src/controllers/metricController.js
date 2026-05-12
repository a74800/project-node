const metricService = require('../services/metricServices');

async function getTaskCountsByStatus(req, res) {
  try {
    const metrics = await metricService.getTaskCountsByStatus();
    res.json(metrics);
  } catch (error) {
    console.error('Erro ao obter métricas de tasks:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

async function getEventCountsByType(req, res) {
  try {
    const metrics = await metricService.getEventCountsByType();
    res.json(metrics);
  } catch (error) {
    console.error('Erro ao obter métricas de eventos:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

module.exports = {
  getTaskCountsByStatus,
  getEventCountsByType,
};