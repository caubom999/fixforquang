import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.schema';

const JWT_SECRET = process.env.JWT_SECRET || 'Quang2001';

export const register = async (req: Request, res: Response) => {
    const { username, email, password} = req.body;

    if (!username || !email || !password  ) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            createdAt: new Date,
            updateAt: new Date
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Register error:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: 'Lỗi server', error: error.message });
        } else {
            res.status(500).json({ message: 'Lỗi server', error: 'Unknown error' });
        }
    }
};

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

         const token = jwt.sign({ email: user.email }, 'secret', {expiresIn: '1h'});

        res.json({ token });
    } catch (error) {
        console.error('Login error:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        } else {
            res.status(500).json({ message: 'Server error', error: 'Unknown error' });
        }
    }
};

export const profile = async (req: any, res: any) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ username: user.username, email: user.email });
    } catch (error) {
        res.status(400).json({ error: 'Internal server error' });
    }
};

