import express from 'express';
import { body } from 'express-validator';
import passport from 'passport';
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  googleCallback,
  googleLogin,
  logout,
} from '../controllers/auth.controller.js';

const router = express.Router();

// Register validation
router.post(
  '/register',
  [
    body('name', 'Name is required').notEmpty(),
    body('email', 'Valid email is required').isEmail(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  ],
  register
);

// Login validation
router.post(
  '/login',
  [
    body('email', 'Valid email is required').isEmail(),
    body('password', 'Password is required').notEmpty(),
  ],
  login
);

// Forgot password
router.post(
  '/forgot-password',
  [body('email', 'Valid email is required').isEmail()],
  forgotPassword
);

// Reset password
router.post(
  '/reset-password',
  [
    body('resetToken', 'Reset token is required').notEmpty(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  ],
  resetPassword
);

// Logout
router.post('/logout', logout);

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  googleCallback
);

// Google login endpoint (for JWT-based Google Sign-In)
router.post('/google-login', googleLogin);

export default router;
