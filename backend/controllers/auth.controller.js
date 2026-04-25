import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { validationResult } from 'express-validator';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Register user
export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', errors.array(), 400);
    }

    const { name, email, password, role } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return errorResponse(res, 'Email already registered', null, 400);
    }

    // Create user
    user = await User.create({
      name,
      email,
      password,
      role: role || 'buyer',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login user
export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', errors.array(), 400);
    }

    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return errorResponse(res, 'Please provide email and password', null, 400);
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return errorResponse(res, 'Invalid email or password', null, 401);
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return errorResponse(res, 'Invalid email or password', null, 401);
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Forgot password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return errorResponse(res, 'User with that email does not exist', null, 404);
    }

    // Get reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set expire
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
      // Send email (implement based on your email service)
      // await sendEmail({
      //   email: user.email,
      //   subject: 'Password reset token',
      //   message,
      // });

      return successResponse(res, 'Email sent', { message: 'Password reset email sent' });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return errorResponse(res, 'Email could not be sent', error.message, 500);
    }
  } catch (error) {
    next(error);
  }
};

// Reset password
export const resetPassword = async (req, res, next) => {
  try {
    const { resetToken, password } = req.body;

    if (!resetToken || !password) {
      return errorResponse(res, 'Reset token and password are required', null, 400);
    }

    // Get hashed token
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return errorResponse(res, 'Invalid or expired reset token', null, 400);
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    const token = generateToken(user._id);

    return successResponse(res, 'Password updated successfully', { token });
  } catch (error) {
    next(error);
  }
};

// Google OAuth callback
export const googleCallback = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return errorResponse(res, 'Google authentication failed', null, 401);
    }

    const token = generateToken(user._id);

    // Redirect to frontend with token
    const frontendUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth-success?token=${token}&userId=${user._id}`);
  } catch (error) {
    next(error);
  }
};

// Google login with JWT (for frontend-based Google Sign-In)
export const googleLogin = async (req, res, next) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return errorResponse(res, 'Google credential is required', null, 400);
    }

    // Decode the JWT from Google
    const decodedCredential = JSON.parse(Buffer.from(credential.split('.')[1], 'base64').toString());

    let user = await User.findOne({ email: decodedCredential.email });

    if (!user) {
      // Create new user from Google credential
      user = await User.create({
        name: decodedCredential.name,
        email: decodedCredential.email,
        googleId: decodedCredential.sub,
        avatar: decodedCredential.picture,
        password: Math.random().toString(36).slice(2),
        role: 'buyer',
      });
    } else if (!user.googleId) {
      // Link existing account with Google
      user.googleId = decodedCredential.sub;
      user.avatar = decodedCredential.picture || user.avatar;
      await user.save();
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Google authentication successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Logout
export const logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};
