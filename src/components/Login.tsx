import { useState } from 'react'
import { toast } from 'sonner'
import { authAPI } from '../api'
import { LogIn } from 'lucide-react'

interface LoginProps {
  onLogin: (token: string, user: any) => void
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      setLoading(true)
      const response = await authAPI.login(email, password)

      if (response.user.role !== 'admin') {
        toast.error('Access denied. Admin privileges required.')
        return
      }

      onLogin(response.token, response.user)
    } catch (error: any) {
      toast.error(error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">

      <div className="admin-login-form">
        <div className="admin-logo-cart text-center mb-4">

          <img
            src="https://i.imgur.com/HDmpMTk.jpg"
            alt="Afiya Zone Logo"
            className="img-fluid admin-logo"
          />
          <h2 className="card-title fw-bold mb-2">Admin Panel</h2>
          <p className="text-muted small">Afiya Zone Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-medium">
              Username
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              disabled={loading}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="login-btn"
          >
            {loading ? (
              <>
                <span>Logging...</span>
              </>
            ) : (
              <>
                <span>Login</span>
              </>
            )}
          </button>
        </form>

      </div>

    </div>
  )
}
