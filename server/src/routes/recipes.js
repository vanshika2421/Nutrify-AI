import { Router } from 'express';
import Recipe from '../models/Recipe.js';
import { requireAuth } from '../middleware/auth.js';
const router=Router(); router.use(requireAuth);
router.get('/',async(req,res,next)=>{try{
 const {q='',mealType,diet,limit=60}=req.query; const filter={$or:[{owner:null},{owner:req.user._id}]};
 if(mealType)filter.mealType=mealType;if(diet)filter.diet=diet;
 if(q.trim())filter.$text={$search:q.trim()};
 const recipes=await Recipe.find(filter).sort({createdAt:-1}).limit(Math.min(Number(limit)||60,100));
 res.json({recipes});
}catch(e){next(e)}});
router.get('/:id',async(req,res,next)=>{try{const recipe=await Recipe.findOne({_id:req.params.id,$or:[{owner:null},{owner:req.user._id}]});if(!recipe)return res.status(404).json({message:'Recipe not found'});res.json({recipe});}catch(e){next(e)}});
router.post('/',async(req,res,next)=>{try{const data={...req.body,owner:req.user._id};delete data._id;const recipe=await Recipe.create(data);res.status(201).json({recipe});}catch(e){next(e)}});
router.patch('/:id',async(req,res,next)=>{try{const recipe=await Recipe.findOneAndUpdate({_id:req.params.id,owner:req.user._id},req.body,{new:true,runValidators:true});if(!recipe)return res.status(404).json({message:'Recipe not found or not editable'});res.json({recipe});}catch(e){next(e)}});
router.delete('/:id',async(req,res,next)=>{try{const recipe=await Recipe.findOneAndDelete({_id:req.params.id,owner:req.user._id});if(!recipe)return res.status(404).json({message:'Recipe not found'});res.json({message:'Recipe deleted'});}catch(e){next(e)}});
router.post('/:id/favorite',async(req,res,next)=>{try{const id=req.params.id;const exists=req.user.favorites.some(x=>x.toString()===id);req.user.favorites=exists?req.user.favorites.filter(x=>x.toString()!==id):[...req.user.favorites,id];await req.user.save();res.json({favorited:!exists});}catch(e){next(e)}});
router.get('/meta/favorites',async(req,res,next)=>{try{const recipes=await Recipe.find({_id:{$in:req.user.favorites}});res.json({recipes});}catch(e){next(e)}});
export default router;
