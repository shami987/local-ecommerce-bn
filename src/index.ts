// Load environment variables FIRST before any other imports
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { connectDB } from './config/database';
import { swaggerSpec } from './config/swagger';
import authRoutes from './routes/auth';
import categoryRoutes from './routes/category';
import productRoutes from './routes/product';
import shopRoutes from './routes/shop';
import promotionRoutes from './routes/promotion';
import cartRoutes from './routes/cart';
import orderRoutes from './routes/order';

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Middleware
app.use(express.json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Auth API is running',
    documentation: '/api-docs'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});

// Connect to MongoDB after server starts
connectDB();