import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
  title: { type: String, required: true, trim: true },
  date: { type: String, required: true, index: true },
  slot: { type: String, enum: ['breakfast','lunch','dinner','snack'], required: true },
  servings: { type: Number, default: 1, min: 0.25, max: 20 },
  nutrition: { calories:Number, protein:Number, carbs:Number, fat:Number },
  completed: { type: Boolean, default: false }
}, { timestamps: true });
schema.index({ user: 1, date: 1, slot: 1 });
export default mongoose.model('Meal', schema);
