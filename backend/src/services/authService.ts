import { User } from '../models/User';
import { AppError } from '../utils/AppError';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'supersecretkey', {
    expiresIn: '7d',
  });
};

export const authService = {
  async register(data: any) {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new AppError('Email already in use', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const user = await User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    const token = generateToken(user._id.toString());
    return {
      user: { id: user._id, name: user.name, email: user.email },
      token,
    };
  },

  async login(data: any) {
    const user = await User.findOne({ email: data.email });
    if (!user || !user.password) {
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = generateToken(user._id.toString());
    return {
      user: { id: user._id, name: user.name, email: user.email },
      token,
    };
  },
};
