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

    const role = user?.role

    const navItems = [
        {label: 'Inicio', to: '/dashboard', roles: [1, 2, 3]},
        {label: 'Usuarios', to: '/users', roles: [1]},
        {label: 'Doctores', to: '/doctors', roles: [1, 2, 3]},
        {label: 'Citas', to: '/appointments', roles: [1, 2, 3]},
        {label: 'Foro', to: '/forum', roles: [1, 2, 3]},
        {label: 'Autoevaluación', to: '/evaluation', roles: [3]},
        {label: 'Hospitales', to: '/hospitals', roles: [1, 2, 3]},
        { label: 'Asistente ECV', to: '/assistant', roles: [1, 2, 3] },
    ]

    const visibleItems = navItems.filter((item) => item.roles.includes(role))

    return (
      <nav className="bg-slate-900 text-white px-6 py-4">
          <div className="max-w-7xl mx-auto flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center justify-between gap-4">
                  <Link to="/dashboard" className="font-semibold text-lg">
                      ECV Sistema
                  </Link>
              </div>

              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                      {visibleItems.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className="hover:text-slate-300 transition-colors"
                        >
                            {item.label}
                        </Link>
                      ))}
                  </div>

                  <div className="flex items-center gap-3">
                      {user && (
                        <div className="text-slate-300 text-right text-sm">
                            <div>{user.name}</div>
                            <div className="text-xs">{roleLabels[user.role] || 'Sin rol'}</div>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md text-sm"
                      >
                          Salir
                      </button>
                  </div>
              </div>
          </div>
      </nav>
    )
}