import { Router } from 'express';
import DiaryEntry from '../models/DiaryEntry.js';
import { requireAuth } from '../middleware/auth.js';
const router=Router();router.use(requireAuth);
router.get('/',async(req,res,next)=>{try{const date=req.query.date||new Date().toISOString().slice(0,10);const entries=await DiaryEntry.find({user:req.user._id,date}).sort({createdAt:-1});res.json({entries});}catch(e){next(e)}});
router.post('/',async(req,res,next)=>{try{const {title,date=new Date().toISOString().slice(0,10),mealType='snack',servings=1,nutrition={}}=req.body;if(!title)return res.status(400).json({message:'Food name is required'});const entry=await DiaryEntry.create({user:req.user._id,title,date,mealType,servings,nutrition});res.status(201).json({entry});}catch(e){next(e)}});
router.delete('/:id',async(req,res,next)=>{try{const entry=await DiaryEntry.findOneAndDelete({_id:req.params.id,user:req.user._id});if(!entry)return res.status(404).json({message:'Entry not found'});res.json({message:'Entry removed'});}catch(e){next(e)}});
export default router;
