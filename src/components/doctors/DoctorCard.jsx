export default function DoctorCard({
    doctor,
    canEdit = false,
    canDelete = false,
    onEdit,
    onDelete,
}) {
    return (
      <div className="bg-white rounded-xl shadow-md p-5 border border-slate-200">
          <div className="space-y-3">
              <div>
                  <h2 className="text-xl font-semibold text-slate-800">
                      {doctor.user?.name}
                  </h2>

                  <div
                    className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full mt-2">
                      Doctor
                  </div>
              </div>

              <p className="text-sm text-slate-500">
                  {doctor.user?.email}
              </p>

              <div>
                  <span className="font-medium text-slate-700">Especialidad: </span>
                  <span className="text-slate-600">{doctor.specialty}</span>
              </div>

              <div>
                  <span className="font-medium text-slate-700">Ciudad: </span>
                  <span className="text-slate-600">{doctor.city?.name || 'No definida'}</span>
              </div>

              <div>
                  <span className="font-medium text-slate-700">Hospital: </span>
                  <span className="text-slate-600">{doctor.hospital?.name || 'No definido'}</span>
              </div>

              <div>
                  <span className="font-medium text-slate-700">Horario: </span>
                  <span className="text-slate-600">
            {doctor.start_time && doctor.end_time
              ? `${doctor.start_time} a ${doctor.end_time}`
              : 'No definido'}
          </span>
              </div>

              <div>
                  <span className="font-medium text-slate-700">Teléfono: </span>
                  <span className="text-slate-600">{doctor.phone || 'No disponible'}</span>
              </div>

              <div>
                  <span className="font-medium text-slate-700">Descripción: </span>
                  <p className="text-slate-600 mt-1">
                      {doctor.description || 'Sin descripción'}
                  </p>
              </div>

              {(canEdit || canDelete) && (
                <div className="flex flex-wrap gap-2 pt-2">
                    {canEdit && (
                      <button
                        type="button"
                        onClick={() => onEdit(doctor)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg text-sm"
                      >
                          Editar
                      </button>
                    )}

                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(doctor.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm"
                      >
                          Eliminar
                      </button>
                    )}
                </div>
              )}
          </div>
      </div>
    )
}