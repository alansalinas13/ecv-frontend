import {useEffect, useState} from 'react'
import api from '../api/axios'
import AppLayout from '../components/layout/AppLayout'
import EvaluationResultCard from '../components/evaluations/EvaluationResultCard'
import EvaluationHistoryCard from '../components/evaluations/EvaluationHistoryCard'

export default function Evaluation() {
    const [form, setForm] = useState({
        age: '',
        smoker: false,
        hypertension: false,
        diabetes: false,
        obesity: false,
        exercise: true,
    })

    const [evaluations, setEvaluations] = useState([])
    const [latestResult, setLatestResult] = useState(null)
    const [latestScore, setLatestScore] = useState(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const fetchEvaluations = async () => {
        try {
            const response = await api.get('/evaluations')
            setEvaluations(response.data)
        }
        catch (err) {
            setError(err.response?.data?.message || 'No se pudo cargar el historial')
        }
    }

    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true)
                await fetchEvaluations()
            }
            finally {
                setLoading(false)
            }
        }

        init()
    }, [])

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target

        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox'
              ? checked
              : name === 'age'
                ? value
                : value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setError('')
        setSuccess('')

        try {
            const payload = {
                answers: {
                    age: Number(form.age),
                    smoker: form.smoker,
                    hypertension: form.hypertension,
                    diabetes: form.diabetes,
                    obesity: form.obesity,
                    exercise: form.exercise,
                },
            }

            const response = await api.post('/evaluations', payload)

            setLatestResult(response.data.evaluation)
            setLatestScore(response.data.score)
            setSuccess('Evaluación registrada correctamente')

            await fetchEvaluations()
        }
        catch (err) {
            const firstValidationError = err.response?.data?.errors
              ? Object.values(err.response.data.errors)[0]?.[0]
              : null

            setError(firstValidationError || err.response?.data?.message || 'No se pudo registrar la evaluación')
        }
        finally {
            setSubmitting(false)
        }
    }

    return (
      <AppLayout>
          <div className="space-y-6">
              <div>
                  <h1 className="text-2xl font-bold text-slate-800">Autoevaluación cardiovascular</h1>
                  <p className="text-slate-600 mt-1">
                      Completa el formulario para obtener una evaluación orientativa de riesgo.
                  </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-xl p-4 text-sm">
                  Esta evaluación es orientativa y no reemplaza el diagnóstico de un profesional de la salud.
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-lg font-semibold mb-4">Formulario de evaluación</h2>

                  <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                          <label className="block mb-1 text-sm font-medium text-slate-700">
                              Edad
                          </label>
                          <input
                            type="number"
                            name="age"
                            value={form.age}
                            onChange={handleChange}
                            min="1"
                            className="w-full border rounded-lg px-3 py-2"
                            required
                          />
                      </div>

                      <label className="flex items-center gap-3 bg-slate-50 border rounded-lg px-4 py-3">
                          <input
                            type="checkbox"
                            name="smoker"
                            checked={form.smoker}
                            onChange={handleChange}
                          />
                          <span>Fumador</span>
                      </label>

                      <label className="flex items-center gap-3 bg-slate-50 border rounded-lg px-4 py-3">
                          <input
                            type="checkbox"
                            name="hypertension"
                            checked={form.hypertension}
                            onChange={handleChange}
                          />
                          <span>Hipertensión</span>
                      </label>

                      <label className="flex items-center gap-3 bg-slate-50 border rounded-lg px-4 py-3">
                          <input
                            type="checkbox"
                            name="diabetes"
                            checked={form.diabetes}
                            onChange={handleChange}
                          />
                          <span>Diabetes</span>
                      </label>

                      <label className="flex items-center gap-3 bg-slate-50 border rounded-lg px-4 py-3">
                          <input
                            type="checkbox"
                            name="obesity"
                            checked={form.obesity}
                            onChange={handleChange}
                          />
                          <span>Obesidad</span>
                      </label>

                      <label className="flex items-center gap-3 bg-slate-50 border rounded-lg px-4 py-3 md:col-span-2">
                          <input
                            type="checkbox"
                            name="exercise"
                            checked={form.exercise}
                            onChange={handleChange}
                          />
                          <span>Realiza ejercicio regularmente</span>
                      </label>

                      <div className="md:col-span-2">
                          <button
                            type="submit"
                            disabled={submitting}
                            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                          >
                              {submitting ? 'Evaluando...' : 'Enviar evaluación'}
                          </button>
                      </div>
                  </form>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
                    {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4">
                    {success}
                </div>
              )}

              {latestResult && latestScore !== null && (
                <EvaluationResultCard
                  evaluation={latestResult}
                  score={latestScore}
                />
              )}

              <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-slate-800">Historial de evaluaciones</h2>

                  {loading ? (
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <p className="text-slate-600">Cargando historial...</p>
                    </div>
                  ) : evaluations.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <p className="text-slate-600">Aún no tienes evaluaciones registradas.</p>
                    </div>
                  ) : (
                    <div className="grid lg:grid-cols-2 gap-4">
                        {evaluations.map((evaluation) => (
                          <EvaluationHistoryCard
                            key={evaluation.id}
                            evaluation={evaluation}
                          />
                        ))}
                    </div>
                  )}
              </div>
          </div>
      </AppLayout>
    )
}