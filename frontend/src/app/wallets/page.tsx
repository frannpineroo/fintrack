'use client'

import { useEffect, useState } from 'react'
import api from '../../lib/api'
import AppLayout from '@/components/AppLayout'

interface Wallet {
    id: number
    name: string
    bank: string | null
    type: string
    currency: string
}

export default function WalletsPage() {
    const [wallets, setWallets] = useState<Wallet[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({
        name: '',
        bank: '',
        type: 'CASH',
        currency: 'ARS'
    })

    const fetchWallets = async () => {
        try {
            const res = await api.get('/wallets')
            setWallets(res.data)
        } catch {
            console.error('Error al cargar wallets')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchWallets()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await api.post('/wallets', form)
            setShowForm(false)
            setForm({ name: '', bank: '', type: 'CASH', currency: 'ARS' })
            fetchWallets()
        } catch {
            console.error('Error al crear wallet')
        }
    }

    const handleDelete = async (walletId: number) => {
        try {
            await api.delete(`/wallets/${walletId}`)
            fetchWallets()
        } catch {
            console.error('Error al eliminar wallet')
        }
    }

    const typeLabel: Record<string, string> = {
        CASH: 'Efectivo',
        CHECKING_ACCOUNT: 'Cuenta corriente',
        SAVINGS_ACCOUNT: 'Caja de ahorro',
        CREDIT_CARD: 'Tarjeta de crédito'
    }

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-100">
                <main className="max-w-2xl mx-auto p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Mis wallets</h2>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            {showForm ? 'Cancelar' : 'Agregar wallet'}
                        </button>
                    </div>

                    {showForm && (
                        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 mb-6 flex flex-col gap-3">
                            <input
                                type="text"
                                placeholder="Nombre (ej: Santander débito)"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                className="border p-2 rounded"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Banco (opcional)"
                                value={form.bank}
                                onChange={e => setForm({ ...form, bank: e.target.value })}
                                className="border p-2 rounded"
                            />
                            <select
                                value={form.type}
                                onChange={e => setForm({ ...form, type: e.target.value })}
                                className="border p-2 rounded"
                            >
                                <option value="CASH">Efectivo</option>
                                <option value="CHECKING_ACCOUNT">Cuenta corriente</option>
                                <option value="SAVINGS_ACCOUNT">Caja de ahorro</option>
                                <option value="CREDIT_CARD">Tarjeta de crédito</option>
                            </select>
                            <select
                                value={form.currency}
                                onChange={e => setForm({ ...form, currency: e.target.value })}
                                className="border p-2 rounded"
                            >
                                <option value="ARS">ARS</option>
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                            </select>
                            <button type="submit" className="bg-green-500 text-white p-2 rounded hover:bg-green-600">
                                Guardar
                            </button>
                        </form>
                    )}

                    {loading ? (
                        <p>Cargando...</p>
                    ) : wallets.length === 0 ? (
                        <p className="text-gray-500">No tenés wallets todavía</p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {wallets.map(wallet => (
                                <div key={wallet.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-semibold">{wallet.name}</h3>
                                        <p className="text-sm text-gray-500">
                                            {typeLabel[wallet.type]} {wallet.bank ? `· ${wallet.bank}` : ''}
                                        </p>
                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                            {wallet.currency}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(wallet.id)}
                                        className="text-red-500 hover:text-red-700 text-sm"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </AppLayout>

    )
}