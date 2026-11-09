import { Router } from 'express';
import Meal from '../models/Meal.js';
import DiaryEntry from '../models/DiaryEntry.js';
import WaterLog from '../models/WaterLog.js';
import PantryItem from '../models/PantryItem.js';
import Recipe from '../models/Recipe.js';
import { requireAuth } from '../middleware/auth.js';
const router=Router();router.use(requireAuth);
router.get('/',async(req,res,next)=>{try{
 const date=req.query.date||new Date().toISOString().slice(0,10);
 const [meals,entries,water,pantryCount,recipeCount]=await Promise.all([
  Meal.find({user:req.user._id,date}),DiaryEntry.find({user:req.user._id,date}),WaterLog.find({user:req.user._id,date}),
  PantryItem.countDocuments({user:req.user._id}),Recipe.countDocuments({$or:[{owner:null},{owner:req.user._id}]})
 ]);
 const sum=[...meals,...entries].reduce((a,x)=>{for(const k of ['calories','protein','carbs','fat'])a[k]+=(Number(x.nutrition?.[k])||0)*(Number(x.servings)||1);return a;},{calories:0,protein:0,carbs:0,fat:0});
 const waterMl=water.reduce((s,x)=>s+x.amountMl,0);
 res.json({date,totals:sum,goals:{calories:req.user.profile.dailyCalories,protein:req.user.profile.proteinGoal,carbs:req.user.profile.carbsGoal,fat:req.user.profile.fatGoal,waterMl:req.user.profile.waterGoalMl},waterMl,mealCount:meals.length,diaryCount:entries.length,pantryCount,recipeCount,upcomingMeals:meals.slice(0,5)});
}catch(e){next(e)}});
export default router;
