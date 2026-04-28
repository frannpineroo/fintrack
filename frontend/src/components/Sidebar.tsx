'use client'

import Link from 'next/dist/client/link'
import { useAuth } from '../context/AuthContext'
import { usePathname } from 'next/navigation'

const links = [
    { href: '/dashboard', label: 'Inicio' },
    { href: '/groups', label: 'Grupos' },
    { href: '/wallets', label: 'Mis wallets' },
    { href: '/profile', label: 'Mi perfil' },
]

export default function Sidebar() {
    const { user, logout } = useAuth()
    const pathname = usePathname()

    return (
        <aside className="w-64 min-h-screen bg-white shadow-md flex flex-col">
            <div className="p-6 border-b">
                <h1 className="text-xl font-bold">FinTrack</h1>
                <p className="text-sm text-gray-500 mt-1">@{user?.username}</p>
            </div>

            <nav className="flex-1 p-4 flex flex-col gap-1">
                {links.map(link => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition ${pathname === link.href
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t">
                <p className="text-sm text-gray-500 mb-2">{user?.name}</p>
                <button
                    onClick={logout}
                    className="w-full text-left text-sm text-red-500 hover:text-red-700"
                >
                    Cerrar sesión
                </button>
            </div>
        </aside>
    )
}