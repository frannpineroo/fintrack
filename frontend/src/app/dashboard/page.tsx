'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../lib/api'
import AppLayout from '@/components/AppLayout'
import Link from 'next/link'

interface Group {
    id: number
    name: string
    type: string
    members: { id: number; person: { complete_name: string } }[]
}

interface Expense {
    id: number
    description: string
    amount: number
    currency: string
    category: string
    date: string
    payer: { complete_name: string }
    splits: { paid: boolean; amount: number; person: { complete_name: string } }[]
}

export default function DashboardPage() {
    const { user } = useAuth()
    const [groups, setGroups] = useState<Group[]>([])
    const [recentExpenses, setRecentExpenses] = useState<Expense[]>([])
    const [totalOwed, setTotalOwed] = useState(0)
    const [totalOwe, setTotalOwe] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const groupsRes = await api.get('/groups')
                const fetchedGroups = groupsRes.data
                setGroups(fetchedGroups.slice(0, 3))

                const allExpenses: Expense[] = []
                for (const group of fetchedGroups) {
                    const expRes = await api.get(`/expenses/group/${group.id}`)
                    allExpenses.push(...expRes.data)
                }

                allExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                setRecentExpenses(allExpenses.slice(0, 5))

                let owed = 0
                let owe = 0
                for (const expense of allExpenses) {
                    expense.splits.forEach(split => {
                        if (!split.paid) {
                            if (expense.payer.complete_name === user?.name) {
                                owed += Number(split.amount)
                            } else {
                                owe += Number(split.amount)
                            }
                        }
                    })
                }
                setTotalOwed(owed)
                setTotalOwe(owe)
            } catch {
                console.error('Error al cargar datos')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const categoryLabel: Record<string, string> = {
        FOOD: 'Comida',
        TRANSPORT: 'Transporte',
        ENTERTAINMENT: 'Entretenimiento',
        SERVICES: 'Servicios',
        HEALTH: 'Salud',
        EDUCATION: 'Educación',
        OTHER: 'Otro'
    }

    return (
        <AppLayout>
            <h2 className="text-xl font-semibold mb-6">Hola, {user?.name} </h2>

            {loading ? <p>Cargando...</p> : (
                <div className="flex flex-col gap-6">

                    {/* Balance */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-sm text-green-600 mb-1">Te deben</p>
                            <p className="text-2xl font-bold text-green-700">$ {totalOwed.toFixed(2)}</p>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-sm text-red-600 mb-1">Debés</p>
                            <p className="text-2xl font-bold text-red-700">$ {totalOwe.toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Actividad reciente */}
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold">Actividad reciente</h3>
                        </div>
                        {recentExpenses.length === 0 ? (
                            <p className="text-gray-500 text-sm">No hay gastos todavía</p>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {recentExpenses.map(expense => (
                                    <div key={expense.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                                        <div>
                                            <p className="font-medium text-sm">{expense.description}</p>
                                            <p className="text-xs text-gray-500">
                                                {categoryLabel[expense.category]} · Pagó {expense.payer.complete_name}
                                            </p>
                                        </div>
                                        <p className="font-semibold text-sm">{expense.currency} {Number(expense.amount).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Grupos recientes */}
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold">Grupos</h3>
                            <Link href="/groups" className="text-blue-500 text-sm hover:underline">Ver todos</Link>
                        </div>
                        {groups.length === 0 ? (
                            <p className="text-gray-500 text-sm">No tenés grupos todavía</p>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {groups.map(group => (
                                    <Link key={group.id} href={`/groups/${group.id}`} className="flex justify-between items-center p-2 rounded hover:bg-gray-50 transition">
                                        <p className="font-medium text-sm">{group.name}</p>
                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{group.members.length} miembros</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            )}
        </AppLayout>
    )
}