import { Router } from 'express'
import { getMe, updatePerson } from '../controllers/user.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()

router.get('/me', authMiddleware, getMe)
router.put('/person', authMiddleware, updatePerson)

export default router