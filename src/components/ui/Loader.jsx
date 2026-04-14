export default function Loader({text = 'Cargando...'}) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <div className="animate-pulse text-slate-600">{text}</div>
      </div>
    )
}