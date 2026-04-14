import {Link, useNavigate} from 'react-router-dom'
import {useAuth} from '../../context/AuthContext'

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
              <Link to="/" className="font-semibold text-lg">
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
                    <span className="text-slate-300">
              {user.name}
            </span>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="bg-red-600 px-3 py-2 rounded-md"
                  >
                      Salir
                  </button>
              </div>
          </div>
      </nav>
    )
}