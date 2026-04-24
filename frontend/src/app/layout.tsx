import type { Metadata } from 'next'
import { AuthProvider } from '../context/AuthContext'
import './globals.css'

export const metadata: Metadata = {
  title: 'FinTrack',
  description: 'Gestión de gastos compartidos'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}