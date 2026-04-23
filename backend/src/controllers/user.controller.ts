import { Response } from 'express'
import prisma from '../lib/prisma'
import { AuthRequest } from '../middlewares/auth.middleware'

export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            include: { person: true }
        })
        res.status(200).json(user)
    } catch {
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const updatePerson = async (req: AuthRequest, res: Response) => {
    const { complete_name, gender, birth_date } = req.body

    try {
        const person = await prisma.person.update({
            where: { user_id: req.userId },
            data: { complete_name, gender, birth_date: birth_date ? new Date(birth_date) : undefined }
        })
        res.status(200).json(person)
    } catch {
        res.status(500).json({ message: 'Internal server error' })
    }
}