

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import activitiesRoutes from './routes/activities.js';
import academicsRoutes from './routes/academics.js';
import authRoutes from './routes/auth.js';


// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || '', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
  res.send('Student Hub Backend API');
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/academics', academicsRoutes);

import usersRoutes from './routes/users.js';
app.use('/api/users', usersRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
