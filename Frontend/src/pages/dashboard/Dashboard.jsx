import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  BarChart3, 
  Users, 
  Heart, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity,
  DollarSign
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Dashboard({ user }) {
  const stats = [
    {
      title: 'Total de Usuários',
      value: '1,234',
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Doações do Mês',
      value: 'R$ 45,678',
      change: '+8%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Grupos Ativos',
      value: '89',
      change: '+5%',
      trend: 'up',
      icon: Activity,
      color: 'text-purple-600'
    },
    {
      title: 'Taxa de Engajamento',
      value: '73%',
      change: '-2%',
      trend: 'down',
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ]

  const recentActivities = [
    { action: 'Novo grupo criado', user: 'João Silva', time: '2 min atrás' },
    { action: 'Doação recebida', user: 'Maria Santos', time: '5 min atrás' },
    { action: 'Relatório gerado', user: 'Pedro Costa', time: '10 min atrás' },
    { action: 'Usuário cadastrado', user: 'Ana Oliveira', time: '15 min atrás' },
  ]

  const quickActions = [
    { title: 'Criar Grupo', href: '/groups', icon: Users, description: 'Adicionar novo grupo' },
    { title: 'Ver Doações', href: '/donations', icon: Heart, description: 'Acompanhar doações' },
    { title: 'Gerar QR Code', href: '/qr-code', icon: BarChart3, description: 'Criar código QR' },
    { title: 'Análise IA', href: '/ai', icon: TrendingUp, description: 'Insights inteligentes' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bem-vindo, {user?.name || 'Usuário'}!
        </h1>
        <p className="text-gray-600 mt-2">
          Aqui está um resumo das suas atividades e métricas principais.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight
          
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="flex items-center space-x-1 text-xs">
                  <TrendIcon className={`h-3 w-3 ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`} />
                  <span className={
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }>
                    {stat.change}
                  </span>
                  <span className="text-gray-500">vs mês anterior</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Acesse rapidamente as funcionalidades mais utilizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start space-y-2 hover:bg-blue-50 hover:border-blue-200"
                    asChild
                  >
                    <Link to={action.href}>
                      <Icon className="h-6 w-6 text-blue-600" />
                      <div className="text-left">
                        <div className="font-medium">{action.title}</div>
                        <div className="text-xs text-gray-500">{action.description}</div>
                      </div>
                    </Link>
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>
              Últimas ações no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500">
                      por {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Métricas de Performance</CardTitle>
          <CardDescription>
            Acompanhe o crescimento e engajamento ao longo do tempo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Gráfico de métricas em desenvolvimento</p>
              <p className="text-sm text-gray-500 mt-2">
                Em breve: visualizações interativas com dados em tempo real
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

