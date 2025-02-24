import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';         // adjust path if in a routes folder
import tasksRoutes from './routes/tasks';
import { verifyToken } from './middleware/authMiddleware';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// Enable CORS for all origins
app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/tasks', verifyToken, tasksRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});