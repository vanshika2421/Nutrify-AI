import { Router } from 'express';
import PantryItem from '../models/PantryItem.js';
import { requireAuth } from '../middleware/auth.js';
const router=Router();router.use(requireAuth);
router.get('/',async(req,res,next)=>{try{res.json({items:await PantryItem.find({user:req.user._id}).sort({expiryDate:1})});}catch(e){next(e)}});
router.post('/',async(req,res,next)=>{try{const {name,quantity,unit,category,expiryDate}=req.body;if(!name)return res.status(400).json({message:'Item name is required'});const item=await PantryItem.create({user:req.user._id,name,quantity,unit,category,expiryDate});res.status(201).json({item});}catch(e){next(e)}});
router.patch('/:id',async(req,res,next)=>{try{const item=await PantryItem.findOneAndUpdate({_id:req.params.id,user:req.user._id},req.body,{new:true,runValidators:true});if(!item)return res.status(404).json({message:'Pantry item not found'});res.json({item});}catch(e){next(e)}});
router.delete('/:id',async(req,res,next)=>{try{const item=await PantryItem.findOneAndDelete({_id:req.params.id,user:req.user._id});if(!item)return res.status(404).json({message:'Pantry item not found'});res.json({message:'Item deleted'});}catch(e){next(e)}});
export default router;
