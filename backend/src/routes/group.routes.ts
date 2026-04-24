import { Router } from 'express'
import { createGroup, getMyGroups, addMember } from '../controllers/group.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()

router.post('/', authMiddleware, createGroup)
router.get('/', authMiddleware, getMyGroups)
router.post('/:groupId/members', authMiddleware, addMember)

export default router