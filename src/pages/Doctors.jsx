import {useEffect, useMemo, useState} from 'react'
import api from '../api/axios'
import AppLayout from '../components/layout/AppLayout'
import DoctorCard from '../components/doctors/DoctorCard'
import DoctorForm from '../components/doctors/DoctorForm'
import Alert from '../components/ui/Alert'
import Loader from '../components/ui/Loader'
import Confirm from '../components/ui/Confirm'
import {useAuth} from '../context/AuthContext'

export default function Doctors() {
    const {user} = useAuth()

    const isAdmin = user?.role === 1
    const isDoctor = user?.role === 2

    const [doctors, setDoctors] = useState([])
    const [doctorUsers, setDoctorUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [search, setSearch] = useState('')
    const [sortBy, setSortBy] = useState('name')
    const [editingDoctor, setEditingDoctor] = useState(null)

    const [confirmOpen, setConfirmOpen] = useState(false)
    const [selectedDoctorId, setSelectedDoctorId] = useState(null)

    const fetchDoctors = async () => {
        try {
            setError('')
            const response = await api.get('/doctors')
            setDoctors(response.data)
        }
        catch (err) {
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

    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true)
                await Promise.all([fetchDoctors(), fetchDoctorUsers()])
            }
            finally {
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
            return name.includes(term) || specialty.includes(term)
        })

        result = [...result].sort((a, b) => {
            if (sortBy === 'specialty') {
                return (a.specialty || '').localeCompare(b.specialty || '')
            }

            return (a.user?.name || '').localeCompare(b.user?.name || '')
        })

        return result
    }, [doctors, search, sortBy])

    const handleCreateDoctor = async (data, resetForm) => {
        setSubmitting(true)
        setError('')
        setSuccess('')

        try {
            await api.post('/doctors', data)
            setSuccess('Doctor creado correctamente')
            resetForm()
            await fetchDoctors()
        }
        catch (err) {
            const firstValidationError = err.response?.data?.errors
              ? Object.values(err.response.data.errors)[0]?.[0]
              : null

            setError(
              firstValidationError ||
              err.response?.data?.message ||
              'No se pudo crear el doctor'
            )
        }
        finally {
            setSubmitting(false)
        }
    }

    const handleUpdateDoctor = async (data) => {
        if (!editingDoctor) {
            return
        }

        setSubmitting(true)
        setError('')
        setSuccess('')

        try {
            await api.put(`/doctors/${editingDoctor.id}`, {
                specialty: data.specialty,
                phone: data.phone,
                description: data.description,
            })

            setSuccess('Doctor actualizado correctamente')
            setEditingDoctor(null)
            await fetchDoctors()
        }
        catch (err) {
            const firstValidationError = err.response?.data?.errors
              ? Object.values(err.response.data.errors)[0]?.[0]
              : null

            setError(
              firstValidationError ||
              err.response?.data?.message ||
              'No se pudo actualizar el doctor'
            )
        }
        finally {
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
        if (!selectedDoctorId) {
            return
        }

        setError('')
        setSuccess('')

        try {
            await api.delete(`/doctors/${selectedDoctorId}`)
            setSuccess('Doctor eliminado correctamente')

            if (editingDoctor?.id === selectedDoctorId) {
                setEditingDoctor(null)
            }

            closeDeleteConfirm()
            await fetchDoctors()
        }
        catch (err) {
            setError(err.response?.data?.message || 'No se pudo eliminar el doctor')
            closeDeleteConfirm()
        }
    }

    const canEditDoctor = (doctor) => {
        if (isAdmin) {
            return true
        }
        if (isDoctor && doctor.user_id === user?.id) {
            return true
        }
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
                        showUserSelect={isAdmin && !editingDoctor}
                      />
                    )}
                </div>
              )}

              <div className="bg-white rounded-xl shadow-md p-6 grid md:grid-cols-2 gap-4">
                  <div>
                      <label className="block mb-2 text-sm font-medium text-slate-700">
                          Buscar por nombre o especialidad
                      </label>
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Ej: cardiología, juan..."
                        className="w-full border rounded-lg px-3 py-2"
                      />
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
                      </select>
                  </div>
              </div>

              <Alert type="error" message={error}/>
              <Alert type="success" message={success}/>

              {loading ? (
                <Loader text="Cargando doctores..."/>
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