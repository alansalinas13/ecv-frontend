import AppLayout from '../components/layout/AppLayout'
import {useAuth} from '../context/AuthContext'

const roleLabels = {
    1: 'Administrador',
    2: 'Doctor',
    3: 'Usuario',
}

export default function Dashboard() {
    const {user} = useAuth()

    return (
      <AppLayout>
          <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                  <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
                  <p className="text-slate-600">
                      Bienvenido, {user?.name}
                  </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl shadow-md p-5">
                      <h2 className="font-semibold text-slate-800 mb-2">Nombre</h2>
                      <p className="text-slate-600">{user?.name}</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-md p-5">
                      <h2 className="font-semibold text-slate-800 mb-2">Correo</h2>
                      <p className="text-slate-600">{user?.email}</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-md p-5">
                      <h2 className="font-semibold text-slate-800 mb-2">Rol</h2>
                      <p className="text-slate-600">{roleLabels[user?.role] || 'No definido'}</p>
                  </div>
              </div>
          </div>
      </AppLayout>
    )
}