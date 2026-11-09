import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
export const hashToken = value => crypto.createHash('sha256').update(value).digest('hex');
export function signAccess(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_TTL || '15m'
  });
}
export function signRefresh(user, sessionId) {
  return jwt.sign({ sub: user._id.toString(), sid: sessionId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET, { expiresIn: `${Number(process.env.REFRESH_TOKEN_DAYS || 7)}d` });
}
