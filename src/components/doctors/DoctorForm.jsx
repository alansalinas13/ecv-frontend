import {useEffect, useState} from 'react'

const initialState = {
    user_id: '',
    specialty: '',
    phone: '',
    description: '',
}

export default function DoctorForm({
    onSubmit,
    submitting,
    initialValues = null,
    submitLabel = 'Guardar doctor',
    onCancel = null,
    doctorUsers = [],
    showUserSelect = true,
}) {
    const [form, setForm] = useState(initialState)

    useEffect(() => {
        if (initialValues) {
            setForm({
                user_id: initialValues.user_id ?? '',
                specialty: initialValues.specialty ?? '',
                phone: initialValues.phone ?? '',
                description: initialValues.description ?? '',
            })
        }
        else {
            setForm(initialState)
        }
    }, [initialValues])

    const handleChange = (e) => {
        const {name, value} = e.target
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }))
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