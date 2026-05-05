import { Router } from 'express'
import { createExpense, getGroupExpenses, markSplitAsPaid, getMyExpenses } from '../controllers/expense.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()

router.get('/me', authMiddleware, getMyExpenses);
router.get('/group/:groupId', authMiddleware, getGroupExpenses);
router.post('/', authMiddleware, createExpense);
router.put('/splits/:splitId/paid', authMiddleware, markSplitAsPaid);

export default router