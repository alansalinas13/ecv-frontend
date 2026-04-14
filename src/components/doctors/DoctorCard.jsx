export default function DoctorCard({doctor}) {
    return (
      <div className="bg-white rounded-xl shadow-md p-5 border border-slate-200">
          <div className="space-y-2">
              <h2 className="text-xl font-semibold text-slate-800">
                  {doctor.user?.name}
              </h2>
              <div className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
                  Doctor
              </div>
              <p className="text-sm text-slate-500">
                  {doctor.user?.email}
              </p>

              <div>
                  <span className="font-medium text-slate-700">Especialidad: </span>
                  <span className="text-slate-600">{doctor.specialty}</span>
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
          </div>
      </div>
    )
}