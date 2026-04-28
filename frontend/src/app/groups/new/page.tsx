'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '../../../lib/api'

export default function NewGroupPage() {
    const router = useRouter()
    const [form, setForm] = useState({
        name: '',
        description: '',
        type: 'FRIENDS'
    })
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await api.post('/groups', form)
            router.push(`/groups/${res.data.id}`)
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al crear grupo')
        }
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">FinTrack</h1>
                <a href="/dashboard" className="text-blue-500 hover:underline">Volver</a>
            </nav>

            <main className="max-w-2xl mx-auto p-6">
                <h2 className="text-xl font-semibold mb-4">Crear nuevo grupo</h2>

                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 flex flex-col gap-4">
                    <div>
                        <label className="text-sm text-gray-500">Nombre del grupo</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            className="border p-2 rounded w-full mt-1"
                            placeholder="Ej: Viaje a Bariloche"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-500">Descripción (opcional)</label>
                        <textarea
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            className="border p-2 rounded w-full mt-1"
                            placeholder="Ej: Gastos del viaje de fin de año"
                            rows={3}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-500">Tipo de grupo</label>
                        <select
                            value={form.type}
                            onChange={e => setForm({ ...form, type: e.target.value })}
                            className="border p-2 rounded w-full mt-1"
                        >
                            <option value="FRIENDS">Amigos</option>
                            <option value="FAMILY">Familia</option>
                            <option value="COUPLE">Pareja</option>
                            <option value="WORK">Trabajo</option>
                        </select>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                        Crear grupo
                    </button>
                </form>
            </main>
        </div>
    )
}