import { useState, useEffect } from 'react'
import { Toaster, toast } from 'sonner'
import Login from './components/Login'
import Dashboard from './components/Dashboard'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [adminUser, setAdminUser] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const handleLogin = (token: string, user: any) => {
    localStorage.setItem('adminToken', token)
    setIsAuthenticated(true)
    setAdminUser(user)
    toast.success('Login successful!')
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setIsAuthenticated(false)
    setAdminUser(null)
    toast.success('Logged out successfully')
  }

  if (loading) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="mb-3">
            <img
              src="/assets/icon.png"
              alt="Afiya Zone Logo"
              className="img-fluid"
              style={{ maxHeight: '60px' }}
            />
          </div>
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="fw-medium text-primary">Loading Admin Panel...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {isAuthenticated ? (
        <Dashboard onLogout={handleLogout} adminUser={adminUser} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
      <Toaster position="top-right" richColors />
    </>
  )
}

export default App