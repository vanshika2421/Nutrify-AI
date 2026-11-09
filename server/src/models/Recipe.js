import mongoose from 'mongoose';
const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  quantity: { type: Number, default: 1, min: 0 },
  unit: { type: String, default: 'serving' }
}, { _id: false });
const schema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, default: '', maxlength: 500 },
  image: { type: String, default: '' },
  cuisine: { type: String, default: 'Everyday' },
  diet: { type: String, default: 'anything' },
  mealType: { type: String, enum: ['breakfast','lunch','dinner','snack'], default: 'lunch' },
  prepMinutes: { type: Number, default: 20, min: 1, max: 600 },
  servings: { type: Number, default: 2, min: 1, max: 30 },
  difficulty: { type: String, enum: ['Easy','Medium','Hard'], default: 'Easy' },
  ingredients: [ingredientSchema],
  instructions: [{ type: String }],
  nutrition: { calories: {type:Number,default:0}, protein:{type:Number,default:0}, carbs:{type:Number,default:0}, fat:{type:Number,default:0}, fiber:{type:Number,default:0} },
  tags: [{ type: String }]
}, { timestamps: true });
schema.index({ title: 'text', description: 'text', tags: 'text' });
export default mongoose.model('Recipe', schema);
