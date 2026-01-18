const authService = require('../services/authService');
const { successResponse } = require('../utils/response');
const { asyncHandler } = require('../utils/helpers');
const { ValidationError } = require('../utils/errors');

const authController = {
  /**
   * POST /api/auth/register
   */
  register: asyncHandler(async (req, res) => {
    const { email, password, role, profile } = req.body;
    
    if (!email || !password || !role || !profile) {
      throw new ValidationError('All fields are required');
    }
    
    const result = await authService.register({ email, password, role, profile });
    
    successResponse(res, result, 'Registration successful', 201);
  }),
  
  /**
   * POST /api/auth/login
   */
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }
    
    const result = await authService.login(email, password);
    
    successResponse(res, result, 'Login successful');
  }),
  
  /**
   * POST /api/auth/refresh
   */
  refresh: asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      throw new ValidationError('Refresh token is required');
    }
    
    const result = await authService.refresh(refreshToken);
    
    successResponse(res, result, 'Token refreshed successfully');
  }),
  
  /**
   * POST /api/auth/logout
   */
  logout: asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      throw new ValidationError('Refresh token is required');
    }
    
    const result = await authService.logout(refreshToken);
    
    successResponse(res, result, 'Logout successful');
  }),

  /**
   * POST /api/auth/forgot-password
   * Send OTP to email
   */
  forgotPassword: asyncHandler(async (req, res) => {
    const User = require('../models/User');
    const { sendEmail } = require('../services/emailService');
    
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpires = Date.now() + 600000; // 10 minutes

    await user.save();

    // Send OTP email
    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset OTP - ShopNear',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4F46E5;">Password Reset OTP</h2>
            <p>You requested a password reset for your ShopNear account.</p>
            <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <h1 style="color: #4F46E5; font-size: 36px; margin: 0;">${otp}</h1>
            </div>
            <p><strong>This OTP is valid for 10 minutes.</strong></p>
            <p>If you didn't request this, please ignore this email.</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #E5E7EB;">
            <p style="color: #6B7280; font-size: 12px;">ShopNear - Indian Local Commerce Platform</p>
          </div>
        `,
        text: `Your password reset OTP is: ${otp}. Valid for 10 minutes.`,
      });

      successResponse(res, null, 'OTP sent to your email');
    } catch (error) {
      user.resetPasswordOTP = undefined;
      user.resetPasswordOTPExpires = undefined;
      await user.save();
      throw new Error('Failed to send OTP email');
    }
  }),

  /**
   * POST /api/auth/verify-otp
   * Verify OTP before password reset
   */
  verifyOTP: asyncHandler(async (req, res) => {
    const User = require('../models/User');
    
    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
      resetPasswordOTP: otp,
      resetPasswordOTPExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP',
      });
    }

    // OTP is valid - return success but don't clear OTP yet
    successResponse(res, null, 'OTP verified successfully');
  }),

  /**
   * POST /api/auth/reset-password
   * Reset password with verified OTP
   */
  resetPassword: asyncHandler(async (req, res) => {
    const User = require('../models/User');
    
    const { email, otp, password } = req.body;

    const user = await User.findOne({
      email,
      resetPasswordOTP: otp,
      resetPasswordOTPExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP',
      });
    }

    user.passwordHash = password;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpires = undefined;

    await user.save();

    successResponse(res, null, 'Password reset successful');
  }),

  /**
   * GET /api/auth/validate
   * Validate current session
   */
  validate: asyncHandler(async (req, res) => {
    successResponse(res, {
      user: req.user
    }, 'Session valid');
  })
};

module.exports = authController;
