import {useEffect, useMemo, useState} from 'react'
import api from '../api/axios'
import AppLayout from '../components/layout/AppLayout'
import HospitalCard from '../components/hospitals/HospitalCard'
import HospitalForm from '../components/hospitals/HospitalForm'
import HospitalsMapView from '../components/hospitals/HospitalsMapView'
import {useAuth} from '../context/AuthContext'
import Alert from '../components/ui/Alert'
import Loader from '../components/ui/Loader'
import Confirm from '../components/ui/Confirm'

export default function HospitalsMap() {
    const {user} = useAuth()
    const isAdmin = user?.role === 1

    const [hospitals, setHospitals] = useState([])
    const [cities, setCities] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [editingHospital, setEditingHospital] = useState(null)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [search, setSearch] = useState('')
    const [cityFilter, setCityFilter] = useState('all')
    const [sortBy, setSortBy] = useState('name')

    const [confirmOpen, setConfirmOpen] = useState(false)
    const [selectedHospitalId, setSelectedHospitalId] = useState(null)

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

    const fetchCities = async () => {
        try {
            const response = await api.get('/cities')
            setCities(response.data)
        }
        catch {
            setCities([])
        }
    }

    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true)
                await Promise.all([fetchHospitals(), fetchCities()])
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
                city_id: Number(data.city_id),
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
                city_id: Number(data.city_id),
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

    const openDeleteConfirm = (hospitalId) => {
        setSelectedHospitalId(hospitalId)
        setConfirmOpen(true)
    }

    const closeDeleteConfirm = () => {
        setConfirmOpen(false)
        setSelectedHospitalId(null)
    }

    const confirmDeleteHospital = async () => {
        if (!selectedHospitalId) {
            return
        }

        setError('')
        setSuccess('')

        try {
            await api.delete(`/hospitals/${selectedHospitalId}`)
            setSuccess('Hospital eliminado correctamente')

            if (editingHospital?.id === selectedHospitalId) {
                setEditingHospital(null)
            }

            closeDeleteConfirm()
            await fetchHospitals()
        }
        catch (err) {
            setError(err.response?.data?.message || 'No se pudo eliminar el hospital')
            closeDeleteConfirm()
        }
    }

    const filteredHospitals = useMemo(() => {
        const term = search.trim().toLowerCase()

        let result = hospitals.filter((hospital) => {
            const name = hospital.name?.toLowerCase() || ''
            const address = hospital.address?.toLowerCase() || ''
            const cityName = hospital.city?.name?.toLowerCase() || ''

            const matchesSearch =
              name.includes(term) ||
              address.includes(term) ||
              cityName.includes(term)

            const matchesCity =
              cityFilter === 'all' || String(hospital.city_id) === cityFilter

            return matchesSearch && matchesCity
        })

        result = [...result].sort((a, b) => {
            if (sortBy === 'address') {
                return (a.address || '').localeCompare(b.address || '')
            }

            if (sortBy === 'city') {
                return (a.city?.name || '').localeCompare(b.city?.name || '')
            }

            return (a.name || '').localeCompare(b.name || '')
        })

        return result
    }, [hospitals, search, cityFilter, sortBy])

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
                      cities={cities}
                    />
                </div>
              )}

              <div className="bg-white rounded-xl shadow-md p-6 grid md:grid-cols-3 gap-4">
                  <div>
                      <label className="block mb-2 text-sm font-medium text-slate-700">
                          Buscar por nombre, dirección o ciudad
                      </label>
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Ej: central, avenida, asunción..."
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
                          <option value="address">Dirección</option>
                          <option value="city">Ciudad</option>
                      </select>
                  </div>
              </div>

              <Alert type="error" message={error}/>
              <Alert type="success" message={success}/>

              {loading ? (
                <Loader text="Cargando hospitales..."/>
              ) : filteredHospitals.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-6">
                    <p className="text-slate-600">
                        {hospitals.length === 0
                          ? 'No hay hospitales registrados.'
                          : 'No se encontraron hospitales con ese criterio.'}
                    </p>
                </div>
              ) : (
                <>
                    <HospitalsMapView hospitals={filteredHospitals}/>

                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filteredHospitals.map((hospital) => (
                          <HospitalCard
                            key={hospital.id}
                            hospital={hospital}
                            isAdmin={isAdmin}
                            onEdit={setEditingHospital}
                            onDelete={openDeleteConfirm}
                          />
                        ))}
                    </div>
                </>
              )}

              {confirmOpen && (
                <Confirm
                  message="¿Seguro que deseas eliminar este hospital?"
                  onConfirm={confirmDeleteHospital}
                  onCancel={closeDeleteConfirm}
                />
              )}
          </div>
      </AppLayout>
    )
}