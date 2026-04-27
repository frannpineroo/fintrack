import { Router } from 'express'
import { getWallets, createWallet, deleteWallet } from '../controllers/wallet.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()

router.get('/', authMiddleware, getWallets)
router.post('/', authMiddleware, createWallet)
router.delete('/:walletId', authMiddleware, deleteWallet)

export default router