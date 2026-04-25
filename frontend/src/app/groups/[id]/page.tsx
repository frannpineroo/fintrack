'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import api from '../../../lib/api'

interface Split {
    id: number
    person_id: number
    amount: number
    paid: boolean
    person: { complete_name: string }
}

interface Expense {
    id: number
    description: string
    amount: number
    currency: string
    category: string
    date: string
    payer: { complete_name: string }
    splits: Split[]
}

export default function GroupPage() {
    const { id } = useParams()
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({
        description: '',
        amount: '',
        currency: 'ARS',
        category: 'FOOD',
        date: '',
        splits: [{ person_id: '', amount: '' }]
    })

    const fetchExpenses = async () => {
        try {
            const res = await api.get(`/expenses/group/${id}`)
            setExpenses(res.data)
        } catch {
            console.error('Error al cargar gastos')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchExpenses()
    }, [id])

    const handleAddSplit = () => {
        setForm({ ...form, splits: [...form.splits, { person_id: '', amount: '' }] })
    }

    const handleSplitChange = (index: number, field: string, value: string) => {
        const newSplits = [...form.splits]
        newSplits[index] = { ...newSplits[index], [field]: value }
        setForm({ ...form, splits: newSplits })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await api.post('/expenses', {
                group_id: id,
                amount: Number(form.amount),
                currency: form.currency,
                category: form.category,
                description: form.description,
                date: form.date,
                splits: form.splits.map(s => ({
                    person_id: Number(s.person_id),
                    amount: Number(s.amount)
                }))
            })
            setShowForm(false)
            setForm({
                description: '',
                amount: '',
                currency: 'ARS',
                category: 'FOOD',
                date: '',
                splits: [{ person_id: '', amount: '' }]
            })
            fetchExpenses()
        } catch {
            console.error('Error al crear gasto')
        }
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">FinTrack</h1>
                <a href="/dashboard" className="text-blue-500 hover:underline">Volver</a>
            </nav>

            <main className="max-w-4xl mx-auto p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Gastos del grupo</h2>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        {showForm ? 'Cancelar' : 'Agregar gasto'}
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 mb-6 flex flex-col gap-3">
                        <input
                            type="text"
                            placeholder="Descripción"
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            className="border p-2 rounded"
                        />
                        <input
                            type="number"
                            placeholder="Monto total"
                            value={form.amount}
                            onChange={e => setForm({ ...form, amount: e.target.value })}
                            className="border p-2 rounded"
                        />
                        <select
                            value={form.currency}
                            onChange={e => setForm({ ...form, currency: e.target.value })}
                            className="border p-2 rounded"
                        >
                            <option value="ARS">ARS</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                        </select>
                        <select
                            value={form.category}
                            onChange={e => setForm({ ...form, category: e.target.value })}
                            className="border p-2 rounded"
                        >
                            <option value="FOOD">Comida</option>
                            <option value="TRANSPORT">Transporte</option>
                            <option value="ENTERTAINMENT">Entretenimiento</option>
                            <option value="SERVICES">Servicios</option>
                            <option value="HEALTH">Salud</option>
                            <option value="EDUCATION">Educación</option>
                            <option value="OTHER">Otro</option>
                        </select>
                        <input
                            type="date"
                            value={form.date}
                            onChange={e => setForm({ ...form, date: e.target.value })}
                            className="border p-2 rounded"
                        />
                        <div>
                            <p className="font-medium mb-2">Splits</p>
                            {form.splits.map((split, i) => (
                                <div key={i} className="flex gap-2 mb-2">
                                    <input
                                        type="number"
                                        placeholder="Person ID"
                                        value={split.person_id}
                                        onChange={e => handleSplitChange(i, 'person_id', e.target.value)}
                                        className="border p-2 rounded w-1/2"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Monto"
                                        value={split.amount}
                                        onChange={e => handleSplitChange(i, 'amount', e.target.value)}
                                        className="border p-2 rounded w-1/2"
                                    />
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddSplit}
                                className="text-blue-500 text-sm hover:underline"
                            >
                                + Agregar persona
                            </button>
                        </div>
                        <button type="submit" className="bg-green-500 text-white p-2 rounded hover:bg-green-600">
                            Guardar gasto
                        </button>
                    </form>
                )}

                {loading ? (
                    <p>Cargando...</p>
                ) : expenses.length === 0 ? (
                    <p className="text-gray-500">No hay gastos todavía</p>
                ) : (
                    <div className="flex flex-col gap-4">
                        {expenses.map(expense => (
                            <div key={expense.id} className="bg-white rounded-lg shadow p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-semibold">{expense.description}</h3>
                                        <p className="text-sm text-gray-500">Pagó: {expense.payer.complete_name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">{expense.currency} {expense.amount}</p>
                                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                            {expense.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-2 border-t pt-2">
                                    {expense.splits.map(split => (
                                        <div key={split.id} className="flex justify-between text-sm text-gray-600">
                                            <span>{split.person.complete_name}</span>
                                            <span className={split.paid ? 'text-green-500' : 'text-red-500'}>
                                                {split.paid ? 'Pagado' : `Debe: ${split.amount}`}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}