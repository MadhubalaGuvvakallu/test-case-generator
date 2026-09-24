const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'melo_jwt_secret_key';

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Not authorised. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, name, email }
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Not authorised. Invalid or expired token.' });
  }
};

module.exports = { protect };
