import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Home() {
    const { isAuthenticated, loading } = useAuth()

    if (loading) {
        return (
          <div className="min-h-screen flex items-center justify-center">
              Cargando...
          </div>
        )
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
          <div className="bg-white shadow-md rounded-xl p-8 max-w-xl w-full">
              <h1 className="text-3xl font-bold mb-4">Plataforma ECV</h1>
              <p className="text-slate-600 mb-6">
                  Sistema web de información, interacción y gestión médica para enfermedades cardiovasculares.
              </p>

              <div className="flex gap-3">
                  <Link
                    to="/login"
                    className="bg-slate-900 text-white px-4 py-2 rounded-lg"
                  >
                      Iniciar sesión
                  </Link>

                  <Link
                    to="/register"
                    className="border border-slate-300 px-4 py-2 rounded-lg"
                  >
                      Registrarse
                  </Link>
              </div>
          </div>
      </div>
    )
}