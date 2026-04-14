import {useState} from 'react'

export default function CommentForm({onSubmit, submitting}) {
    const [content, setContent] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(content, () => setContent(''))
    }

    return (
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          placeholder="Escribe un comentario..."
          className="w-full border rounded-lg px-3 py-2"
          required
        />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
              {submitting ? 'Comentando...' : 'Agregar comentario'}
          </button>
      </form>
    )
}