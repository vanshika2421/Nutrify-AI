import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date: { type: String, required: true, index: true },
  amountMl: { type: Number, min: 1, max: 5000, required: true }
}, { timestamps: true });
export default mongoose.model('WaterLog', schema);
