import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logofundo.png'; 

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [animate, setAnimate] = useState(false)

  const primaryColor = "#22B77E"; 
  const secondaryColor = "#17A2B8"; 
  const textColor = "#333"; 
  const backgroundColor = "#ffffffff"; 

  useEffect(() => {
    const timeout = setTimeout(() => setAnimate(true), 100)
    return () => clearTimeout(timeout)
  }, [])

  function onSubmit(e) {
    e.preventDefault()
    navigate('/admin/painel', { replace: true })
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Vídeo de fundo desfocado */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'blur(8px) brightness(0.7)', // desfoque e leve escurecimento
          zIndex: -1
        }}
      >
        <source src="../src/assets/video.mp4" type="video/mp4" />
        
      </video>

      {/* Conteúdo principal */}
      <div 
        className="container py-5" 
        style={{ 
          fontFamily: 'Montserrat, Roboto, sans-serif', 
          color: textColor, 
          minHeight: '100vh', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div 
          className="col-12 col-sm-10 col-md-8 col-lg-5"
          style={{
            transform: animate ? 'translateY(0)' : 'translateY(200px)',
            opacity: animate ? 1 : 0,
            transition: 'all 1.0s ease-out'
          }}
        >
          <div className="card shadow-sm" style={{ borderColor: primaryColor, borderWidth: '2px', backgroundColor: backgroundColor }}>
            <div className="card-body p-4 text-center">
              {/* 
              <img 
                src={logo} 
                alt="Auria Logo" 
                style={{ maxWidth: '150px', marginBottom: '20px' }} 
              /> 
              */}
              <h1 className="h4 mb-3" style={{ color: primaryColor }}>Entrar como administrador</h1>

              <form noValidate onSubmit={onSubmit}>
                <div className="mb-3 text-start">
                  <label htmlFor="admin-email" className="form-label" style={{ color: textColor }}>E-mail (admin)</label>
                  <input
                    id="admin-email"
                    type="email"
                    className="form-control"
                    placeholder="admin@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ borderColor: secondaryColor }}
                  />
                </div>

                <div className="mb-3 text-start">
                  <label htmlFor="admin-senha" className="form-label" style={{ color: textColor }}>Senha</label>
                  <input
                    id="admin-senha"
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                    style={{ borderColor: secondaryColor }}
                  />
                </div>

                <button className="btn w-100" type="submit" style={{ backgroundColor: primaryColor, borderColor: primaryColor, color: '#fff' }}>
                  <i className="bi bi-box-arrow-in-right me-1" aria-hidden="true"></i>
                  Entrar
                </button>
              </form>

              <p className="text-center small mt-3 mb-0" style={{ color: textColor }}>
                *Sem validação por enquanto: apenas navegação.
              </p>
            </div>
          </div>

          <p className="text-center small mt-3 mb-0" style={{ fontSize: '1.1rem', color: primaryColor }}>
            © {new Date().getFullYear()} Auria
          </p>
        </div>
      </div>
    </div>
  )
}
