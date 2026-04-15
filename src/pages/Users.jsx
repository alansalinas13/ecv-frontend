import {useEffect, useMemo, useState} from 'react'
import api from '../api/axios'
import AppLayout from '../components/layout/AppLayout'
import UserForm from '../components/users/UserForm'
import UserCard from '../components/users/UserCard'
import Alert from '../components/ui/Alert'
import Loader from '../components/ui/Loader'
import Confirm from '../components/ui/Confirm'
import {useAuth} from '../context/AuthContext'

export default function Users() {
    const {user: currentUser} = useAuth()

    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState('all')
    const [editingUser, setEditingUser] = useState(null)

    const [confirmOpen, setConfirmOpen] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState(null)

    const fetchUsers = async () => {
        try {
            setError('')
            const response = await api.get('/users')
            setUsers(response.data)
        }
        catch (err) {
            setError(err.response?.data?.message || 'No se pudieron cargar los usuarios')
        }
    }

    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true)
                await fetchUsers()
            }
            finally {
                setLoading(false)
            }
        }

        init()
    }, [])

    const filteredUsers = useMemo(() => {
        const term = search.trim().toLowerCase()

        return users.filter((user) => {
            const matchesSearch =
              user.name?.toLowerCase().includes(term) ||
              user.email?.toLowerCase().includes(term)

            const matchesRole =
              roleFilter === 'all' || String(user.role) === roleFilter

            return matchesSearch && matchesRole
        })
    }, [users, search, roleFilter])

    const handleCreateUser = async (data, resetForm) => {
        setSubmitting(true)
        setError('')
        setSuccess('')

        try {
            await api.post('/users', {
                ...data,
                role: Number(data.role),
            })

            setSuccess('Usuario creado correctamente')
            resetForm()
            await fetchUsers()
        }
        catch (err) {
            const firstValidationError = err.response?.data?.errors
              ? Object.values(err.response.data.errors)[0]?.[0]
              : null

            setError(firstValidationError || err.response?.data?.message || 'No se pudo crear el usuario')
        }
        finally {
            setSubmitting(false)
        }
    }

    const handleUpdateUser = async (data) => {
        if (!editingUser) {
            return
        }

        setSubmitting(true)
        setError('')
        setSuccess('')

        try {
            const payload = {
                name: data.name,
                email: data.email,
                phone: data.phone,
                role: Number(data.role),
            }

            if (data.password) {
                payload.password = data.password
                payload.password_confirmation = data.password_confirmation
            }

            await api.put(`/users/${editingUser.id}`, payload)

            setSuccess('Usuario actualizado correctamente')
            setEditingUser(null)
            await fetchUsers()
        }
        catch (err) {
            const firstValidationError = err.response?.data?.errors
              ? Object.values(err.response.data.errors)[0]?.[0]
              : null

            setError(firstValidationError || err.response?.data?.message || 'No se pudo actualizar el usuario')
        }
        finally {
            setSubmitting(false)
        }
    }

    const openDeleteConfirm = (userId) => {
        setSelectedUserId(userId)
        setConfirmOpen(true)
    }

    const closeDeleteConfirm = () => {
        setConfirmOpen(false)
        setSelectedUserId(null)
    }

    const confirmDeleteUser = async () => {
        if (!selectedUserId) {
            return
        }

        setError('')
        setSuccess('')

        try {
            await api.delete(`/users/${selectedUserId}`)
            setSuccess('Usuario eliminado correctamente')

            if (editingUser?.id === selectedUserId) {
                setEditingUser(null)
            }

            closeDeleteConfirm()
            await fetchUsers()
        }
        catch (err) {
            setError(err.response?.data?.message || 'No se pudo eliminar el usuario')
            closeDeleteConfirm()
        }
    }

    return (
      <AppLayout>
          <div className="space-y-6">
              <div>
                  <h1 className="text-2xl font-bold text-slate-800">Usuarios</h1>
                  <p className="text-slate-600 mt-1">
                      Gestión administrativa de usuarios y roles del sistema.
                  </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-lg font-semibold mb-4">
                      {editingUser ? 'Editar usuario' : 'Crear usuario'}
                  </h2>

                  <UserForm
                    initialValues={editingUser}
                    onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
                    submitting={submitting}
                    submitLabel={editingUser ? 'Actualizar usuario' : 'Crear usuario'}
                    onCancel={editingUser ? () => setEditingUser(null) : null}
                  />
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 grid md:grid-cols-2 gap-4">
                  <div>
                      <label className="block mb-2 text-sm font-medium text-slate-700">
                          Buscar por nombre o email
                      </label>
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Ej: juan, admin@test.com..."
                        className="w-full border rounded-lg px-3 py-2"
                      />
                  </div>

                  <div>
                      <label className="block mb-2 text-sm font-medium text-slate-700">
                          Filtrar por rol
                      </label>
                      <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2"
                      >
                          <option value="all">Todos los roles</option>
                          <option value="1">Admin</option>
                          <option value="2">Doctor</option>
                          <option value="3">Usuario</option>
                      </select>
                  </div>
              </div>

              <Alert type="error" message={error}/>
              <Alert type="success" message={success}/>

              {loading ? (
                <Loader text="Cargando usuarios..."/>
              ) : filteredUsers.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-6">
                    <p className="text-slate-600">
                        {users.length === 0
                          ? 'No hay usuarios registrados.'
                          : 'No se encontraron usuarios con ese criterio.'}
                    </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredUsers.map((user) => (
                      <UserCard
                        key={user.id}
                        user={user}
                        onEdit={setEditingUser}
                        onDelete={openDeleteConfirm}
                        disableDelete={currentUser?.id === user.id}
                      />
                    ))}
                </div>
              )}

              {confirmOpen && (
                <Confirm
                  message="¿Seguro que deseas eliminar este usuario?"
                  onConfirm={confirmDeleteUser}
                  onCancel={closeDeleteConfirm}
                />
              )}
          </div>
      </AppLayout>
    )
}