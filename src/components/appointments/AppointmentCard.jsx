const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-blue-100 text-blue-700',
}

const statusLabels = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    cancelled: 'Cancelada',
    completed: 'Finalizada',
}

export default function AppointmentCard({
    appointment,
    currentUser,
    onStatusChange,
    changingStatus,
}) {
    const isDoctor = currentUser?.role === 2

    return (
      <div className="bg-white rounded-xl shadow-md p-5 border border-slate-200 space-y-4">
          <div className="flex items-start justify-between gap-3">
              <div>
                  <h2 className="text-lg font-semibold text-slate-800">
                      Cita #{appointment.id}
                  </h2>
                  <p className="text-sm text-slate-500">
                      {new Date(appointment.appointment_date).toLocaleString()}
                  </p>
              </div>

              <span
                className={`text-xs font-medium px-3 py-1 rounded-full ${
                  statusStyles[appointment.status] || 'bg-slate-100 text-slate-700'
                }`}
              >
          {statusLabels[appointment.status] || appointment.status}
        </span>
          </div>

          <div className="space-y-2 text-sm text-slate-700">
              {appointment.user && (
                <div>
                    <span className="font-medium">Paciente: </span>
                    {appointment.user.name} ({appointment.user.email})
                </div>
              )}

              {appointment.doctor && (
                <div>
                    <span className="font-medium">Doctor: </span>
                    {appointment.doctor.user?.name || 'No disponible'}
                </div>
              )}
          </div>

          {isDoctor && (
            <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  disabled={changingStatus}
                  onClick={() => onStatusChange(appointment.id, 'confirmed')}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm disabled:opacity-50"
                >
                    Confirmar
                </button>

                <button
                  type="button"
                  disabled={changingStatus}
                  onClick={() => onStatusChange(appointment.id, 'completed')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm disabled:opacity-50"
                >
                    Finalizar
                </button>

                <button
                  type="button"
                  disabled={changingStatus}
                  onClick={() => onStatusChange(appointment.id, 'cancelled')}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm disabled:opacity-50"
                >
                    Cancelar
                </button>

                <button
                  type="button"
                  disabled={changingStatus}
                  onClick={() => onStatusChange(appointment.id, 'pending')}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-md text-sm disabled:opacity-50"
                >
                    Pendiente
                </button>
            </div>
          )}
      </div>
    )
}