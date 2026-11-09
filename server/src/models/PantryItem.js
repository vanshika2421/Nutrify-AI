import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true },
  quantity: { type: Number, default: 1, min: 0 },
  unit: { type: String, default: 'pcs' },
  category: { type: String, default: 'Other' },
  expiryDate: { type: String, default: '' }
}, { timestamps: true });
export default mongoose.model('PantryItem', schema);
