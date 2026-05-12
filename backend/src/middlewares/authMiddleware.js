const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: 'Token não fornecido',
    });
  }

  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer' || !token) {
    return res.status(401).json({
      error: 'Formato do token inválido',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.sub,
      email: decoded.email,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Token inválido ou expirado',
    });
  }
}

module.exports = authMiddleware;