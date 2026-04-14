import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {useAuth} from '../context/AuthContext'

export default function Register() {
    const navigate = useNavigate()
    const {register} = useAuth()

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    })
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleChange = (e) => {
        const {name, value} = e.target
        setForm((prev) => ({...prev, [name]: value}))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSubmitting(true)

        try {
            await register(form)
            navigate('/dashboard')
        }
        catch (err) {
            const firstValidationError = err.response?.data?.errors
              ? Object.values(err.response.data.errors)[0]?.[0]
              : null

            setError(firstValidationError || err.response?.data?.message || 'No se pudo registrar el usuario')
        }
        finally {
            setSubmitting(false)
        }
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
          <div className="bg-white shadow-md rounded-xl p-8 max-w-md w-full">
              <h1 className="text-2xl font-bold mb-6">Registro</h1>

              <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                      <label className="block mb-1 text-sm">Nombre</label>
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
                      <label className="block mb-1 text-sm">Correo</label>
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
                      <label className="block mb-1 text-sm">Contraseña</label>
                      <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2"
                        required
                      />
                  </div>

                  <div>
                      <label className="block mb-1 text-sm">Confirmar contraseña</label>
                      <input
                        type="password"
                        name="password_confirmation"
                        value={form.password_confirmation}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2"
                        required
                      />
                  </div>

                  {error && (
                    <div className="text-red-600 text-sm">{error}</div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-slate-900 text-white py-2 rounded-lg"
                  >
                      {submitting ? 'Registrando...' : 'Crear cuenta'}
                  </button>
              </form>

              <p className="mt-4 text-sm text-slate-600">
                  ¿Ya tienes cuenta? <Link to="/login" className="underline">Inicia sesión</Link>
              </p>
          </div>
      </div>
    )
}