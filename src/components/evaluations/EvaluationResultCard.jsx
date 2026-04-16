const riskStyles = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700',
}

const riskLabels = {
    low: 'Bajo',
    medium: 'Medio',
    high: 'Alto',
}

export default function EvaluationResultCard({evaluation, score}) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-slate-800">
                  Resultado de evaluación
              </h2>

              <span
                className={`text-sm font-medium px-3 py-1 rounded-full ${
                  riskStyles[evaluation.risk_level] || 'bg-slate-100 text-slate-700'
                }`}
              >
          Riesgo {riskLabels[evaluation.risk_level] || evaluation.risk_level}
        </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-700">
              <div>
                  <span className="font-medium">Puntaje: </span>
                  {score}
              </div>

              <div>
                  <span className="font-medium">Fecha: </span>
                  {new Date(evaluation.created_at).toLocaleString()}
              </div>
          </div>

          <div>
              <h3 className="font-semibold text-slate-800 mb-2">Respuestas</h3>
              <div className="grid md:grid-cols-2 gap-3 text-sm text-slate-700">
                  <div><span className="font-medium">Edad:</span> {evaluation.answers.age}</div>
                  <div><span className="font-medium">Fumador:</span> {evaluation.answers.smoker ? 'Sí' : 'No'}</div>
                  <div><span
                    className="font-medium">Hipertensión:</span> {evaluation.answers.hypertension ? 'Sí' : 'No'}</div>
                  <div><span className="font-medium">Diabetes:</span> {evaluation.answers.diabetes ? 'Sí' : 'No'}</div>
                  <div><span className="font-medium">Obesidad:</span> {evaluation.answers.obesity ? 'Sí' : 'No'}</div>
                  <div><span className="font-medium">Ejercicio:</span> {evaluation.answers.exercise ? 'Sí' : 'No'}</div>
              </div>
              {evaluation.ai_summary && (
                <div>
                    <h3 className="font-semibold text-slate-800 mb-2">Resumen inteligente</h3>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                        <p className="text-slate-700 whitespace-pre-line leading-7">
                            {evaluation.ai_summary}
                        </p>
                    </div>
                </div>
              )}
          </div>
      </div>
    )
}