import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import authRoutes from './routes/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Auth API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});