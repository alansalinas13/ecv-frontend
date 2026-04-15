import { useEffect, useMemo, useState } from 'react'

const initialState = {
    user_id: '',
    city_id: '',
    hospital_id: '',
    specialty: '',
    phone: '',
    description: '',
    start_time: '',
    end_time: '',
}

export default function DoctorForm({
    onSubmit,
    submitting,
    initialValues = null,
    submitLabel = 'Guardar doctor',
    onCancel = null,
    doctorUsers = [],
    cities = [],
    hospitals = [],
    showUserSelect = true,
}) {
    const [form, setForm] = useState(initialState)

    useEffect(() => {
        if (initialValues) {
            setForm({
                user_id: initialValues.user_id ?? '',
                city_id: initialValues.city_id ?? '',
                hospital_id: initialValues.hospital_id ?? '',
                specialty: initialValues.specialty ?? '',
                phone: initialValues.phone ?? '',
                description: initialValues.description ?? '',
                start_time: initialValues.start_time ?? '',
                end_time: initialValues.end_time ?? '',
            })
        } else {
            setForm(initialState)
        }
    }, [initialValues])

    const filteredHospitals = useMemo(() => {
        if (!form.city_id) return hospitals
        return hospitals.filter((hospital) => String(hospital.city_id) === String(form.city_id))
    }, [hospitals, form.city_id])

    const handleChange = (e) => {
        const { name, value } = e.target

        setForm((prev) => {
            const next = {
                ...prev,
                [name]: value,
            }

            if (name === 'city_id') {
                next.hospital_id = ''
            }

            return next
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(form, () => setForm(initialState))
    }

    return (
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
          {showUserSelect && (
            <div className="md:col-span-2">
                <label className="block mb-1 text-sm font-medium text-slate-700">
                    Usuario doctor
                </label>
                <select
                  name="user_id"
                  value={form.user_id}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                >
                    <option value="">Selecciona un usuario doctor</option>
                    {doctorUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                          {user.name} - {user.email}
                      </option>
                    ))}
                </select>
            </div>
          )}

          <div>
              <label className="block mb-1 text-sm font-medium text-slate-700">
                  Ciudad
              </label>
              <select
                name="city_id"
                value={form.city_id}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              >
                  <option value="">Selecciona una ciudad</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                        {city.name}
                    </option>
                  ))}
              </select>
          </div>

          <div>
              <label className="block mb-1 text-sm font-medium text-slate-700">
                  Hospital
              </label>
              <select
                name="hospital_id"
                value={form.hospital_id}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              >
                  <option value="">Selecciona un hospital</option>
                  {filteredHospitals.map((hospital) => (
                    <option key={hospital.id} value={hospital.id}>
                        {hospital.name}
                    </option>
                  ))}
              </select>
          </div>

          <div>
              <label className="block mb-1 text-sm font-medium text-slate-700">
                  Especialidad
              </label>
              <input
                type="text"
                name="specialty"
                value={form.specialty}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
          </div>

          <div>
              <label className="block mb-1 text-sm font-medium text-slate-700">
                  Teléfono
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
          </div>

          <div>
              <label className="block mb-1 text-sm font-medium text-slate-700">
                  Hora inicio
              </label>
              <input
                type="time"
                name="start_time"
                value={form.start_time}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
          </div>

          <div>
              <label className="block mb-1 text-sm font-medium text-slate-700">
                  Hora fin
              </label>
              <input
                type="time"
                name="end_time"
                value={form.end_time}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
          </div>

          <div className="md:col-span-2">
              <label className="block mb-1 text-sm font-medium text-slate-700">
                  Descripción
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full border rounded-lg px-3 py-2"
              />
          </div>

          <div className="md:col-span-2 flex flex-wrap gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                  {submitting ? 'Guardando...' : submitLabel}
              </button>

              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="border border-slate-300 px-4 py-2 rounded-lg"
                >
                    Cancelar
                </button>
              )}
          </div>
      </form>
    )
}