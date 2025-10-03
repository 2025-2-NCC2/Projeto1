export default function Login() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h1 className="h4 mb-3">Entrar</h1>

              <form className="needs-validation" noValidate>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">E-mail</label>
                  <input id="email" type="email" className="form-control" placeholder="voce@empresa.com" required />
                  <div className="invalid-feedback">Informe um e-mail válido.</div>
                </div>

                <div className="mb-3">
                  <label htmlFor="senha" className="form-label">Senha</label>
                  <input id="senha" type="password" className="form-control" placeholder="••••••••" required />
                  <div className="invalid-feedback">Informe sua senha.</div>
                </div>

                <button className="btn btn-primary w-100" type="submit">
                  <i className="bi bi-box-arrow-in-right me-1" aria-hidden="true"></i>
                  Entrar
                </button>
              </form>

              <p className="text-center small text-secondary mt-3 mb-0">
                Esqueceu a senha? #Recuperar acesso
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
