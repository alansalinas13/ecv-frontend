import { useEffect, useMemo, useState } from 'react'
import api from '../api/axios'
import AppLayout from '../components/layout/AppLayout'
import DoctorCard from '../components/doctors/DoctorCard'
import DoctorForm from '../components/doctors/DoctorForm'
import Alert from '../components/ui/Alert'
import Loader from '../components/ui/Loader'
import Confirm from '../components/ui/Confirm'
import { useAuth } from '../context/AuthContext'

export default function Doctors() {
    const { user } = useAuth()

    const isAdmin = user?.role === 1
    const isDoctor = user?.role === 2

    const [doctors, setDoctors] = useState([])
    const [doctorUsers, setDoctorUsers] = useState([])
    const [cities, setCities] = useState([])
    const [hospitals, setHospitals] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [search, setSearch] = useState('')
    const [cityFilter, setCityFilter] = useState('all')
    const [sortBy, setSortBy] = useState('name')
    const [editingDoctor, setEditingDoctor] = useState(null)

    const [confirmOpen, setConfirmOpen] = useState(false)
    const [selectedDoctorId, setSelectedDoctorId] = useState(null)

    const fetchDoctors = async () => {
        try {
            setError('')
            const response = await api.get('/doctors')
            setDoctors(response.data)
        } catch (err) {
            setError(
              err.response?.data?.message || 'No se pudieron cargar los doctores'
            )
        }
    }

    const fetchDoctorUsers = async () => {
        try {
            const response = await api.get('/doctor-users/available')
            setDoctorUsers(response.data)
        } catch {
            setDoctorUsers([])
        }
    }

    const fetchCities = async () => {
        try {
            const response = await api.get('/cities')
            setCities(response.data)
        } catch {
            setCities([])
        }
    }

    const fetchHospitals = async () => {
        try {
            const response = await api.get('/hospitals')
            setHospitals(response.data)
        } catch {
            setHospitals([])
        }
    }

    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true)
                await Promise.all([
                    fetchDoctors(),
                    fetchDoctorUsers(),
                    fetchCities(),
                    fetchHospitals(),
                ])
            } finally {
                setLoading(false)
            }
        }

        init()
    }, [])

    const filteredDoctors = useMemo(() => {
        const term = search.trim().toLowerCase()

        let result = doctors.filter((doctor) => {
            const name = doctor.user?.name?.toLowerCase() || ''
            const specialty = doctor.specialty?.toLowerCase() || ''
            const cityName = doctor.city?.name?.toLowerCase() || ''
            const hospitalName = doctor.hospital?.name?.toLowerCase() || ''

            const matchesSearch =
              name.includes(term) ||
              specialty.includes(term) ||
              cityName.includes(term) ||
              hospitalName.includes(term)

            const matchesCity =
              cityFilter === 'all' || String(doctor.city_id) === cityFilter

            return matchesSearch && matchesCity
        })

        result = [...result].sort((a, b) => {
            if (sortBy === 'specialty') {
                return (a.specialty || '').localeCompare(b.specialty || '')
            }

            if (sortBy === 'city') {
                return (a.city?.name || '').localeCompare(b.city?.name || '')
            }

            return (a.user?.name || '').localeCompare(b.user?.name || '')
        })

        return result
    }, [doctors, search, cityFilter, sortBy])

    const handleCreateDoctor = async (data, resetForm) => {
        setSubmitting(true)
        setError('')
        setSuccess('')

        try {
            await api.post('/doctors', {
                ...data,
                user_id: Number(data.user_id),
                city_id: Number(data.city_id),
                hospital_id: Number(data.hospital_id),
            })

            setSuccess('Doctor creado correctamente')
            resetForm()
            await Promise.all([fetchDoctors(), fetchDoctorUsers()])
        } catch (err) {
            const firstValidationError = err.response?.data?.errors
              ? Object.values(err.response.data.errors)[0]?.[0]
              : null

            setError(
              firstValidationError ||
              err.response?.data?.message ||
              'No se pudo crear el doctor'
            )
        } finally {
            setSubmitting(false)
        }
    }

    const handleUpdateDoctor = async (data) => {
        if (!editingDoctor) return

        setSubmitting(true)
        setError('')
        setSuccess('')

        try {
            await api.put(`/doctors/${editingDoctor.id}`, {
                city_id: Number(data.city_id),
                hospital_id: Number(data.hospital_id),
                specialty: data.specialty,
                phone: data.phone,
                description: data.description,
                start_time: data.start_time,
                end_time: data.end_time,
            })

            setSuccess('Doctor actualizado correctamente')
            setEditingDoctor(null)
            await fetchDoctors()
        } catch (err) {
            const firstValidationError = err.response?.data?.errors
              ? Object.values(err.response.data.errors)[0]?.[0]
              : null

            setError(
              firstValidationError ||
              err.response?.data?.message ||
              'No se pudo actualizar el doctor'
            )
        } finally {
            setSubmitting(false)
        }
    }

    const openDeleteConfirm = (doctorId) => {
        setSelectedDoctorId(doctorId)
        setConfirmOpen(true)
    }

    const closeDeleteConfirm = () => {
        setConfirmOpen(false)
        setSelectedDoctorId(null)
    }

    const confirmDeleteDoctor = async () => {
        if (!selectedDoctorId) return

        setError('')
        setSuccess('')

        try {
            await api.delete(`/doctors/${selectedDoctorId}`)
            setSuccess('Doctor eliminado correctamente')

            if (editingDoctor?.id === selectedDoctorId) {
                setEditingDoctor(null)
            }

            closeDeleteConfirm()
            await Promise.all([fetchDoctors(), fetchDoctorUsers()])
        } catch (err) {
            setError(err.response?.data?.message || 'No se pudo eliminar el doctor')
            closeDeleteConfirm()
        }
    }

    const canEditDoctor = (doctor) => {
        if (isAdmin) return true
        if (isDoctor && doctor.user_id === user?.id) return true
        return false
    }

    const canDeleteDoctor = () => isAdmin

    return (
      <AppLayout>
          <div className="space-y-6">
              <div>
                  <h1 className="text-2xl font-bold text-slate-800">Doctores</h1>
                  <p className="text-slate-600 mt-1">
                      Listado de profesionales registrados en el sistema.
                  </p>
              </div>

              {(isAdmin || (isDoctor && editingDoctor)) && (
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-4">
                        {editingDoctor ? 'Editar doctor' : 'Crear doctor'}
                    </h2>

                    {isAdmin && !editingDoctor && doctorUsers.length === 0 ? (
                      <p className="text-sm text-slate-500">
                          No hay usuarios con rol doctor disponibles para crear un nuevo perfil.
                      </p>
                    ) : (
                      <DoctorForm
                        initialValues={editingDoctor}
                        onSubmit={editingDoctor ? handleUpdateDoctor : handleCreateDoctor}
                        submitting={submitting}
                        submitLabel={editingDoctor ? 'Actualizar doctor' : 'Crear doctor'}
                        onCancel={editingDoctor ? () => setEditingDoctor(null) : null}
                        doctorUsers={doctorUsers}
                        cities={cities}
                        hospitals={hospitals}
                        showUserSelect={isAdmin && !editingDoctor}
                      />
                    )}
                </div>
              )}

              <div className="bg-white rounded-xl shadow-md p-6 grid md:grid-cols-3 gap-4">
                  <div>
                      <label className="block mb-2 text-sm font-medium text-slate-700">
                          Buscar por nombre, especialidad, ciudad o hospital
                      </label>
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Ej: cardiología, asunción, central..."
                        className="w-full border rounded-lg px-3 py-2"
                      />
                  </div>

                  <div>
                      <label className="block mb-2 text-sm font-medium text-slate-700">
                          Filtrar por ciudad
                      </label>
                      <select
                        value={cityFilter}
                        onChange={(e) => setCityFilter(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2"
                      >
                          <option value="all">Todas las ciudades</option>
                          {cities.map((city) => (
                            <option key={city.id} value={String(city.id)}>
                                {city.name}
                            </option>
                          ))}
                      </select>
                  </div>

                  <div>
                      <label className="block mb-2 text-sm font-medium text-slate-700">
                          Ordenar por
                      </label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2"
                      >
                          <option value="name">Nombre</option>
                          <option value="specialty">Especialidad</option>
                          <option value="city">Ciudad</option>
                      </select>
                  </div>
              </div>

              <Alert type="error" message={error} />
              <Alert type="success" message={success} />

              {loading ? (
                <Loader text="Cargando doctores..." />
              ) : filteredDoctors.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-6">
                    <p className="text-slate-600">
                        {doctors.length === 0
                          ? 'No hay doctores registrados.'
                          : 'No se encontraron doctores con ese criterio.'}
                    </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredDoctors.map((doctor) => (
                      <DoctorCard
                        key={doctor.id}
                        doctor={doctor}
                        canEdit={canEditDoctor(doctor)}
                        canDelete={canDeleteDoctor()}
                        onEdit={setEditingDoctor}
                        onDelete={openDeleteConfirm}
                      />
                    ))}
                </div>
              )}

              {confirmOpen && (
                <Confirm
                  message="¿Seguro que deseas eliminar este doctor?"
                  onConfirm={confirmDeleteDoctor}
                  onCancel={closeDeleteConfirm}
                />
              )}
          </div>
      </AppLayout>
    )
}