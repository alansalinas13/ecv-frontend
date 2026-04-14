import {useState} from 'react'
import PostForm from './PostForm'
import CommentForm from './CommentForm'

export default function PostCard({
    post,
    currentUser,
    onUpdatePost,
    onDeletePost,
    onCreateComment,
    onDeleteComment,
    submittingComment,
    submittingPost,
}) {
    const [editing, setEditing] = useState(false)

    const isOwner = currentUser?.id === post.user_id

    const handleUpdate = async (data) => {
        await onUpdatePost(post.id, data)
        setEditing(false)
    }

    return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200 space-y-5">
          {!editing ? (
            <>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-800">
                            {post.title}
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Por {post.user?.name} · {post.user?.email}
                        </p>
                    </div>

                    {isOwner && (
                      <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setEditing(true)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-md text-sm"
                          >
                              Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeletePost(post.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm"
                          >
                              Eliminar
                          </button>
                      </div>
                    )}
                </div>

                <p className="text-slate-700 whitespace-pre-line">{post.content}</p>
            </>
          ) : (
            <div>
                <h3 className="text-lg font-semibold mb-3">Editar post</h3>
                <PostForm
                  initialValues={{
                      title: post.title,
                      content: post.content,
                  }}
                  onSubmit={handleUpdate}
                  submitting={submittingPost}
                  submitLabel="Actualizar post"
                />

                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="mt-3 text-sm text-slate-600 underline"
                >
                    Cancelar edición
                </button>
            </div>
          )}

          <div className="border-t pt-4">
              <h3 className="font-semibold text-slate-800 mb-3">Comentarios</h3>

              <div className="space-y-3">
                  {post.comments?.length > 0 ? (
                    post.comments.map((comment) => {
                        const isCommentOwner = currentUser?.id === comment.user_id

                        return (
                          <div
                            key={comment.id}
                            className="bg-slate-50 rounded-lg p-3 border border-slate-200"
                          >
                              <div className="flex items-start justify-between gap-3">
                                  <div>
                                      <p className="text-sm font-medium text-slate-800">
                                          {comment.user?.name}
                                      </p>
                                      <p className="text-xs text-slate-500">{comment.user?.email}</p>
                                  </div>

                                  {isCommentOwner && (
                                    <button
                                      type="button"
                                      onClick={() => onDeleteComment(comment.id)}
                                      className="text-sm text-red-600 hover:text-red-700"
                                    >
                                        Eliminar
                                    </button>
                                  )}
                              </div>

                              <p className="text-slate-700 mt-2 whitespace-pre-line">
                                  {comment.content}
                              </p>
                          </div>
                        )
                    })
                  ) : (
                    <p className="text-sm text-slate-500">Aún no hay comentarios.</p>
                  )}
              </div>

              <CommentForm
                onSubmit={(content, reset) => onCreateComment(post.id, content, reset)}
                submitting={submittingComment}
              />
          </div>
      </div>
    )
}