import { Response } from 'express'
import prisma from '../lib/prisma'
import { AuthRequest } from '../middlewares/auth.middleware'

export const getWallets = async (req: AuthRequest, res: Response) => {
    try {
        const person = await prisma.person.findUnique({ where: { user_id: req.userId } })
        if (!person) {
            res.status(404).json({ message: 'Person not found' })
            return
        }

        const wallets = await prisma.wallet.findMany({ where: { person_id: person.id } })
        res.status(200).json(wallets)
    } catch {
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const createWallet = async (req: AuthRequest, res: Response) => {
    const { name, bank, type, currency } = req.body

    try {
        const person = await prisma.person.findUnique({ where: { user_id: req.userId } })
        if (!person) {
            res.status(404).json({ message: 'Person not found' })
            return
        }

        const wallet = await prisma.wallet.create({
            data: { person_id: person.id, name, bank, type, currency }
        })
        res.status(201).json(wallet)
    } catch {
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const deleteWallet = async (req: AuthRequest, res: Response) => {
    const { walletId } = req.params

    try {
        await prisma.wallet.delete({ where: { id: Number(walletId) } })
        res.status(200).json({ message: 'Wallet deleted' })
    } catch {
        res.status(500).json({ message: 'Internal server error' })
    }
}