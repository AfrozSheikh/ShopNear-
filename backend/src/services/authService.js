const jwt = require('jsonwebtoken');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const config = require('../config/env');
const { ValidationError, UnauthorizedError, ConflictError } = require('../utils/errors');

class AuthService {
  /**
   * Register a new user
   */
  async register({ email, password, role, profile }) {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }
    
    // Create user
    const user = await User.create({
      email,
      passwordHash: password, // Will be hashed by pre-save hook
      role,
      profile
    });
    
    // Generate tokens
    const tokens = await this.generateTokens(user._id);
    
    return {
      user: user.toJSON(),
      ...tokens
    };
  }
  
  /**
   * Login user
   */
  async login(email, password) {
    // Find user
    const user = await User.findOne({ email });
    if (!user || !user.isActive) {
      throw new UnauthorizedError('Invalid credentials');
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid credentials');
    }
    
    // Generate tokens
    const tokens = await this.generateTokens(user._id);
    
    return {
      user: user.toJSON(),
      ...tokens
    };
  }
  
  /**
   * Refresh access token
   */
  async refresh(refreshToken) {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
    
    // Check if token exists and is not revoked
    const tokenDoc = await RefreshToken.findOne({
      token: refreshToken,
      userId: decoded.userId,
      isRevoked: false
    });
    
    if (!tokenDoc) {
      throw new UnauthorizedError('Invalid refresh token');
    }
    
    // Check if expired
    if (tokenDoc.expiresAt < new Date()) {
      throw new UnauthorizedError('Refresh token expired');
    }
    
    // Generate new access token
    const accessToken = this.generateAccessToken(decoded.userId);
    
    return { accessToken };
  }
  
  /**
   * Logout user
   */
  async logout(refreshToken) {
    // Revoke refresh token
    await RefreshToken.updateOne(
      { token: refreshToken },
      { isRevoked: true }
    );
    
    return { message: 'Logged out successfully' };
  }
  
  /**
   * Generate access and refresh tokens
   */
  async generateTokens(userId) {
    const accessToken = this.generateAccessToken(userId);
    const refreshToken = this.generateRefreshToken(userId);
    
    // Store refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
    
    await RefreshToken.create({
      userId,
      token: refreshToken,
      expiresAt
    });
    
    return { accessToken, refreshToken };
  }
  
  /**
   * Generate access token (short-lived)
   */
  generateAccessToken(userId) {
    return jwt.sign(
      { userId },
      config.jwt.accessSecret,
      { expiresIn: config.jwt.accessExpiresIn }
    );
  }
  
  /**
   * Generate refresh token (long-lived)
   */
  generateRefreshToken(userId) {
    return jwt.sign(
      { userId },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiresIn }
    );
  }
}

module.exports = new AuthService();
