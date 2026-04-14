import { useEffect, useState } from 'react'
import api from '../api/axios'
import AppLayout from '../components/layout/AppLayout'
import PostForm from '../components/forum/PostForm'
import PostListItem from '../components/forum/PostListItem'

export default function Forum() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [submittingPost, setSubmittingPost] = useState(false)

    const fetchPosts = async () => {
        try {
            setError('')
            const response = await api.get('/posts')
            setPosts(response.data)
        } catch (err) {
            setError(err.response?.data?.message || 'No se pudieron cargar los posts')
        }
    }

    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true)
                await fetchPosts()
            } finally {
                setLoading(false)
            }
        }

        init()
    }, [])

    const handleCreatePost = async (data, resetForm) => {
        setSubmittingPost(true)
        setError('')
        setSuccess('')

        try {
            await api.post('/posts', data)
            setSuccess('Post creado correctamente')
            resetForm()
            await fetchPosts()
        } catch (err) {
            const firstValidationError = err.response?.data?.errors
              ? Object.values(err.response.data.errors)[0]?.[0]
              : null

            setError(firstValidationError || err.response?.data?.message || 'No se pudo crear el post')
        } finally {
            setSubmittingPost(false)
        }
    }

    return (
      <AppLayout>
          <div className="space-y-6">
              <div>
                  <h1 className="text-2xl font-bold text-slate-800">Foro</h1>
                  <p className="text-slate-600 mt-1">
                      Explora publicaciones de la comunidad y entra al detalle de cada tema.
                  </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-lg font-semibold mb-4">Crear nuevo post</h2>
                  <PostForm
                    onSubmit={handleCreatePost}
                    submitting={submittingPost}
                    submitLabel="Publicar"
                  />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
                    {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4">
                    {success}
                </div>
              )}

              <div className="space-y-4">
                  {loading ? (
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <p className="text-slate-600">Cargando posts...</p>
                    </div>
                  ) : posts.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <p className="text-slate-600">No hay publicaciones todavía.</p>
                    </div>
                  ) : (
                    posts.map((post) => (
                      <PostListItem key={post.id} post={post} />
                    ))
                  )}
              </div>
          </div>
      </AppLayout>
    )
}