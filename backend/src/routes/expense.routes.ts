import { Router } from 'express'
import { createExpense, getGroupExpenses, markSplitAsPaid, getMyExpenses } from '../controllers/expense.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()

router.post('/', authMiddleware, createExpense);
router.get('/group/:groupId', authMiddleware, getGroupExpenses);
router.put('/splits/:splitId/paid', authMiddleware, markSplitAsPaid);
router.get('/me', authMiddleware, getMyExpenses);

export default router