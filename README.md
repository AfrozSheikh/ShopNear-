# ShopNear - Local Commerce Platform

A modern local commerce discovery and inventory management platform built with MERN stack.

## 🚀 Features

- **Customer Features**
  - Location-based product search
  - Real-time inventory visibility
  - Optional delivery or shop visit
  - Order tracking

- **Shop Owner Features**
  - Digital shop management
  - Real-time inventory updates
  - Order management
  - Delivery toggles

- **Admin Features**
  - Shop verification workflow
  - Platform-wide analytics
  - Shop management

## 🛠️ Tech Stack

### Backend
- Node.js + Express.js
- MongoDB with GeoJSON indexing
- JWT Authentication
- Razorpay Payment Integration
- Winston Logging

### Frontend
- React.js with Vite
- React Router DOM
- Tailwind CSS
- Axios for API calls
- Context API for state management

## 📁 Project Structure

```
shopnear/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── models/         # Mongoose models
│   │   ├── services/       # Business logic
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   └── app.js         # Express app setup
│   └── server.js          # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/    # React components
    │   ├── pages/         # Page components
    │   ├── context/       # React context
    │   ├── services/      # API services
    │   └── utils/         # Utilities
    └── index.html
```

## 🏃 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (v6+)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shopnear
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file (copy from .env.example)
   # Update MongoDB URI and JWT secrets
   
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Create .env file
   echo "VITE_API_BASE_URL=http://localhost:5000/api" > .env
   
   npm run dev
   ```

### Default Ports
- Backend API: `http://localhost:5000`
- Frontend App: `http://localhost:5173`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout

### Shops
- `POST /api/shops` - Create shop (Shop Owner)
- `GET /api/shops/:id` - Get shop details
- `PATCH /api/shops/:id` - Update shop
- `GET /api/admin/shops/pending` - Get pending verifications (Admin)
- `POST /api/admin/shops/:id/verify` - Verify shop (Admin)

### Products
- `POST /api/products` - Create product
- `GET /api/products/:id` - Get product
- `PATCH /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Search
- `GET /api/search/products?q=&lat=&lng=&radius=` - Search products
- `GET /api/search/shops?lat=&lng=&radius=` - Search shops

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/customer/me` - Get my orders
- `PATCH /api/orders/:id/accept` - Accept order (Shop Owner)
- `PATCH /api/orders/:id/reject` - Reject order (Shop Owner)

## 🔐 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shopnear
JWT_ACCESS_SECRET=your_secret_here
JWT_REFRESH_SECRET=your_secret_here
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 🧪 Testing

### Manual Testing
1. Start MongoDB
2. Run backend: `cd backend && npm run dev`
3. Run frontend: `cd frontend && npm run dev`
4. Register users with different roles
5. Test shop verification workflow
6. Create products and search

### Test Accounts
Create accounts with these roles:
- Admin: Verify shops
- Shop Owner: Manage shops and products
- Customer: Search and order

## 🗺️ Roadmap

### Phase 1 (MVP) ✅
- Authentication & Authorization
- Shop verification
- Product & inventory management
- Location-based search
- Order management
- Basic payment integration

### Phase 2 (Future)
- Product images
- Reviews & ratings
- Advanced analytics
- Push notifications
- Mobile apps

### Phase 3 (Scale)
- Microservices architecture
- Redis caching
- CDN integration
- Delivery partner integration

## 🤝 Contributing

This is a startup project. Contributions are welcome!

## 📄 License

ISC

## 👥 Team

Built by a senior startup engineer focused on scalable, production-ready architecture.
