import { Response } from 'express'
import prisma from '../lib/prisma'
import { AuthRequest } from '../middlewares/auth.middleware'

export const createExpense = async (req: AuthRequest, res: Response) => {
    const { group_id, amount, currency, category, description, date, splits } = req.body

    try {
        const person = await prisma.person.findUnique({ where: { user_id: req.userId } })
        if (!person) {
            res.status(404).json({ message: 'Persona no encontrada' })
            return
        }

        const expense = await prisma.expense.create({
            data: {
                group_id: Number(group_id),
                payer_id: person.id,
                amount,
                currency,
                category,
                description,
                date: date ? new Date(date) : new Date(),
                splits: {
                    create: splits.map((s: { person_id: number, amount: number }) => ({
                        person_id: s.person_id,
                        amount: s.amount
                    }))
                }
            },
            include: { splits: true }
        })

        res.status(201).json(expense)
    } catch {
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const getGroupExpenses = async (req: AuthRequest, res: Response) => {
    const { groupId } = req.params

    try {
        const expenses = await prisma.expense.findMany({
            where: { group_id: Number(groupId) },
            include: {
                payer: true,
                splits: { include: { person: true } }
            },
            orderBy: { date: 'desc' }
        })

        res.status(200).json(expenses)
    } catch {
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const markSplitAsPaid = async (req: AuthRequest, res: Response) => {
    const { splitId } = req.params

    try {
        const split = await prisma.expenseSplit.update({
            where: { id: Number(splitId) },
            data: { paid: true }
        })

        res.status(200).json(split)
    } catch {
        res.status(500).json({ message: 'Internal server error' })
    }
}