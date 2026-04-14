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

export default function EvaluationHistoryCard({evaluation}) {
    return (
      <div className="bg-white rounded-xl shadow-md p-5 border border-slate-200">
          <div className="flex items-center justify-between gap-3 mb-3">
              <h3 className="font-semibold text-slate-800">
                  Evaluación #{evaluation.id}
              </h3>

              <span
                className={`text-xs font-medium px-3 py-1 rounded-full ${
                  riskStyles[evaluation.risk_level] || 'bg-slate-100 text-slate-700'
                }`}
              >
          Riesgo {riskLabels[evaluation.risk_level] || evaluation.risk_level}
        </span>
          </div>

          <p className="text-sm text-slate-500 mb-3">
              {new Date(evaluation.created_at).toLocaleString()}
          </p>

          <div className="grid md:grid-cols-2 gap-2 text-sm text-slate-700">
              <div><span className="font-medium">Edad:</span> {evaluation.answers.age}</div>
              <div><span className="font-medium">Fumador:</span> {evaluation.answers.smoker ? 'Sí' : 'No'}</div>
              <div><span className="font-medium">Hipertensión:</span> {evaluation.answers.hypertension ? 'Sí' : 'No'}
              </div>
              <div><span className="font-medium">Diabetes:</span> {evaluation.answers.diabetes ? 'Sí' : 'No'}</div>
              <div><span className="font-medium">Obesidad:</span> {evaluation.answers.obesity ? 'Sí' : 'No'}</div>
              <div><span className="font-medium">Ejercicio:</span> {evaluation.answers.exercise ? 'Sí' : 'No'}</div>
          </div>
      </div>
    )
}