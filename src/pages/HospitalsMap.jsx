import {useEffect, useState} from 'react'
import api from '../api/axios'
import AppLayout from '../components/layout/AppLayout'
import HospitalCard from '../components/hospitals/HospitalCard'
import HospitalForm from '../components/hospitals/HospitalForm'
import HospitalsMapView from '../components/hospitals/HospitalsMapView'
import {useAuth} from '../context/AuthContext'

export default function HospitalsMap() {
    const {user} = useAuth()
    const isAdmin = user?.role === 1

    const [hospitals, setHospitals] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [editingHospital, setEditingHospital] = useState(null)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const fetchHospitals = async () => {
        try {
            setError('')
            const response = await api.get('/hospitals')
            setHospitals(response.data)
        }
        catch (err) {
            setError(
              err.response?.data?.message || 'No se pudieron cargar los hospitales'
            )
        }
    }

    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true)
                await fetchHospitals()
            }
            finally {
                setLoading(false)
            }
        }

        init()
    }, [])

    const handleCreateHospital = async (data, resetForm) => {
        setSubmitting(true)
        setError('')
        setSuccess('')

        try {
            await api.post('/hospitals', {
                ...data,
                lat: Number(data.lat),
                lng: Number(data.lng),
            })

            setSuccess('Hospital creado correctamente')
            resetForm()
            await fetchHospitals()
        }
        catch (err) {
            const firstValidationError = err.response?.data?.errors
              ? Object.values(err.response.data.errors)[0]?.[0]
              : null

            setError(
              firstValidationError ||
              err.response?.data?.message ||
              'No se pudo crear el hospital'
            )
        }
        finally {
            setSubmitting(false)
        }
    }

    const handleUpdateHospital = async (data) => {
        if (!editingHospital) {
            return
        }

        setSubmitting(true)
        setError('')
        setSuccess('')

        try {
            await api.put(`/hospitals/${editingHospital.id}`, {
                ...data,
                lat: Number(data.lat),
                lng: Number(data.lng),
            })

            setSuccess('Hospital actualizado correctamente')
            setEditingHospital(null)
            await fetchHospitals()
        }
        catch (err) {
            const firstValidationError = err.response?.data?.errors
              ? Object.values(err.response.data.errors)[0]?.[0]
              : null

            setError(
              firstValidationError ||
              err.response?.data?.message ||
              'No se pudo actualizar el hospital'
            )
        }
        finally {
            setSubmitting(false)
        }
    }

    const handleDeleteHospital = async (hospitalId) => {
        const confirmed = window.confirm('¿Seguro que deseas eliminar este hospital?')
        if (!confirmed) {
            return
        }

        setError('')
        setSuccess('')

        try {
            await api.delete(`/hospitals/${hospitalId}`)
            setSuccess('Hospital eliminado correctamente')

            if (editingHospital?.id === hospitalId) {
                setEditingHospital(null)
            }

            await fetchHospitals()
        }
        catch (err) {
            setError(err.response?.data?.message || 'No se pudo eliminar el hospital')
        }
    }

    return (
      <AppLayout>
          <div className="space-y-6">
              <div>
                  <h1 className="text-2xl font-bold text-slate-800">Hospitales y mapa</h1>
                  <p className="text-slate-600 mt-1">
                      Consulta hospitales registrados y visualiza su ubicación geográfica.
                  </p>
              </div>

              {isAdmin && (
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-4">
                        {editingHospital ? 'Editar hospital' : 'Crear hospital'}
                    </h2>

                    <HospitalForm
                      initialValues={editingHospital}
                      onSubmit={editingHospital ? handleUpdateHospital : handleCreateHospital}
                      submitting={submitting}
                      submitLabel={editingHospital ? 'Actualizar hospital' : 'Crear hospital'}
                      onCancel={editingHospital ? () => setEditingHospital(null) : null}
                    />
                </div>
              )}

              {loading && (
                <div className="bg-white rounded-xl shadow-md p-6">
                    <p className="text-slate-600">Cargando hospitales...</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
                    {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4">
                    {success}
                </div>
              )}

              {!loading && !error && hospitals.length === 0 && (
                <div className="bg-white rounded-xl shadow-md p-6">
                    <p className="text-slate-600">No hay hospitales registrados.</p>
                </div>
              )}

              {!loading && hospitals.length > 0 && (
                <>
                    <HospitalsMapView hospitals={hospitals}/>

                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {hospitals.map((hospital) => (
                          <HospitalCard
                            key={hospital.id}
                            hospital={hospital}
                            isAdmin={isAdmin}
                            onEdit={setEditingHospital}
                            onDelete={handleDeleteHospital}
                          />
                        ))}
                    </div>
                </>
              )}
          </div>
      </AppLayout>
    )
}