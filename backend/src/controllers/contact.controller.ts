import { Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

export const searchUsers = async (req: AuthRequest, res: Response) => {
    const username = req.query;

    try {
        const users = await prisma.user.findMany({
            where: {
                username: { contains: String(username), mode: 'insensitive' },
                NOT: { id: req.userId }
            },
            select: {
                id: true,
                username: true,
                name: true,
                person: {
                    select: { id: true, complete_name: true }
                }
            }
        })
        res.status(200).json(users);
    } catch {
        res.status(500).json({ message: 'Internal server error' });
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
    } catch {
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

        const existing = await prisma.contact.findUnique({
            where: { person_id_contact_id: { person_id: person.id, contact_id: contactPersonId } }
        })
        if (existing) {
            res.status(400).json({ message: 'Already a contact' })
            return
        }

        const contact = await prisma.contact.create({
            data: { person_id: person.id, contact_id: contactPersonId }
        })
        res.status(201).json(contact)
    } catch {
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const removeContact = async (req: AuthRequest, res: Response) => {
    const { contactId } = req.params

    try {
        await prisma.contact.delete({ where: { id: Number(contactId) } })
        res.status(200).json({ message: 'Contact removed' })
    } catch {
        res.status(500).json({ message: 'Internal server error' })
    }
}