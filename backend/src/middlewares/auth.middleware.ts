import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

export interface AuthRequest extends Request {
    userId?: number
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
        res.status(401).json({ message: 'No token provided' })
        return
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number }
        req.userId = decoded.userId
        next()
    } catch {
        res.status(401).json({ message: 'Invalid token' })
    }
}