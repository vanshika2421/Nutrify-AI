import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
const router=Router(); router.use(requireAuth);
const schema=z.object({
 displayName:z.string().trim().max(60).optional(), age:z.number().min(13).max(110).optional(),
 heightCm:z.number().min(80).max(250).optional(), weightKg:z.number().min(20).max(400).optional(),
 activityLevel:z.enum(['sedentary','light','moderate','active','very_active']).optional(),
 goal:z.enum(['maintain','lose','gain','build_muscle']).optional(),
 diet:z.enum(['anything','vegetarian','vegan','eggetarian','pescatarian']).optional(),
 allergies:z.array(z.string().max(60)).max(30).optional(),
 dailyCalories:z.number().min(800).max(6000).optional(), proteinGoal:z.number().min(0).max(500).optional(),
 carbsGoal:z.number().min(0).max(800).optional(), fatGoal:z.number().min(0).max(300).optional(),
 waterGoalMl:z.number().min(250).max(10000).optional(), weeklyBudget:z.number().min(0).max(1000000).optional()
}).strict();
router.get('/profile',(req,res)=>res.json({profile:req.user.profile}));
router.patch('/profile',async(req,res,next)=>{try{const parsed=schema.safeParse(req.body);if(!parsed.success)return res.status(400).json({message:'Invalid profile fields',errors:parsed.error.flatten()});Object.assign(req.user.profile,parsed.data);await req.user.save();res.json({profile:req.user.profile});}catch(e){next(e)}});
export default router;
