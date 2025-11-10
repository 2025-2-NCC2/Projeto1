import React from 'react'
import { Link } from 'react-router-dom'

export default function LoginSplit() {
  return (
    <div className="split-layout d-flex flex-column flex-md-row min-vh-100" style={{
      background: "linear-gradient(135deg, #e8f5e9 0%, #3a533b 35%, #b2dfdb 100%)"
    }}>
      <div className="left d-flex justify-content-center align-items-center p-4 p-md-5 w-100 w-md-50">
        <div className="card auth-card p-4 rounded-4 shadow-lg w-100" style={{maxWidth: '400px'}}>
          <h2 className="h4 mb-3 fw-bold">Login</h2>

          <form className="d-flex flex-column gap-3">
            <div className="form-floating">
              <input type="email" className="form-control p-2" id="email" placeholder="Email" />
              <label htmlFor="email">E-mail</label>
            </div>

            <div className="form-floating">
              <input type="password" className="form-control p-2" id="password" placeholder="Senha" />
              <label htmlFor="password">Senha</label>
            </div>

            <div className="form-check">
              <input type="checkbox" className="form-check-input" id="remember" />
              <label className="form-check-label" htmlFor="remember">Lembrar-me</label>
            </div>

            <button type="submit" className="btn btn-success w-100 fw-semibold py-2">Entrar</button>

            <div className="mt-3 text-center">
              <small><Link to="/cadastro" className="text-success text-decoration-none">Não tem conta? Cadastre-se</Link></small>
            </div>
          </form>
        </div>
      </div>

      <div className="right d-none d-md-flex justify-content-center align-items-center p-5 w-md-50" style={{
        background: "linear-gradient(135deg, #43a047 0%, #81c784 100%)"
      }}>
        <div className="illustration text-center">
          <img src="/public/6422200.png" alt="illustration" style={{ width: '80%', maxWidth: '300px', display: 'block' }} />
        </div>
      </div>
    </div>
  )
}
