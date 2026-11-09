import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true },
  date: { type: String, required: true, index: true },
  mealType: { type: String, enum: ['breakfast','lunch','dinner','snack'], default: 'snack' },
  servings: { type: Number, default: 1 },
  nutrition: { calories:{type:Number,default:0}, protein:{type:Number,default:0}, carbs:{type:Number,default:0}, fat:{type:Number,default:0}, fiber:{type:Number,default:0} }
}, { timestamps: true });
export default mongoose.model('DiaryEntry', schema);
