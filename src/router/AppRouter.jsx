import {BrowserRouter, Navigate, Routes, Route} from 'react-router-dom'
import ProtectedRoute from '../components/auth/ProtectedRoute'
import {useAuth} from '../context/AuthContext'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import Doctors from '../pages/Doctors'
import Appointments from '../pages/Appointments'
import Forum from '../pages/Forum'
import Evaluation from '../pages/Evaluation'
import HospitalsMap from '../pages/HospitalsMap'
import ForumDetail from '../pages/ForumDetail'
import RoleRoute from '../components/auth/RoleRoute'
import Loader from '../components/ui/Loader'

function GuestRoute({children}) {
    const {isAuthenticated, loading} = useAuth()

    {
        loading && <Loader/>
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace/>
    }

    return children
}

export default function AppRouter() {
    return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Home/>}/>

              <Route
                path="/login"
                element={
                    <GuestRoute>
                        <Login/>
                    </GuestRoute>
                }
              />

              <Route
                path="/register"
                element={
                    <GuestRoute>
                        <Register/>
                    </GuestRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard/>
                    </ProtectedRoute>
                }
              />

              <Route
                path="/doctors"
                element={
                    <ProtectedRoute>
                        <Doctors/>
                    </ProtectedRoute>
                }
              />

              <Route
                path="/appointments"
                element={
                    <ProtectedRoute>
                        <Appointments/>
                    </ProtectedRoute>
                }
              />

              <Route
                path="/forum"
                element={
                    <ProtectedRoute>
                        <Forum/>
                    </ProtectedRoute>
                }
              />

              <Route
                path="/evaluation"
                element={
                    <ProtectedRoute>
                        <Evaluation/>
                    </ProtectedRoute>
                }
              />

              <Route
                path="/hospitals"
                element={
                    <ProtectedRoute>
                        <HospitalsMap/>
                    </ProtectedRoute>
                }
              />

              <Route
                path="/forum/:id"
                element={
                    <ProtectedRoute>
                        <ForumDetail/>
                    </ProtectedRoute>
                }
              />

              <Route
                path="/evaluation"
                element={
                    <RoleRoute allowedRoles={[3]}>
                        <Evaluation/>
                    </RoleRoute>
                }
              />

          </Routes>
      </BrowserRouter>
    )
}