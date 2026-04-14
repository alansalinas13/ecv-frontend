import {BrowserRouter, Routes, Route} from 'react-router-dom'
import ProtectedRoute from '../components/auth/ProtectedRoute'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import Doctors from '../pages/Doctors'
import Appointments from '../pages/Appointments'
import Forum from '../pages/Forum'
import Evaluation from '../pages/Evaluation'
import HospitalsMap from '../pages/HospitalsMap'

export default function AppRouter() {
    return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/login" element={<Login/>}/>
              <Route path="/register" element={<Register/>}/>

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
          </Routes>
      </BrowserRouter>
    )
}