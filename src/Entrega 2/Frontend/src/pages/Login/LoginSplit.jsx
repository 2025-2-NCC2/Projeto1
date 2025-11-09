import React from 'react'
import { Link } from 'react-router-dom'

export default function LoginSplit() {
  return (
    <div className="split-layout container">
      <div className="left">
        <div className="card auth-card">
          <h2 className="h4 mb-3">Login</h2>

          <form>
            <div className="mb-3 form-floating">
              <input type="email" className="form-control" id="email" placeholder="Email" />
              <label htmlFor="email">Email Address</label>
            </div>

            <div className="mb-3 form-floating">
              <input type="password" className="form-control" id="password" placeholder="Password" />
              <label htmlFor="password">Password</label>
            </div>

            <div className="mb-3 form-check">
              <input type="checkbox" className="form-check-input" id="remember" />
              <label className="form-check-label" htmlFor="remember">Remember Me</label>
            </div>

            <button type="submit" className="btn btn-primary w-100">Log In</button>

            <div className="mt-3 text-center">
              <Link to="/cadastro">Don't have an account? Sign up</Link>
            </div>
          </form>
        </div>
      </div>

      <div className="right">
        <div className="illustration">
          <img src="/public/6422200.png" alt="illustration" style={{ width: '100%', display: 'block' }} />
        </div>
      </div>
    </div>
  )
}
