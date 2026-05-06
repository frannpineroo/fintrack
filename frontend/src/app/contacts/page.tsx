'use client'

import { useEffect, useState } from 'react'
import AppLayout from '../../components/AppLayout'
import api from '../../lib/api'

interface UserResult {
    id: number
    username: string
    name: string
    person: { id: number; complete_name: string }
}

interface Contact {
    id: number
    contact: {
        id: number
        complete_name: string
        user: { id: number; username: string; name: string }
    }
}

export default function ContactsPage() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<UserResult[]>([])
    const [contacts, setContacts] = useState<Contact[]>([])
    const [searching, setSearching] = useState(false)

    const fetchContacts = async () => {
        try {
            const res = await api.get('/contacts')
            setContacts(res.data)
        } catch {
            console.error('Error al cargar contactos')
        }
    }

    useEffect(() => {
        fetchContacts()
    }, [])

    useEffect(() => {
        if (query.length < 3) {
            setResults([])
            return
        }

        const timeout = setTimeout(async () => {
            setSearching(true)
            try {
                const res = await api.get(`/contacts/search?username=${query}`)
                setResults(res.data)
            } catch {
                console.error('Error al buscar usuarios')
            } finally {
                setSearching(false)
            }
        }, 400)

        return () => clearTimeout(timeout)
    }, [query])

    const handleAdd = async (personId: number) => {
        try {
            await api.post('/contacts', { contactPersonId: personId })
            fetchContacts()
            setResults(prev => prev.filter(u => u.person.id !== personId))
        } catch {
            console.error('Error al agregar contacto')
        }
    }

    const handleRemove = async (contactId: number) => {
        try {
            await api.delete(`/contacts/${contactId}`)
            fetchContacts()
        } catch {
            console.error('Error al eliminar contacto')
        }
    }

    const contactPersonIds = contacts.map(c => c.contact.id)

    return (
        <AppLayout>
            <h2 className="text-xl font-semibold mb-6">Contactos</h2>

            {/* Buscador */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <input
                    type="text"
                    placeholder="Buscá por username (mínimo 3 letras)"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className="border p-2 rounded w-full"
                />

                {query.length > 0 && query.length < 3 && (
                    <p className="text-gray-400 text-sm mt-2">Escribí al menos 3 letras para buscar</p>
                )}

                {searching && <p className="text-gray-400 text-sm mt-2">Buscando...</p>}

                {results.length > 0 && (
                    <div className="mt-3 flex flex-col gap-2">
                        {results.map(user => (
                            <div key={user.id} className="flex justify-between items-center p-2 border rounded">
                                <div>
                                    <p className="font-medium text-sm">{user.person.complete_name}</p>
                                    <p className="text-xs text-gray-500">@{user.username}</p>
                                </div>
                                {contactPersonIds.includes(user.person.id) ? (
                                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">Contacto</span>
                                ) : (
                                    <button
                                        onClick={() => handleAdd(user.person.id)}
                                        className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                    >
                                        Agregar
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {query.length >= 3 && !searching && results.length === 0 && (
                    <p className="text-gray-400 text-sm mt-2">No se encontraron usuarios</p>
                )}
            </div>

            {/* Lista de contactos */}
            <h3 className="font-semibold mb-3">Mis contactos</h3>
            {contacts.length === 0 ? (
                <p className="text-gray-500 text-sm">No tenés contactos todavía</p>
            ) : (
                <div className="flex flex-col gap-2">
                    {contacts.map(contact => (
                        <div key={contact.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
                            <div>
                                <p className="font-medium">{contact.contact.complete_name}</p>
                                <p className="text-sm text-gray-500">@{contact.contact.user.username}</p>
                            </div>
                            <button
                                onClick={() => handleRemove(contact.id)}
                                className="text-sm text-red-500 hover:text-red-700"
                            >
                                Eliminar
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </AppLayout>
    )
}