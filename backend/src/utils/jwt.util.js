import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
  const SECRET = process.env.JWT_SECRET;
  const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

  if (!SECRET) {
    throw new Error('JWT_SECRET is not set in environment variables');
  }

  return jwt.sign({ id: userId }, SECRET, { expiresIn: EXPIRES_IN });
};

export const verifyToken = (token) => {
  const SECRET = process.env.JWT_SECRET;

  if (!SECRET) {
    throw new Error('JWT_SECRET is not set in environment variables');
  }

  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
};
