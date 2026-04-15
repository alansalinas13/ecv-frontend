import {useEffect, useState} from 'react'

const initialState = {
    name: '',
    email: '',
    phone: '',
    role: '3',
    password: '',
    password_confirmation: '',
}

const roleOptions = [
    {value: '1', label: 'Admin'},
    {value: '2', label: 'Doctor'},
    {value: '3', label: 'Usuario'},
]

export default function UserForm({
    onSubmit,
    submitting,
    initialValues = null,
    submitLabel = 'Guardar usuario',
    onCancel = null,
}) {
    const [form, setForm] = useState(initialState)

    useEffect(() => {
        if (initialValues) {
            setForm({
                name: initialValues.name ?? '',
                email: initialValues.email ?? '',
                role: String(initialValues.role ?? '3'),
                password: '',
                password_confirmation: '',
                phone: initialValues.phone ?? '',
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

    const isEditing = !!initialValues

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
                  Correo
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
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
                  Rol
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              >
                  {roleOptions.map((role) => (
                    <option key={role.value} value={role.value}>
                        {role.label}
                    </option>
                  ))}
              </select>
          </div>

          <div>
              <label className="block mb-1 text-sm font-medium text-slate-700">
                  {isEditing ? 'Nueva contraseña (opcional)' : 'Contraseña'}
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required={!isEditing}
              />
          </div>

          <div>
              <label className="block mb-1 text-sm font-medium text-slate-700">
                  {isEditing ? 'Confirmar nueva contraseña' : 'Confirmar contraseña'}
              </label>
              <input
                type="password"
                name="password_confirmation"
                value={form.password_confirmation}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required={!isEditing || !!form.password}
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