import mongoose from 'mongoose';
const profileSchema = new mongoose.Schema({
  displayName: { type: String, trim: true, maxlength: 60, default: '' },
  age: { type: Number, min: 13, max: 110 },
  heightCm: { type: Number, min: 80, max: 250 },
  weightKg: { type: Number, min: 20, max: 400 },
  activityLevel: { type: String, enum: ['sedentary','light','moderate','active','very_active'], default: 'moderate' },
  goal: { type: String, enum: ['maintain','lose','gain','build_muscle'], default: 'maintain' },
  diet: { type: String, enum: ['anything','vegetarian','vegan','eggetarian','pescatarian'], default: 'anything' },
  allergies: [{ type: String, trim: true }],
  dailyCalories: { type: Number, min: 800, max: 6000, default: 2000 },
  proteinGoal: { type: Number, min: 0, max: 500, default: 100 },
  carbsGoal: { type: Number, min: 0, max: 800, default: 250 },
  fatGoal: { type: Number, min: 0, max: 300, default: 65 },
  waterGoalMl: { type: Number, min: 250, max: 10000, default: 2500 },
  weeklyBudget: { type: Number, min: 0, default: 1500 },
  currency: { type: String, default: 'INR' }
}, { _id: false });
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['user','admin'], default: 'user' },
  profile: { type: profileSchema, default: () => ({}) },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }]
}, { timestamps: true });
export default mongoose.model('User', userSchema);
