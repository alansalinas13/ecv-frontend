import {useEffect, useState} from 'react'
import {Link, useParams} from 'react-router-dom'
import api from '../api/axios'
import AppLayout from '../components/layout/AppLayout'
import PostCard from '../components/forum/PostCard'
import {useAuth} from '../context/AuthContext'

export default function ForumDetail() {
    const {id} = useParams()
    const {user} = useAuth()

    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [submittingPost, setSubmittingPost] = useState(false)
    const [submittingComment, setSubmittingComment] = useState(false)

    const fetchPost = async () => {
        try {
            setError('')
            const response = await api.get(`/posts/${id}`)
            setPost(response.data)
        }
        catch (err) {
            setError(err.response?.data?.message || 'No se pudo cargar el post')
        }
    }

    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true)
                await fetchPost()
            }
            finally {
                setLoading(false)
            }
        }

        init()
    }, [id])

    const handleUpdatePost = async (postId, data) => {
        setSubmittingPost(true)
        setError('')
        setSuccess('')

        try {
            await api.put(`/posts/${postId}`, data)
            setSuccess('Post actualizado correctamente')
            await fetchPost()
        }
        catch (err) {
            const firstValidationError = err.response?.data?.errors
              ? Object.values(err.response.data.errors)[0]?.[0]
              : null

            setError(firstValidationError || err.response?.data?.message || 'No se pudo actualizar el post')
        }
        finally {
            setSubmittingPost(false)
        }
    }

    const handleDeletePost = async (postId) => {
        const confirmed = window.confirm('¿Seguro que deseas eliminar este post?')
        if (!confirmed) {
            return
        }

        setError('')
        setSuccess('')

        try {
            await api.delete(`/posts/${postId}`)
            window.location.href = '/forum'
        }
        catch (err) {
            setError(err.response?.data?.message || 'No se pudo eliminar el post')
        }
    }

    const handleCreateComment = async (postId, content, resetForm) => {
        setSubmittingComment(true)
        setError('')
        setSuccess('')

        try {
            await api.post(`/posts/${postId}/comments`, {content})
            setSuccess('Comentario agregado correctamente')
            resetForm()
            await fetchPost()
        }
        catch (err) {
            const firstValidationError = err.response?.data?.errors
              ? Object.values(err.response.data.errors)[0]?.[0]
              : null

            setError(firstValidationError || err.response?.data?.message || 'No se pudo agregar el comentario')
        }
        finally {
            setSubmittingComment(false)
        }
    }

    const handleDeleteComment = async (commentId) => {
        const confirmed = window.confirm('¿Seguro que deseas eliminar este comentario?')
        if (!confirmed) {
            return
        }

        setError('')
        setSuccess('')

        try {
            await api.delete(`/comments/${commentId}`)
            setSuccess('Comentario eliminado correctamente')
            await fetchPost()
        }
        catch (err) {
            setError(err.response?.data?.message || 'No se pudo eliminar el comentario')
        }
    }

    return (
      <AppLayout>
          <div className="space-y-6">
              <div>
                  <Link to="/forum" className="text-sm text-slate-600 underline">
                      ? Volver al foro
                  </Link>
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

              {loading ? (
                <div className="bg-white rounded-xl shadow-md p-6">
                    <p className="text-slate-600">Cargando post...</p>
                </div>
              ) : post ? (
                <PostCard
                  post={post}
                  currentUser={user}
                  onUpdatePost={handleUpdatePost}
                  onDeletePost={handleDeletePost}
                  onCreateComment={handleCreateComment}
                  onDeleteComment={handleDeleteComment}
                  submittingPost={submittingPost}
                  submittingComment={submittingComment}
                />
              ) : (
                <div className="bg-white rounded-xl shadow-md p-6">
                    <p className="text-slate-600">Post no encontrado.</p>
                </div>
              )}
          </div>
      </AppLayout>
    )
}