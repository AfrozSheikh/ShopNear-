// Email notification templates for backend (Nodemailer)

// Order confirmation email for customer
export const orderConfirmationTemplate = (order, customer) => {
  return {
    subject: `Order Confirmation - #${order.orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .order-details { background: white; padding: 15px; margin: 20px 0; border-radius: 8px; }
          .item { display: flex; justify-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .total { font-size: 18px; font-weight: bold; margin-top: 15px; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏪 ShopNear</h1>
            <p>Order Confirmation</p>
          </div>
          
          <div class="content">
            <h2>Hi ${customer.name},</h2>
            <p>Thank you for your order! We've received your order and will notify you once the shop accepts it.</p>
            
            <div class="order-details">
              <h3>Order #${order.orderNumber}</h3>
              <p><strong>Shop:</strong> ${order.shop.name}</p>
              <p><strong>Type:</strong> ${order.isDelivery ? 'Delivery' : 'Pickup'}</p>
              <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
              
              <h4>Items:</h4>
              ${order.items.map(item => `
                <div class="item">
                  <span>${item.product.name} × ${item.quantity}</span>
                  <span>₹${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              `).join('')}
              
              <div class="total">
                Total: ₹${order.totalAmount.toFixed(2)}
              </div>
            </div>
            
            <p>You can track your order status in your account dashboard.</p>
          </div>
          
          <div class="footer">
            <p>© 2024 ShopNear. All rights reserved.</p>
            <p>Support local businesses, shop near you!</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
};

// New order notification for shop owner
export const newOrderNotificationTemplate = (order, shop) => {
  return {
    subject: `New Order Received - #${order.orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .order-details { background: white; padding: 15px; margin: 20px 0; border-radius: 8px; }
          .action-button { display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📦 New Order!</h1>
          </div>
          
          <div class="content">
            <h2>Hi ${shop.name},</h2>
            <p>You have received a new order. Please review and accept or reject it.</p>
            
            <div class="order-details">
              <h3>Order #${order.orderNumber}</h3>
              <p><strong>Customer:</strong> ${order.customer.name}</p>
              <p><strong>Type:</strong> ${order.isDelivery ? 'Delivery' : 'Pickup'}</p>
              <p><strong>Amount:</strong> ₹${order.totalAmount.toFixed(2)}</p>
              
              <h4>Items:</h4>
              <ul>
                ${order.items.map(item => `
                  <li>${item.product.name} × ${item.quantity}</li>
                `).join('')}
              </ul>
            </div>
            
            <div style="text-align: center;">
              <a href="${process.env.CLIENT_URL}/shop/${shop._id}/orders" class="action-button">View Orders</a>
            </div>
          </div>
          
          <div class="footer">
            <p>© 2024 ShopNear. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
};

// Shop verification email
export const shopVerificationTemplate = (shop, approved, reason = '') => {
  return {
    subject: `Shop ${approved ? 'Approved' : 'Rejected'} - ${shop.name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: ${approved ? '#10b981' : '#ef4444'}; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .status-box { background: white; padding: 15px; margin: 20px 0; border-radius: 8px; border-left: 4px solid ${approved ? '#10b981' : '#ef4444'}; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${approved ? '✅ Congratulations!' : '❌ Application Update'}</h1>
          </div>
          
          <div class="content">
            <h2>Hi ${shop.owner.name},</h2>
            
            <div class="status-box">
              <h3>Shop ${approved ? 'Approved' : 'Rejected'}</h3>
              <p><strong>Shop Name:</strong> ${shop.name}</p>
              
              ${approved ? `
                <p>Your shop has been approved and is now live on ShopNear! You can start adding products and accepting orders.</p>
                <p style="margin-top: 20px;">
                  <a href="${process.env.CLIENT_URL}/shop-dashboard" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px;">Go to Dashboard</a>
                </p>
              ` : `
                <p><strong>Reason:</strong> ${reason}</p>
                <p>Unfortunately, your shop application was not approved. You can update your shop details and reapply.</p>
              `}
            </div>
          </div>
          
          <div class="footer">
            <p>© 2024 ShopNear. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
};
