import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import recipeRoutes from './routes/recipes.js';
import mealRoutes from './routes/meals.js';
import diaryRoutes from './routes/diary.js';
import pantryRoutes from './routes/pantry.js';
import groceryRoutes from './routes/groceries.js';
import waterRoutes from './routes/water.js';
import dashboardRoutes from './routes/dashboard.js';
import aiRoutes from './routes/ai.js';
import { notFound,errorHandler } from './middleware/errors.js';
const app=express();
app.use(helmet());
const allowedOrigins = [
  'http://localhost:5173',
  'https://nutrify-ai-ruddy.vercel.app',
  ...(process.env.CLIENT_ORIGIN || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean)
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({limit:'1mb'}));
app.use(cookieParser());
app.use('/api/auth',rateLimit({windowMs:15*60*1000,limit:100,standardHeaders:true,legacyHeaders:false}));
app.get('/api/health',(req,res)=>res.json({status:'ok',service:'nutrify-ai-api',timestamp:new Date().toISOString()}));
app.use('/api/auth',authRoutes);
app.use('/api/users',userRoutes);
app.use('/api/recipes',recipeRoutes);
app.use('/api/meals',mealRoutes);
app.use('/api/diary',diaryRoutes);
app.use('/api/pantry',pantryRoutes);
app.use('/api/groceries',groceryRoutes);
app.use('/api/water',waterRoutes);
app.use('/api/dashboard',dashboardRoutes);
app.use('/api/ai',aiRoutes);
app.use(notFound,errorHandler);
export default app;
