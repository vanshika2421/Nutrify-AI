import { Router } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User from '../models/User.js';
import RefreshSession from '../models/RefreshSession.js';
import { signAccess, signRefresh, hashToken } from '../utils/tokens.js';
import { requireAuth } from '../middleware/auth.js';
const router = Router();
const cookieOptions = () => ({ httpOnly:true, secure:process.env.COOKIE_SECURE==='true', sameSite:'lax', path:'/api/auth', maxAge:Number(process.env.REFRESH_TOKEN_DAYS||7)*86400000 });
const registerSchema = z.object({ name:z.string().trim().min(2).max(80), email:z.string().email(), password:z.string().min(8).max(100) });
async function issueSession(user,res) {
  const sid = crypto.randomUUID();
  const refresh = signRefresh(user,sid);
  await RefreshSession.create({ user:user._id, tokenHash:hashToken(refresh), expiresAt:new Date(Date.now()+Number(process.env.REFRESH_TOKEN_DAYS||7)*86400000) });
  res.cookie('nutrify_refresh',refresh,cookieOptions());
  return signAccess(user);
}
router.post('/register', async (req,res,next)=>{ try {
  const parsed=registerSchema.safeParse(req.body); if(!parsed.success) return res.status(400).json({message:'Please check your details',errors:parsed.error.flatten()});
  const {name,email,password}=parsed.data;
  if(await User.exists({email:email.toLowerCase()})) return res.status(409).json({message:'Email already registered'});
  const user=await User.create({name,email:email.toLowerCase(),passwordHash:await bcrypt.hash(password,12),profile:{displayName:name}});
  const accessToken=await issueSession(user,res);
  res.status(201).json({accessToken,user:{id:user._id,name:user.name,email:user.email,profile:user.profile}});
} catch(e){next(e)} });
router.post('/login', async (req,res,next)=>{ try {
  const {email,password}=req.body||{};
  if(typeof email!=='string'||typeof password!=='string') return res.status(400).json({message:'Email and password are required'});
  const user=await User.findOne({email:email.toLowerCase()}).select('+passwordHash');
  if(!user||!(await bcrypt.compare(password,user.passwordHash))) return res.status(401).json({message:'Invalid email or password'});
  const accessToken=await issueSession(user,res);
  res.json({accessToken,user:{id:user._id,name:user.name,email:user.email,profile:user.profile}});
} catch(e){next(e)} });
router.post('/refresh', async(req,res)=>{ try {
  const token=req.cookies.nutrify_refresh; if(!token) return res.status(401).json({message:'Refresh session missing'});
  const payload=jwt.verify(token,process.env.JWT_REFRESH_SECRET);
  const session=await RefreshSession.findOne({user:payload.sub,tokenHash:hashToken(token),expiresAt:{$gt:new Date()}});
  if(!session) return res.status(401).json({message:'Refresh session expired or revoked'});
  await session.deleteOne();
  const user=await User.findById(payload.sub); if(!user) return res.status(401).json({message:'Account not found'});
  const accessToken=await issueSession(user,res);
  res.json({accessToken,user:{id:user._id,name:user.name,email:user.email,profile:user.profile}});
 } catch {res.status(401).json({message:'Unable to refresh session'})} });
router.post('/logout', async(req,res)=>{ const token=req.cookies.nutrify_refresh; if(token) await RefreshSession.deleteOne({tokenHash:hashToken(token)}); res.clearCookie('nutrify_refresh',{...cookieOptions(),maxAge:undefined}); res.json({message:'Signed out'}); });
router.get('/me',requireAuth,(req,res)=>res.json({user:{id:req.user._id,name:req.user.name,email:req.user.email,role:req.user.role,profile:req.user.profile}}));
export default router;
