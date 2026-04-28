'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../lib/api'

interface Person {
    id: number
    complete_name: string
    gender: string | null
    birth_date: string | null
}

export default function ProfilePage() {
    const { user, logout } = useAuth()
    const [person, setPerson] = useState<Person | null>(null)
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState(false)
    const [form, setForm] = useState({
        complete_name: '',
        gender: '',
        birth_date: ''
    })

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/users/me')
                setPerson(res.data.person)
                setForm({
                    complete_name: res.data.person.complete_name || '',
                    gender: res.data.person.gender || '',
                    birth_date: res.data.person.birth_date ? res.data.person.birth_date.split('T')[0] : ''
                })
            } catch {
                console.error('Error al cargar perfil')
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await api.put('/users/person', form)
            setPerson(res.data)
            setEditing(false)
        } catch {
            console.error('Error al actualizar perfil')
        }
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">FinTrack</h1>
                <div className="flex items-center gap-4">
                    <a href="/dashboard" className="text-blue-500 hover:underline">Volver</a>
                    <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                        Cerrar sesión
                    </button>
                </div>
            </nav>

            <main className="max-w-2xl mx-auto p-6">
                <h2 className="text-xl font-semibold mb-4">Mi perfil</h2>

                {loading ? (
                    <p>Cargando...</p>
                ) : (
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="mb-4">
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{user?.email}</p>
                        </div>
                        <div className="mb-4">
                            <p className="text-sm text-gray-500">Nombre Usuario</p>
                            <p className="font-medium">{user?.username}</p>
                        </div>

                        {editing ? (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                                <div>
                                    <label className="text-sm text-gray-500">Nombre completo</label>
                                    <input
                                        type="text"
                                        value={form.complete_name}
                                        onChange={e => setForm({ ...form, complete_name: e.target.value })}
                                        className="border p-2 rounded w-full mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Género</label>
                                    <select
                                        value={form.gender}
                                        onChange={e => setForm({ ...form, gender: e.target.value })}
                                        className="border p-2 rounded w-full mt-1"
                                    >
                                        <option value="">Sin especificar</option>
                                        <option value="M">Masculino</option>
                                        <option value="F">Femenino</option>
                                        <option value="X">No binario</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Fecha de nacimiento</label>
                                    <input
                                        type="date"
                                        value={form.birth_date}
                                        onChange={e => setForm({ ...form, birth_date: e.target.value })}
                                        className="border p-2 rounded w-full mt-1"
                                    />
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                        Guardar
                                    </button>
                                    <button type="button" onClick={() => setEditing(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <div>
                                    <p className="text-sm text-gray-500">Nombre completo</p>
                                    <p className="font-medium">{person?.complete_name || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Género</p>
                                    <p className="font-medium">
                                        {person?.gender === 'M' ? 'Masculino' : person?.gender === 'F' ? 'Femenino' : person?.gender === 'X' ? 'No binario' : '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Fecha de nacimiento</p>
                                    <p className="font-medium">
                                        {person?.birth_date ? new Date(person.birth_date).toLocaleDateString('es-AR') : '-'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setEditing(true)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-fit mt-2"
                                >
                                    Editar perfil
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    )
}