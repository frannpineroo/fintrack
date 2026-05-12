import { Response } from 'express'
import prisma from '../lib/prisma'
import { AuthRequest } from '../middlewares/auth.middleware'

export const searchUsers = async (req: AuthRequest, res: Response) => {
    const username = req.query.username as string

    try {
        const users = await prisma.user.findMany({
            where: {
                username: { contains: username, mode: 'insensitive' },
                NOT: { id: req.userId }
            },
            select: {
                id: true,
                username: true,
                name: true,
                person: { select: { id: true, complete_name: true } }
            }
        })
        res.status(200).json(users)
    } catch (error) {
        console.error('Error en searchUsers:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const getContacts = async (req: AuthRequest, res: Response) => {
    try {
        const person = await prisma.person.findUnique({ where: { user_id: req.userId } })
        if (!person) {
            res.status(404).json({ message: 'Person not found' })
            return
        }

        const contacts = await prisma.contact.findMany({
            where: { person_id: person.id },
            include: {
                contact: {
                    include: { user: { select: { id: true, username: true, name: true } } }
                }
            }
        })
        res.status(200).json(contacts)
    } catch (error) {
        console.error('Error en getContacts:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const sendContactRequest = async (req: AuthRequest, res: Response) => {
    const { contactPersonId } = req.body

    try {
        const person = await prisma.person.findUnique({ where: { user_id: req.userId } })
        if (!person) {
            res.status(404).json({ message: 'Person not found' })
            return
        }

        const existing = await prisma.contactRequest.findUnique({
            where: { sender_id_receiver_id: { sender_id: person.id, receiver_id: contactPersonId } }
        })
        if (existing) {
            res.status(400).json({ message: 'Request already sent' })
            return
        }

        const alreadyContact = await prisma.contact.findUnique({
            where: { person_id_contact_id: { person_id: person.id, contact_id: contactPersonId } }
        })
        if (alreadyContact) {
            res.status(400).json({ message: 'Already a contact' })
            return
        }

        const request = await prisma.contactRequest.create({
            data: { sender_id: person.id, receiver_id: contactPersonId }
        })
        res.status(201).json(request)
    } catch (error) {
        console.error('Error en sendContactRequest:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const getContactRequests = async (req: AuthRequest, res: Response) => {
    try {
        const person = await prisma.person.findUnique({ where: { user_id: req.userId } })
        if (!person) {
            res.status(404).json({ message: 'Person not found' })
            return
        }

        const requests = await prisma.contactRequest.findMany({
            where: { receiver_id: person.id, status: 'PENDING' },
            include: {
                sender: {
                    include: { user: { select: { id: true, username: true, name: true } } }
                }
            }
        })
        res.status(200).json(requests)
    } catch (error) {
        console.error('Error en getContactRequests:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const respondContactRequest = async (req: AuthRequest, res: Response) => {
    const { requestId } = req.params
    const { accept } = req.body

    try {
        const request = await prisma.contactRequest.update({
            where: { id: Number(requestId) },
            data: { status: accept ? 'ACCEPTED' : 'REJECTED' }
        })

        if (accept) {
            await prisma.contact.createMany({
                data: [
                    { person_id: request.sender_id, contact_id: request.receiver_id },
                    { person_id: request.receiver_id, contact_id: request.sender_id }
                ]
            })
        }

        res.status(200).json(request)
    } catch (error) {
        console.error('Error en respondContactRequest:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const removeContact = async (req: AuthRequest, res: Response) => {
    const { contactId } = req.params

    try {
        await prisma.contact.delete({ where: { id: Number(contactId) } })
        res.status(200).json({ message: 'Contact removed' })
    } catch (error) {
        console.error('Error en removeContact:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}