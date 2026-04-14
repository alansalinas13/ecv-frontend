import {Link, useNavigate} from 'react-router-dom'
import {useAuth} from '../../context/AuthContext'

const roleLabels = {
    1: 'Admin',
    2: 'Doctor',
    3: 'Usuario',
}

export default function Navbar() {
    const {user, logout} = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    return (
      <nav className="bg-slate-900 text-white px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
              <Link to="/dashboard" className="font-semibold text-lg">
                  ECV Sistema
              </Link>

              <div className="flex items-center gap-4 text-sm">
                  <Link to="/dashboard">Dashboard</Link>
                  <Link to="/doctors">Doctores</Link>
                  <Link to="/appointments">Citas</Link>
                  <Link to="/forum">Foro</Link>
                  <Link to="/evaluation">Autoevaluación</Link>
                  <Link to="/hospitals">Hospitales</Link>

                  {user && (
                    <div className="text-slate-300 text-right">
                        <div>{user.name}</div>
                        <div className="text-xs">{roleLabels[user.role] || 'Sin rol'}</div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md"
                  >
                      Salir
                  </button>
              </div>
          </div>
      </nav>
    )
}