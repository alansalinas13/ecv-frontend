import {Link} from 'react-router-dom'

export default function PostListItem({post}) {
    return (
      <div
        className="bg-white rounded-xl shadow-md p-5 border border-slate-200 flex items-center justify-between gap-4">
          <div>
              <h2 className="text-lg font-semibold text-slate-800">
                  {post.title}
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                  Por {post.user?.name} · {post.user?.email}
              </p>
          </div>

          <Link
            to={`/forum/${post.id}`}
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm"
          >
              Ver
          </Link>
      </div>
    )
}