import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

export const register = async (req: Request, res: Response) => {
    const { email, name, password } = req.body

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            res.status(400).json({ message: 'Email already in use' })
            return
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                person: {
                    create: {
                        complete_name: name
                    }
                }
            },
            include: { person: true }
        })

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })

        res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name } })
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body

    try {
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' })
            return
        }

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
            res.status(401).json({ message: 'Invalid credentials' })
            return
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })

        res.status(200).json({ token, user: { id: user.id, email: user.email, name: user.name } })
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
}