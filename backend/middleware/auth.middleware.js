import { verifyToken } from '../utils/generateToken.js';
import User from '../models/User.js';
import { errorResponse } from '../utils/apiResponse.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return errorResponse(res, 'Not authorized to access this route', null, 401);
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return errorResponse(res, 'Invalid token', null, 401);
    }

    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return errorResponse(res, 'User not found', null, 404);
    }

    next();
  } catch (error) {
    return errorResponse(res, 'Not authorized to access this route', error.message, 401);
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return errorResponse(res, `User role '${req.user.role}' is not authorized to access this route`, null, 403);
    }
    next();
  };
};
