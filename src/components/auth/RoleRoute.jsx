import {Navigate} from 'react-router-dom'
import {useAuth} from '../../context/AuthContext'
import Loader from "../ui/Loader.jsx";

export default function RoleRoute({allowedRoles, children}) {
    const {user, loading, isAuthenticated} = useAuth()

    {
        loading && <Loader/>
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace/>
    }

    if (!allowedRoles.includes(user?.role)) {
        return <Navigate to="/dashboard" replace/>
    }

    return children
}