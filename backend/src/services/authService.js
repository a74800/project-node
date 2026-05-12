const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

function generateToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    }
  );
}

async function register({ name, email, password }) {
  if (!name || !email || !password) {
    const error = new Error('Nome, email e password são obrigatórios');
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await userRepository.findUserByEmail(email);

  if (existingUser) {
    const error = new Error('Email já registado');
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await userRepository.createUser({
    name,
    email,
    passwordHash,
  });

  const token = generateToken(user);

  return {
    user,
    token,
  };
}

async function login({ email, password }) {
  if (!email || !password) {
    const error = new Error('Email e password são obrigatórios');
    error.statusCode = 400;
    throw error;
  }

  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    const error = new Error('Credenciais inválidas');
    error.statusCode = 401;
    throw error;
  }

  const validPassword = await bcrypt.compare(password, user.password_hash);

  if (!validPassword) {
    const error = new Error('Credenciais inválidas');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  };
}

async function getMe(userId) {
  const user = await userRepository.findUserById(userId);

  if (!user) {
    const error = new Error('Utilizador não encontrado');
    error.statusCode = 404;
    throw error;
  }

  return user;
}

module.exports = {
  register,
  login,
  getMe,
};