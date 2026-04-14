export default function Confirm({message, onConfirm, onCancel}) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md space-y-4 z-[10000]">
              <p className="text-slate-700">{message}</p>

              <div className="flex justify-end gap-2">
                  <button
                    onClick={onCancel}
                    className="border px-4 py-2 rounded-lg"
                  >
                      Cancelar
                  </button>

                  <button
                    onClick={onConfirm}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                      Confirmar
                  </button>
              </div>
          </div>
      </div>
    )
}