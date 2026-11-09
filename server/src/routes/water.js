import { Router } from 'express';
import WaterLog from '../models/WaterLog.js';
import { requireAuth } from '../middleware/auth.js';
const router=Router();router.use(requireAuth);
router.get('/',async(req,res,next)=>{try{const date=req.query.date||new Date().toISOString().slice(0,10);const logs=await WaterLog.find({user:req.user._id,date}).sort({createdAt:1});res.json({logs,totalMl:logs.reduce((s,x)=>s+x.amountMl,0)});}catch(e){next(e)}});
router.post('/',async(req,res,next)=>{try{const amountMl=Number(req.body.amountMl);if(!Number.isFinite(amountMl)||amountMl<1||amountMl>5000)return res.status(400).json({message:'Water amount must be between 1 and 5000 ml'});const log=await WaterLog.create({user:req.user._id,date:req.body.date||new Date().toISOString().slice(0,10),amountMl});res.status(201).json({log});}catch(e){next(e)}});
export default router;
