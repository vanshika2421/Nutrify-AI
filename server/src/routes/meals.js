import { Router } from 'express';
import Meal from '../models/Meal.js';
import { requireAuth } from '../middleware/auth.js';
const router=Router();router.use(requireAuth);
router.get('/',async(req,res,next)=>{try{const date=req.query.date||new Date().toISOString().slice(0,10);const start=req.query.start||date;const end=req.query.end||date;const meals=await Meal.find({user:req.user._id,date:{$gte:start,$lte:end}}).populate('recipe','title image');res.json({meals});}catch(e){next(e)}});
router.post('/',async(req,res,next)=>{try{const {title,date,slot,recipe,servings=1,nutrition={}}=req.body;if(!title||!date||!slot)return res.status(400).json({message:'Title, date and meal slot are required'});const meal=await Meal.create({user:req.user._id,title,date,slot,recipe:recipe||undefined,servings,nutrition});res.status(201).json({meal});}catch(e){next(e)}});
router.patch('/:id',async(req,res,next)=>{try{const meal=await Meal.findOneAndUpdate({_id:req.params.id,user:req.user._id},req.body,{new:true,runValidators:true});if(!meal)return res.status(404).json({message:'Meal not found'});res.json({meal});}catch(e){next(e)}});
router.delete('/:id',async(req,res,next)=>{try{const meal=await Meal.findOneAndDelete({_id:req.params.id,user:req.user._id});if(!meal)return res.status(404).json({message:'Meal not found'});res.json({message:'Meal removed'});}catch(e){next(e)}});
export default router;
