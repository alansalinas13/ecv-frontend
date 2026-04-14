import {useEffect, useState} from 'react'
import api from '../api/axios'
import AppLayout from '../components/layout/AppLayout'
import DoctorCard from '../components/doctors/DoctorCard'

export default function Doctors() {
    const [doctors, setDoctors] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                setLoading(true)
                setError('')

                const response = await api.get('/doctors')
                setDoctors(response.data)
            }
            catch (err) {
                setError(
                  err.response?.data?.message || 'No se pudieron cargar los doctores'
                )
            }
            finally {
                setLoading(false)
            }
        }

        fetchDoctors()
    }, [])

    return (
      <AppLayout>
          <div className="space-y-6">
              <div>
                  <h1 className="text-2xl font-bold text-slate-800">Doctores</h1>
                  <p className="text-slate-600 mt-1">
                      Listado de profesionales registrados en el sistema.
                  </p>
              </div>

              {loading && (
                <div className="bg-white rounded-xl shadow-md p-6">
                    <p className="text-slate-600">Cargando doctores...</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
                    {error}
                </div>
              )}

              {!loading && !error && doctors.length === 0 && (
                <div className="bg-white rounded-xl shadow-md p-6">
                    <p className="text-slate-600">No hay doctores registrados.</p>
                </div>
              )}

              {!loading && !error && doctors.length > 0 && (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {doctors.map((doctor) => (
                      <DoctorCard key={doctor.id} doctor={doctor}/>
                    ))}
                </div>
              )}
          </div>
      </AppLayout>
    )
}