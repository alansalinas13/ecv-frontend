const roleLabels = {
    1: 'Admin',
    2: 'Doctor',
    3: 'Usuario',
}

const roleStyles = {
    1: 'bg-purple-100 text-purple-700',
    2: 'bg-blue-100 text-blue-700',
    3: 'bg-slate-100 text-slate-700',
}

export default function UserCard({
    user,
    onEdit,
    onDelete,
    disableDelete = false,
}) {
    return (
      <div className="bg-white rounded-xl shadow-md p-5 border border-slate-200">
          <div className="space-y-3">
              <div>
                  <h2 className="text-lg font-semibold text-slate-800">
                      {user.name}
                  </h2>

                  <div
                    className={`inline-block text-xs font-medium px-2 py-1 rounded-full mt-2 ${roleStyles[user.role] || roleStyles[3]}`}>
                      {roleLabels[user.role] || 'Sin rol'}
                  </div>
              </div>

              <p className="text-sm text-slate-500">
                  {user.email}
              </p>
              <p className="text-sm text-slate-500">
                  {user.phone || 'Sin teléfono'}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => onEdit(user)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg text-sm"
                  >
                      Editar
                  </button>

                  <button
                    type="button"
                    disabled={disableDelete}
                    onClick={() => onDelete(user.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm disabled:opacity-50"
                  >
                      Eliminar
                  </button>
              </div>

              {disableDelete && (
                <p className="text-xs text-slate-500">
                    No puedes eliminar tu propio usuario.
                </p>
              )}
          </div>
      </div>
    )
}