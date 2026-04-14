import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {useAuth} from '../context/AuthContext'

export default function Login() {
    const navigate = useNavigate()
    const {login} = useAuth()

    const [form, setForm] = useState({
        email: '',
        password: '',
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
            await login(form)
            navigate('/dashboard')
        }
        catch (err) {
            const message =
              err.response?.data?.message ||
              err.response?.data?.errors?.email?.[0] ||
              'No se pudo iniciar sesión'

            setError(message)
        }
        finally {
            setSubmitting(false)
        }
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
          <div className="bg-white shadow-md rounded-xl p-8 max-w-md w-full">
              <h1 className="text-2xl font-bold mb-6">Iniciar sesión</h1>

              <form onSubmit={handleSubmit} className="space-y-4">
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

                  {error && (
                    <div className="text-red-600 text-sm">{error}</div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-slate-900 text-white py-2 rounded-lg"
                  >
                      {submitting ? 'Ingresando...' : 'Ingresar'}
                  </button>
              </form>

              <p className="mt-4 text-sm text-slate-600">
                  ¿No tienes cuenta? <Link to="/register" className="underline">Regístrate</Link>
              </p>
          </div>
      </div>
    )
}