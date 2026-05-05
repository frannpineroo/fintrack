'use client'

import { useEffect, useState } from 'react'
import AppLayout from '../../components/AppLayout'
import { useAuth } from '../../context/AuthContext'
import api from '../../lib/api'

interface Expense {
    id: number
    payer_id: number
    description: string
    amount: number
    currency: string
    category: string
    date: string
    group: { id: number; name: string }
    payer: { complete_name: string }
    splits: { id: number; paid: boolean; amount: number; person: { id: number; complete_name: string } }[]
}

export default function ExpensesPage() {
    const { user } = useAuth()
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('ALL')
    const [myPersonId, setMyPersonId] = useState<number | null>(null)

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const meRes = await api.get('/users/me')
                const personId = meRes.data.person.id
                setMyPersonId(personId)

                const res = await api.get('/expenses/me')
                setExpenses(res.data)
            } catch {
                console.error('Error al cargar gastos')
            } finally {
                setLoading(false)
            }
        }
        fetchAll()
    }, [])

    const handleMarkPaid = async (splitId: number) => {
        try {
            await api.put(`/expenses/splits/${splitId}/paid`)
            const res = await api.get('/expenses/me')
            setExpenses(res.data)
        } catch {
            console.error('Error al marcar como pagado')
        }
    }

    const categoryLabel: Record<string, string> = {
        FOOD: 'Comida',
        TRANSPORT: 'Transporte',
        ENTERTAINMENT: 'Entretenimiento',
        SERVICES: 'Servicios',
        HEALTH: 'Salud',
        EDUCATION: 'Educación',
        OTHER: 'Otro'
    }

    const filteredExpenses = expenses.filter(expense => {
        if (filter === 'ALL') return true
        if (filter === 'PAID_BY_ME') return expense.payer_id === myPersonId
        if (filter === 'OWE') return expense.payer_id !== myPersonId
        return true
    })

    const totalOwed = expenses
        .filter(e => e.payer_id === myPersonId)
        .flatMap(e => e.splits.filter(s => !s.paid && s.person.id !== myPersonId))
        .reduce((acc, s) => acc + Number(s.amount), 0)

    const totalOwe = expenses
        .filter(e => e.payer_id !== myPersonId)
        .flatMap(e => e.splits.filter(s => !s.paid && s.person.id === myPersonId))
        .reduce((acc, s) => acc + Number(s.amount), 0)

    return (
        <AppLayout>
            <h2 className="text-xl font-semibold mb-6">Mis gastos</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-600 mb-1">Te deben</p>
                    <p className="text-2xl font-bold text-green-700">$ {totalOwed.toFixed(2)}</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-600 mb-1">Debés</p>
                    <p className="text-2xl font-bold text-red-700">$ {totalOwe.toFixed(2)}</p>
                </div>
            </div>

            <div className="flex gap-2 mb-4">
                {[
                    { value: 'ALL', label: 'Todos' },
                    { value: 'PAID_BY_ME', label: 'Pagué yo' },
                    { value: 'OWE', label: 'Debo' }
                ].map(f => (
                    <button
                        key={f.value}
                        onClick={() => setFilter(f.value)}
                        className={`px-4 py-2 rounded text-sm ${filter === f.value ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <p>Cargando...</p>
            ) : filteredExpenses.length === 0 ? (
                <p className="text-gray-500">No hay gastos</p>
            ) : (
                <div className="flex flex-col gap-4">
                    {filteredExpenses.map(expense => (
                        <div key={expense.id} className="bg-white rounded-lg shadow p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-semibold">{expense.description}</h3>
                                    <p className="text-xs text-gray-500">
                                        {categoryLabel[expense.category]} · {expense.group.name} · {new Date(expense.date).toLocaleDateString('es-AR')}
                                    </p>
                                    <p className="text-xs text-gray-500">Pagó: {expense.payer.complete_name}</p>
                                </div>
                                <p className="font-bold">{expense.currency} {Number(expense.amount).toFixed(2)}</p>
                            </div>
                            <div className="border-t pt-2 flex flex-col gap-1">
                                {expense.splits.map(split => (
                                    <div key={split.id} className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">{split.person.complete_name}</span>
                                        <div className="flex items-center gap-2">
                                            {split.paid ? (
                                                <span className="text-green-500">Pagado</span>
                                            ) : (
                                                <>
                                                    <span className="text-red-500">Debe: {expense.currency} {Number(split.amount).toFixed(2)}</span>
                                                    {expense.payer_id === myPersonId && (
                                                        <button
                                                            onClick={() => handleMarkPaid(split.id)}
                                                            className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                                                        >
                                                            Marcar pagado
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AppLayout>
    )
}