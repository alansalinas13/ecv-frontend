import {useState} from 'react'

export default function HospitalCard({
    hospital,
    isAdmin = false,
    onEdit,
    onDelete,
}) {
    const [copied, setCopied] = useState(false)

    const handleCopyAddress = async () => {
        try {
            await navigator.clipboard.writeText(hospital.address)
            setCopied(true)

            setTimeout(() => {
                setCopied(false)
            }, 2000)
        }
        catch {
            alert('No se pudo copiar la dirección')
        }
    }

    const googleMapsUrl = `https://www.google.com/maps?q=${hospital.lat},${hospital.lng}`

    return (
      <div className="bg-white rounded-xl shadow-md p-5 border border-slate-200">
          <div className="space-y-3">
              <h2 className="text-lg font-semibold text-slate-800">
                  {hospital.name}
              </h2>

              <div className="text-sm">
                  <span className="font-medium text-slate-700">Ciudad: </span>
                  <span className="text-slate-600">
            {hospital.city?.name || 'No definida'}
          </span>
              </div>

              <p className="text-slate-600">
                  {hospital.address}
              </p>

              <div className="text-sm text-slate-500 space-y-1">
                  <div>Latitud: {hospital.lat}</div>
                  <div>Longitud: {hospital.lng}</div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-lg text-sm"
                  >
                      {copied ? 'Dirección copiada' : 'Copiar dirección'}
                  </button>

                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm"
                  >
                      Abrir en Maps
                  </a>

                  {isAdmin && (
                    <>
                        <button
                          type="button"
                          onClick={() => onEdit(hospital)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg text-sm"
                        >
                            Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete(hospital.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm"
                        >
                            Eliminar
                        </button>
                    </>
                  )}
              </div>
          </div>
      </div>
    )
}