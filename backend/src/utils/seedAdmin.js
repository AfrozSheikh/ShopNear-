const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * Seed default admin user
 */
const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@shopnear.com' });
    
    if (adminExists) {
      logger.info('Admin user already exists');
      return;
    }

    // Create admin user - passwordHash will be hashed by pre-save hook
    const adminUser = new User({
      email: 'admin@shopnear.com',
      passwordHash: 'Admin@123', // Pre-save hook will hash this
      role: 'admin',
      profile: {
        name: 'ShopNear Admin',
        phone: '1234567890',
      },
    });

    await adminUser.save();

    logger.info('✅ Admin user created successfully');
    logger.info('📧 Email: admin@shopnear.com');
    logger.info('🔑 Password: Admin@123');
    logger.info('⚠️  IMPORTANT: Change the admin password after first login!');
    
    return adminUser;
  } catch (error) {
    logger.error('Error seeding admin user:', error);
    throw error;
  }
};

module.exports = { seedAdmin };
