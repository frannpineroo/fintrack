'use client'

import { useEffect, useState } from 'react'
import AppLayout from '../../components/AppLayout'
import api from '../../lib/api'
import Link from 'next/link'

interface Group {
    id: number
    name: string
    type: string
    description: string
    members: { id: number; person: { complete_name: string } }[]
}

export default function GroupsPage() {
    const [groups, setGroups] = useState<Group[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const res = await api.get('/groups')
                setGroups(res.data)
            } catch {
                console.error('Error al cargar grupos')
            } finally {
                setLoading(false)
            }
        }
        fetchGroups()
    }, [])

    return (
        <AppLayout>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Mis grupos</h2>
                <Link href="/groups/new" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Nuevo grupo
                </Link>
            </div>

            {loading ? (
                <p>Cargando...</p>
            ) : groups.length === 0 ? (
                <p className="text-gray-500">No tenés grupos todavía</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {groups.map((group) => (
                        <a href={`/groups/${group.id}`} key={group.id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition block">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-lg">{group.name}</h3>
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{group.type}</span>
                            </div>
                            {group.description && <p className="text-gray-500 text-sm mb-2">{group.description}</p>}
                            <p className="text-sm text-gray-400">{group.members.length} miembro{group.members.length !== 1 ? 's' : ''}</p>
                        </a>
                    ))}
                </div>
            )}
        </AppLayout>
    )
}