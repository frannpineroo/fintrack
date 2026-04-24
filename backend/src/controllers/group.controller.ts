import { Response } from "express";
import prisma from '../lib/prisma';
import { AuthRequest } from "../middlewares/auth.middleware";

export const createGroup = async (req: AuthRequest, res: Response) => {
    const { name, description, type } = req.body;

    try {
        const person = await prisma.person.findUnique({ where: { user_id: req.userId } });
        if (!person) {
            res.status(404).json({ message: "Persona no encontrada" });
            return;
        }

        const group = await prisma.group.create({
            data: {
                name,
                description,
                type,
                creator_id: person.id,
                members: {
                    create: { person_id: person.id }
                }
            },
            include: { members: true }
        });

        res.status(201).json(group);
    } catch {
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const getMyGroups = async (req: AuthRequest, res: Response) => {
    try {
        const person = await prisma.person.findUnique({ where: { user_id: req.userId } })
        if (!person) {
            res.status(404).json({ message: 'Person not found' })
            return
        }

        const groups = await prisma.group.findMany({
            where: { members: { some: { person_id: person.id } } },
            include: { members: { include: { person: true } } }
        })

        res.status(200).json(groups)
    } catch {
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const addMember = async (req: AuthRequest, res: Response) => {
    const { groupId } = req.params
    const { person_id } = req.body

    try {
        const member = await prisma.groupMember.create({
            data: {
                group_id: Number(groupId),
                person_id: Number(person_id)
            }
        })

        res.status(201).json(member)
    } catch {
        res.status(500).json({ message: 'Internal server error' })
    }
}