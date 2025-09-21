import express from 'express'
import routes from './routes.js'
import cors from 'cors'

const app = express()

app.use(cors()) // 👈 habilita CORS para todas as origens
app.use(express.json())

// Rota simples para verificar se o servidor está online
app.get('/health', (_, res) => res.json({ ok: true, server: 'up' }))

// Usa as rotas definidas em outro arquivo
app.use('/api', routes)

export default app
