import {useEffect, useMemo, useState} from 'react'
import api from '../api/axios'
import AppLayout from '../components/layout/AppLayout'
import PostForm from '../components/forum/PostForm'
import PostListItem from '../components/forum/PostListItem'
import Alert from '../components/ui/Alert'
import Loader from '../components/ui/Loader'

export default function Forum() {
    const [posts, setPosts] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [submittingPost, setSubmittingPost] = useState(false)

    const fetchPosts = async () => {
        try {
            setError('')
            const response = await api.get('/posts')
            setPosts(response.data)
        }
        catch (err) {
            setError(err.response?.data?.message || 'No se pudieron cargar los posts')
        }
    }

    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true)
                await fetchPosts()
            }
            finally {
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
        }
        catch (err) {
            const firstValidationError = err.response?.data?.errors
              ? Object.values(err.response.data.errors)[0]?.[0]
              : null

            setError(firstValidationError || err.response?.data?.message || 'No se pudo crear el post')
        }
        finally {
            setSubmittingPost(false)
        }
    }

    const filteredPosts = useMemo(() => {
        const term = search.trim().toLowerCase()

        if (!term) {
            return posts
        }

        return posts.filter((post) =>
          post.title.toLowerCase().includes(term)
        )
    }, [posts, search])

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

              <div className="bg-white rounded-xl shadow-md p-6">
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                      Buscar por título
                  </label>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Ej: hipertensión, dieta, ejercicio..."
                    className="w-full border rounded-lg px-3 py-2"
                  />
              </div>

              <Alert type="error" message={error}/>
              <Alert type="success" message={success}/>

              <div className="space-y-4">
                  {loading ? (
                    <Loader text="Cargando posts..."/>
                  ) : posts.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <p className="text-slate-600">No hay publicaciones todavía.</p>
                    </div>
                  ) : filteredPosts.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <p className="text-slate-600">
                            No se encontraron posts con ese título.
                        </p>
                    </div>
                  ) : (
                    filteredPosts.map((post) => (
                      <PostListItem key={post.id} post={post}/>
                    ))
                  )}
              </div>
          </div>
      </AppLayout>
    )
}