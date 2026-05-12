import { Router } from 'express'
import { searchUsers, getContacts, sendContactRequest, getContactRequests, respondContactRequest, removeContact } from '../controllers/contact.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()

router.get('/search', authMiddleware, searchUsers)
router.get('/', authMiddleware, getContacts)
router.post('/', authMiddleware, sendContactRequest)
router.get('/requests', authMiddleware, getContactRequests)
router.put('/requests/:requestId', authMiddleware, respondContactRequest)
router.delete('/:contactId', authMiddleware, removeContact)

export default router