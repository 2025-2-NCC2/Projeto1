import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function MentorLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  function onSubmit(e) {
    e.preventDefault()
    // Sem validação por enquanto: vai direto para o painel do mentor
    navigate('/mentor/painel', { replace: true })
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h1 className="h4 mb-3">Entrar como mentor</h1>

              <form noValidate onSubmit={onSubmit}>
                <div className="mb-3">
                  <label htmlFor="mentor-email" className="form-label">E-mail</label>
                  <input
                    id="mentor-email"
                    type="email"
                    className="form-control"
                    placeholder="voce@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="mentor-senha" className="form-label">Senha</label>
                  <input
                    id="mentor-senha"
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                  />
                </div>

                <button className="btn btn-primary w-100" type="submit">
                  <i className="bi bi-box-arrow-in-right me-1" aria-hidden="true"></i>
                  Entrar
                </button>
              </form>

              <p className="text-center small text-secondary mt-3 mb-0">
                *Sem validação por enquanto: apenas navegação.
              </p>
            </div>
          </div>

          <p className="text-center text-secondary small mt-3 mb-0">
            © {new Date().getFullYear()} Auria
          </p>
        </div>
      </div>
    </div>
  )
}
