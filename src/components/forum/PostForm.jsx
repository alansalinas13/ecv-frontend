import {useState} from 'react'

export default function PostForm({onSubmit, submitting, initialValues, submitLabel}) {
    const [form, setForm] = useState(
      initialValues || {
          title: '',
          content: '',
      }
    )

    const handleChange = (e) => {
        const {name, value} = e.target
        setForm((prev) => ({...prev, [name]: value}))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(form, () => {
            setForm({title: '', content: ''})
        })
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
          <div>
              <label className="block mb-1 text-sm font-medium text-slate-700">
                  Título
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
          </div>

          <div>
              <label className="block mb-1 text-sm font-medium text-slate-700">
                  Contenido
              </label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                rows={4}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
              {submitting ? 'Guardando...' : submitLabel}
          </button>
      </form>
    )
}