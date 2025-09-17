import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  UserCheck, 
  Users, 
  Calendar, 
  MessageSquare,
  FileText,
  Heart,
  Target,
  Activity
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Colab({ user }) {
  const collaboratorStats = [
    { title: 'Projetos Ativos', value: '8', icon: Target, color: 'text-blue-600' },
    { title: 'Tarefas Pendentes', value: '12', icon: FileText, color: 'text-orange-600' },
    { title: 'Eventos Este Mês', value: '5', icon: Calendar, color: 'text-green-600' },
    { title: 'Mensagens', value: '23', icon: MessageSquare, color: 'text-purple-600' },
  ]

  const recentActivities = [
    { action: 'Tarefa concluída', project: 'Campanha Solidária', time: '2 horas atrás' },
    { action: 'Comentário adicionado', project: 'Projeto Educação', time: '4 horas atrás' },
    { action: 'Arquivo enviado', project: 'Relatório Mensal', time: '1 dia atrás' },
    { action: 'Reunião agendada', project: 'Planejamento 2024', time: '2 dias atrás' },
  ]

  const quickActions = [
    { title: 'Ver Tarefas', href: '/tasks', icon: FileText, description: 'Minhas tarefas pendentes' },
    { title: 'Calendário', href: '/calendar', icon: Calendar, description: 'Eventos e reuniões' },
    { title: 'Mensagens', href: '/messages', icon: MessageSquare, description: 'Comunicação da equipe' },
    { title: 'Relatórios', href: '/reports', icon: Activity, description: 'Relatórios de progresso' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
          <UserCheck className="h-8 w-8 text-green-600" />
          <span>Área de Colaboração</span>
        </h1>
        <p className="text-gray-600 mt-2">
          Bem-vindo, {user?.name}! Aqui você pode acompanhar seus projetos e colaborar com a equipe.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {collaboratorStats.map((stat, index) => {
          const Icon = stat.icon
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
              Acesse rapidamente suas ferramentas de trabalho
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
                    className="h-auto p-4 flex flex-col items-start space-y-2 hover:bg-green-50 hover:border-green-200"
                    asChild
                  >
                    <Link to={action.href}>
                      <Icon className="h-6 w-6 text-green-600" />
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
              Suas últimas ações no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500">
                      {activity.project} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation to Other Areas */}
      <Card>
        <CardHeader>
          <CardTitle>Navegação Rápida</CardTitle>
          <CardDescription>
            Acesse outras áreas do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" asChild>
              <Link to="/dashboard">
                <Activity className="h-6 w-6 text-blue-600" />
                <span className="text-sm">Dashboard</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" asChild>
              <Link to="/groups">
                <Users className="h-6 w-6 text-green-600" />
                <span className="text-sm">Grupos</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" asChild>
              <Link to="/donations">
                <Heart className="h-6 w-6 text-red-600" />
                <span className="text-sm">Doações</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" asChild>
              <Link to="/metrics">
                <Target className="h-6 w-6 text-purple-600" />
                <span className="text-sm">Métricas</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

