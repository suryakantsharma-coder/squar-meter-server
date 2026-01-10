import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import { User } from '../models/user.model';
import { Session } from '../models/session.model';
import config from '../config';
import { Types } from 'mongoose';

export async function registerUser(email: string, password: string, name?: string) {
  const existing = await User.findOne({ email });
  if (existing) throw new Error('User already exists');

  const passwordHash = await argon2.hash(password);
  const user = await User.create({ email, passwordHash, name });
  return user;
}

export async function loginUser(email: string, password: string, ip?: string, ua?: string) {
  const user = await User.findOne({ email });
  console.log({ user });
  if (!user) throw new Error('Invalid credentials');

  const valid = await argon2.verify(user.passwordHash, password);
  console.log({ valid, password, s: user.passwordHash });
  if (!valid) throw new Error('Invalid credentials');

  // @ts-expect-error -- config.jwtSecret is a string
  const accessToken = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: config.accessExpire },
  );

  console.log({ accessToken });

  // @ts-expect-error -- config.jwtSecret is a string
  const refreshToken = jwt.sign({ id: user._id }, config.jwtSecret, {
    expiresIn: config.refreshExpire,
  });
  console.log({ refreshAccessToken });

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  console.log({
    userId: user._id,
    refreshToken,
    userAgent: ua,
    ip,
    expiresAt,
  });
  await Session.create({
    userId: user._id,
    refreshToken,
    userAgent: ua,
    ip,
    expiresAt,
  });

  return { accessToken, refreshToken, user };
}

export async function refreshAccessToken(refreshToken: string) {
  try {
    const payload = jwt.verify(refreshToken, config.jwtSecret) as any;
    const session = await Session.findOne({ userId: payload.id, refreshToken });
    if (!session) throw new Error('Invalid session');

    // @ts-expect-error -- config.jwtSecret is a string
    const newAccess = jwt.sign({ id: payload.id }, config.jwtSecret, {
      expiresIn: config.accessExpire,
    });

    return newAccess;
  } catch (err) {
    throw new Error('Invalid refresh token');
  }
}

export async function logoutUser(userId: Types.ObjectId, refreshToken: string) {
  await Session.deleteOne({ userId, refreshToken });
}
