import AppLayout from '../components/layout/AppLayout'
import {useAuth} from '../context/AuthContext'

export default function Dashboard() {
    const {user} = useAuth()

    return (
      <AppLayout>
          <div className="bg-white rounded-xl shadow-md p-6">
              <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
              <p className="text-slate-600">
                  Bienvenido, {user?.name}
              </p>
          </div>
      </AppLayout>
    )
}