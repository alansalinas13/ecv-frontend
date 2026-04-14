import {useEffect, useState} from 'react'
import {Link, useParams} from 'react-router-dom'
import api from '../api/axios'
import AppLayout from '../components/layout/AppLayout'
import PostCard from '../components/forum/PostCard'
import {useAuth} from '../context/AuthContext'
import Alert from '../components/ui/Alert'
import Loader from '../components/ui/Loader'
import Confirm from '../components/ui/Confirm'

export default function ForumDetail() {
    const {id} = useParams()
    const {user} = useAuth()

    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [submittingPost, setSubmittingPost] = useState(false)
    const [submittingComment, setSubmittingComment] = useState(false)

    const [confirmOpen, setConfirmOpen] = useState(false)
    const [confirmType, setConfirmType] = useState(null)
    const [selectedId, setSelectedId] = useState(null)

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
            setError('No se pudo actualizar el post')
        }
        finally {
            setSubmittingPost(false)
        }
    }

    const openDeletePostConfirm = (postId) => {
        setConfirmType('post')
        setSelectedId(postId)
        setConfirmOpen(true)
    }

    const openDeleteCommentConfirm = (commentId) => {
        setConfirmType('comment')
        setSelectedId(commentId)
        setConfirmOpen(true)
    }

    const closeConfirm = () => {
        setConfirmOpen(false)
        setSelectedId(null)
        setConfirmType(null)
    }

    const confirmAction = async () => {
        if (!selectedId) {
            return
        }

        setError('')
        setSuccess('')

        try {
            if (confirmType === 'post') {
                await api.delete(`/posts/${selectedId}`)
                window.location.href = '/forum'
                return
            }

            if (confirmType === 'comment') {
                await api.delete(`/comments/${selectedId}`)
                setSuccess('Comentario eliminado correctamente')
                await fetchPost()
            }

            closeConfirm()
        }
        catch (err) {
            setError('No se pudo realizar la acción')
            closeConfirm()
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
        catch {
            setError('No se pudo agregar el comentario')
        }
        finally {
            setSubmittingComment(false)
        }
    }

    return (
      <AppLayout>
          <div className="space-y-6">
              <Link to="/forum" className="text-sm underline">
                  ← Volver
              </Link>

              <Alert type="error" message={error}/>
              <Alert type="success" message={success}/>

              {loading ? (
                <Loader text="Cargando post..."/>
              ) : post ? (
                <PostCard
                  post={post}
                  currentUser={user}
                  onUpdatePost={handleUpdatePost}
                  onDeletePost={openDeletePostConfirm}
                  onCreateComment={handleCreateComment}
                  onDeleteComment={openDeleteCommentConfirm}
                  submittingPost={submittingPost}
                  submittingComment={submittingComment}
                />
              ) : (
                <div className="bg-white p-6 rounded-xl">
                    Post no encontrado
                </div>
              )}

              {confirmOpen && (
                <Confirm
                  message={
                      confirmType === 'post'
                        ? '¿Eliminar este post?'
                        : '¿Eliminar este comentario?'
                  }
                  onConfirm={confirmAction}
                  onCancel={closeConfirm}
                />
              )}
          </div>
      </AppLayout>
    )
}