import {useState} from 'react'
import api from '../api/axios'
import AppLayout from '../components/layout/AppLayout'
import Alert from '../components/ui/Alert'
import Loader from '../components/ui/Loader'
import ExpandableText from '../components/ui/ExpandableText'

export default function Assistant() {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!message.trim()) {
            return
        }

        const userMessage = {
            role: 'user',
            text: message.trim(),
        }

        setLoading(true)
        setError('')

        try {
            const response = await api.post('/ai/assistant', {
                message: message.trim(),
            })

            const assistantMessage = {
                role: 'assistant',
                text: response.data.response,
            }

            setMessages((prev) => [...prev, userMessage, assistantMessage])
            setMessage('')
        }
        catch (err) {
            setError(
              err.response?.data?.message || 'No se pudo procesar la consulta'
            )
        }
        finally {
            setLoading(false)
        }
    }

    return (
      <AppLayout>
          <div className="space-y-6">
              <div>
                  <h1 className="text-2xl font-bold text-slate-800">Asistente ECV</h1>
                  <p className="text-slate-600 mt-1">
                      Consulta información orientativa sobre salud cardiovascular.
                  </p>
              </div>

              <Alert
                type="info"
                message="Este asistente brinda orientación general y no reemplaza la consulta médica profesional."
              />

              <div className="bg-white rounded-xl shadow-md p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                          <label className="block mb-2 text-sm font-medium text-slate-700">
                              Escribe tu consulta
                          </label>
                          <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={4}
                            placeholder="Ej: ¿Qué hábitos ayudan a prevenir problemas cardiovasculares?"
                            className="w-full border rounded-lg px-3 py-2"
                            required
                          />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                      >
                          {loading ? 'Consultando...' : 'Preguntar al asistente'}
                      </button>
                  </form>
              </div>

              {error && <Alert type="error" message={error}/>}

              {loading && <Loader text="Generando respuesta..."/>}

              <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <p className="text-slate-600">
                            Aún no hay consultas. Escribe una pregunta para comenzar.
                        </p>
                    </div>
                  ) : (
                    messages.map((item, index) => (
                      <div
                        key={index}
                        className={`rounded-xl shadow-md p-5 border ${
                          item.role === 'user'
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                          <div className="mb-2 text-sm font-semibold">
                              {item.role === 'user' ? 'Tú' : 'Asistente ECV'}
                          </div>

                          {item.role === 'user' ? (
                            <p className="whitespace-pre-line">{item.text}</p>
                          ) : (
                            <ExpandableText text={item.text} maxLength={320}/>
                          )}
                      </div>
                    ))
                  )}
              </div>
          </div>
      </AppLayout>
    )
}