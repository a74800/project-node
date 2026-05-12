const authService = require('../services/authService');

async function register(req, res) {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message || 'Erro interno do servidor',
    });
  }
}

async function login(req, res) {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message || 'Erro interno do servidor',
    });
  }
}

async function me(req, res) {
  try {
    const user = await authService.getMe(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message || 'Erro interno do servidor',
    });
  }
}

module.exports = {
  register,
  login,
  me,
};