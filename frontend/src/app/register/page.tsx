'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '../../lib/api'

export default function RegisterPage() {
    const router = useRouter()
    const [form, setForm] = useState({
        name: '',
        username: '',
        email: '',
        password: ''
    })
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await api.post('/auth/register', form)
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('user', JSON.stringify(res.data.user))
            router.push('/dashboard')
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al registrarse')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Crear cuenta</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Username"
                        value={form.username}
                        onChange={e => setForm({ ...form, username: e.target.value })}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                        className="border p-2 rounded"
                        required
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                        Registrarse
                    </button>
                    <p className="text-center text-sm text-gray-500">
                        ¿Ya tenés cuenta?{' '}
                        <a href="/login" className="text-blue-500 hover:underline">Iniciá sesión</a>
                    </p>
                </form>
            </div>
        </div>
    )
}