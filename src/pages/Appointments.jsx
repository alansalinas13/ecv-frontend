import {useEffect, useMemo, useState} from 'react'
import api from '../api/axios'
import AppLayout from '../components/layout/AppLayout'
import AppointmentCard from '../components/appointments/AppointmentCard'
import {useAuth} from '../context/AuthContext'
import Alert from '../components/ui/Alert'
import Loader from '../components/ui/Loader'

export default function Appointments() {
    const {user} = useAuth()

    const [appointments, setAppointments] = useState([])
    const [doctors, setDoctors] = useState([])
    const [form, setForm] = useState({
        doctor_id: '',
        appointment_date: '',
    })

    const [statusFilter, setStatusFilter] = useState('all')

    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [changingStatusId, setChangingStatusId] = useState(null)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const isUser = user?.role === 3
    const isDoctor = user?.role === 2

    const fetchAppointments = async () => {
        try {
            setError('')
            const response = await api.get('/appointments')
            setAppointments(response.data)
        }
        catch (err) {
            setError(err.response?.data?.message || 'No se pudieron cargar las citas')
        }
    }

    const fetchDoctors = async () => {
        try {
            const response = await api.get('/doctors')
            setDoctors(response.data)
        }
        catch {
            // no rompemos la p�gina si falla este cat�logo
        }
    }

    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true)
                await Promise.all([fetchAppointments(), fetchDoctors()])
            }
            finally {
                setLoading(false)
            }
        }

        init()
    }, [])

    const handleChange = (e) => {
        const {name, value} = e.target
        setForm((prev) => ({...prev, [name]: value}))
    }

    const handleCreateAppointment = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setError('')
        setSuccess('')

        try {
            await api.post('/appointments', form)

            setSuccess('Cita creada correctamente')
            setForm({
                doctor_id: '',
                appointment_date: '',
            })

            await fetchAppointments()
        }
        catch (err) {
            const firstValidationError = err.response?.data?.errors
              ? Object.values(err.response.data.errors)[0]?.[0]
              : null

            setError(firstValidationError || err.response?.data?.message || 'No se pudo crear la cita')
        }
        finally {
            setSubmitting(false)
        }
    }

    const handleStatusChange = async (appointmentId, status) => {
        setChangingStatusId(appointmentId)
        setError('')
        setSuccess('')

        try {
            await api.put(`/appointments/${appointmentId}/status`, {status})
            setSuccess('Estado de la cita actualizado correctamente')
            await fetchAppointments()
        }
        catch (err) {
            const firstValidationError = err.response?.data?.errors
              ? Object.values(err.response.data.errors)[0]?.[0]
              : null

            setError(firstValidationError || err.response?.data?.message || 'No se pudo actualizar el estado')
        }
        finally {
            setChangingStatusId(null)
        }
    }

    const filteredAppointments = useMemo(() => {
        const base =
          statusFilter === 'all'
            ? appointments
            : appointments.filter((appointment) => appointment.status === statusFilter)

        return [...base].sort(
          (a, b) => new Date(a.appointment_date) - new Date(b.appointment_date)
        )
    }, [appointments, statusFilter])

    return (
      <AppLayout>
          <div className="space-y-6">
              <div>
                  <h1 className="text-2xl font-bold text-slate-800">Citas</h1>
                  <p className="text-slate-600 mt-1">
                      {isUser && 'Agenda y consulta tus citas médicas.'}
                      {isDoctor && 'Gestiona las citas asignadas a tu perfil.'}
                      {!isUser && !isDoctor && 'Consulta las citas registradas en el sistema.'}
                  </p>
              </div>

              {isUser && (
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-4">Agendar nueva cita</h2>

                    <form onSubmit={handleCreateAppointment} className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-slate-700">
                                Doctor
                            </label>
                            <select
                              name="doctor_id"
                              value={form.doctor_id}
                              onChange={handleChange}
                              className="w-full border rounded-lg px-3 py-2"
                              required
                            >
                                <option value="">Selecciona un doctor</option>
                                {doctors.map((doctor) => (
                                  <option key={doctor.id} value={doctor.id}>
                                      {doctor.user?.name} - {doctor.specialty}
                                  </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-slate-700">
                                Fecha y hora
                            </label>
                            <input
                              type="datetime-local"
                              name="appointment_date"
                              value={form.appointment_date}
                              onChange={handleChange}
                              className="w-full border rounded-lg px-3 py-2"
                              required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <button
                              type="submit"
                              disabled={submitting}
                              className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                            >
                                {submitting ? 'Guardando...' : 'Agendar cita'}
                            </button>
                        </div>
                    </form>
                </div>
              )}

              <div className="bg-white rounded-xl shadow-md p-6">
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                      Filtrar por estado
                  </label>

                  <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setStatusFilter('all')}
                        className={`px-4 py-2 rounded-lg text-sm ${
                          statusFilter === 'all'
                            ? 'bg-slate-900 text-white'
                            : 'border border-slate-300 text-slate-700'
                        }`}
                      >
                          Todas
                      </button>

                      <button
                        type="button"
                        onClick={() => setStatusFilter('pending')}
                        className={`px-4 py-2 rounded-lg text-sm ${
                          statusFilter === 'pending'
                            ? 'bg-yellow-500 text-white'
                            : 'border border-slate-300 text-slate-700'
                        }`}
                      >
                          Pendientes
                      </button>

                      <button
                        type="button"
                        onClick={() => setStatusFilter('confirmed')}
                        className={`px-4 py-2 rounded-lg text-sm ${
                          statusFilter === 'confirmed'
                            ? 'bg-green-600 text-white'
                            : 'border border-slate-300 text-slate-700'
                        }`}
                      >
                          Confirmadas
                      </button>

                      <button
                        type="button"
                        onClick={() => setStatusFilter('cancelled')}
                        className={`px-4 py-2 rounded-lg text-sm ${
                          statusFilter === 'cancelled'
                            ? 'bg-red-600 text-white'
                            : 'border border-slate-300 text-slate-700'
                        }`}
                      >
                          Canceladas
                      </button>

                      <button
                        type="button"
                        onClick={() => setStatusFilter('completed')}
                        className={`px-4 py-2 rounded-lg text-sm ${
                          statusFilter === 'completed'
                            ? 'bg-blue-600 text-white'
                            : 'border border-slate-300 text-slate-700'
                        }`}
                      >
                          Completadas
                      </button>
                  </div>
              </div>

              <Alert type="error" message={error}/>
              <Alert type="success" message={success}/>

              <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-lg font-semibold mb-4">Listado de citas</h2>

                  {loading ? (
                    <Loader text="Cargando citas..."/>
                  ) : filteredAppointments.length === 0 ? (
                    <p className="text-slate-600">
                        {appointments.length === 0
                          ? 'No hay citas registradas.'
                          : 'No hay citas para ese filtro.'}
                    </p>
                  ) : (
                    <div className="grid lg:grid-cols-2 gap-4">
                        {filteredAppointments.map((appointment) => (
                          <AppointmentCard
                            key={appointment.id}
                            appointment={appointment}
                            currentUser={user}
                            onStatusChange={handleStatusChange}
                            changingStatus={changingStatusId === appointment.id}
                          />
                        ))}
                    </div>
                  )}
              </div>
          </div>
      </AppLayout>
    )
}