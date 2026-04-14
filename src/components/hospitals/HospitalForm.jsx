import {useEffect, useState} from 'react'

const initialState = {
    name: '',
    address: '',
    lat: '',
    lng: '',
}

export default function HospitalForm({
    onSubmit,
    submitting,
    initialValues = null,
    submitLabel = 'Guardar hospital',
    onCancel = null,
}) {
    const [form, setForm] = useState(initialState)

    useEffect(() => {
        if (initialValues) {
            setForm({
                name: initialValues.name ?? '',
                address: initialValues.address ?? '',
                lat: initialValues.lat ?? '',
                lng: initialValues.lng ?? '',
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
          <div>
              <label className="block mb-1 text-sm font-medium text-slate-700">
                  Nombre
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
          </div>

          <div>
              <label className="block mb-1 text-sm font-medium text-slate-700">
                  Dirección
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
          </div>

          <div>
              <label className="block mb-1 text-sm font-medium text-slate-700">
                  Latitud
              </label>
              <input
                type="number"
                step="any"
                name="lat"
                value={form.lat}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
          </div>

          <div>
              <label className="block mb-1 text-sm font-medium text-slate-700">
                  Longitud
              </label>
              <input
                type="number"
                step="any"
                name="lng"
                value={form.lng}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
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