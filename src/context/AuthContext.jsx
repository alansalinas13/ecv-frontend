import {createContext, useContext, useEffect, useMemo, useState} from 'react'
import api from '../api/axios'
import {clearAuth, getToken, getUser, setToken, setUser} from '../utils/auth'

const AuthContext = createContext(null)

export function AuthProvider({children}) {
    const [token, setTokenState] = useState(getToken())
    const [user, setUserState] = useState(getUser())
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const bootstrapAuth = async () => {
            const storedToken = getToken()

            if (!storedToken) {
                setLoading(false)
                return
            }

            try {
                const response = await api.get('/auth/me')
                setUser(response.data)
                setUserState(response.data)
            }
            catch {
                clearAuth()
                setTokenState(null)
                setUserState(null)
            }
            finally {
                setLoading(false)
            }
        }

        bootstrapAuth()
    }, [])

    const login = async (credentials) => {
        const response = await api.post('/auth/login', credentials)
        const {token: newToken, user: loggedUser} = response.data

        setToken(newToken)
        setUser(loggedUser)

        setTokenState(newToken)
        setUserState(loggedUser)

        return response.data
    }

    const register = async (payload) => {
        const response = await api.post('/auth/register', payload)
        const {token: newToken, user: registeredUser} = response.data

        setToken(newToken)
        setUser(registeredUser)

        setTokenState(newToken)
        setUserState(registeredUser)

        return response.data
    }

    const logout = async () => {
        try {
            await api.post('/auth/logout')
        }
        catch {
            // si falla el backend, igual limpiamos sesión local
        }
        finally {
            clearAuth()
            setTokenState(null)
            setUserState(null)
        }
    }

    const value = useMemo(
      () => ({
          token,
          user,
          loading,
          isAuthenticated: !!token,
          login,
          register,
          logout,
      }),
      [token, user, loading]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider')
    }

    return context
}