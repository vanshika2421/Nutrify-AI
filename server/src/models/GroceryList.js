import mongoose from 'mongoose';
const item = new mongoose.Schema({ name:String, quantity:{type:Number,default:1}, unit:{type:String,default:'pcs'}, checked:{type:Boolean,default:false} });
const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, default: 'Weekly groceries' },
  weekOf: { type: String, default: '' },
  items: [item]
}, { timestamps: true });
export default mongoose.model('GroceryList', schema);
