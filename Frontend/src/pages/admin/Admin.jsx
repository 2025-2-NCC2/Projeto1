import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Shield, 
  Users, 
  Settings, 
  Database, 
  Activity,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react'

export default function Admin({ user }) {
  const [searchTerm, setSearchTerm] = useState('')

  // Verificar se o usuário é admin
  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>
              Você não tem permissão para acessar esta área.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <a href="/dashboard">Voltar ao Dashboard</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const adminStats = [
    { title: 'Total de Usuários', value: '1,234', icon: Users, color: 'text-blue-600' },
    { title: 'Grupos Ativos', value: '89', icon: Activity, color: 'text-green-600' },
    { title: 'Configurações', value: '12', icon: Settings, color: 'text-purple-600' },
    { title: 'Banco de Dados', value: '98%', icon: Database, color: 'text-orange-600' },
  ]

  const users = [
    { id: 1, name: 'João Silva', email: 'joao@exemplo.com', role: 'colab', status: 'ativo', lastLogin: '2 horas atrás' },
    { id: 2, name: 'Maria Santos', email: 'maria@exemplo.com', role: 'admin', status: 'ativo', lastLogin: '1 hora atrás' },
    { id: 3, name: 'Pedro Costa', email: 'pedro@exemplo.com', role: 'colab', status: 'inativo', lastLogin: '2 dias atrás' },
    { id: 4, name: 'Ana Oliveira', email: 'ana@exemplo.com', role: 'colab', status: 'ativo', lastLogin: '30 min atrás' },
  ]

  const systemLogs = [
    { time: '14:30', action: 'Usuário criado', details: 'João Silva cadastrado no sistema', type: 'info' },
    { time: '14:25', action: 'Backup realizado', details: 'Backup automático concluído com sucesso', type: 'success' },
    { time: '14:20', action: 'Login falhado', details: 'Tentativa de login inválida para admin@test.com', type: 'warning' },
    { time: '14:15', action: 'Configuração alterada', details: 'Configurações de email atualizadas', type: 'info' },
  ]

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <span>Painel Administrativo</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Gerencie usuários, configurações e monitore o sistema.
          </p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Novo Usuário</span>
        </Button>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStats.map((stat, index) => {
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
        {/* User Management */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Gerenciamento de Usuários</CardTitle>
                <CardDescription>
                  Visualize e gerencie todos os usuários do sistema
                </CardDescription>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar usuários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      <div className="text-xs text-gray-400">Último login: {user.lastLogin}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                    <Badge variant={user.status === 'ativo' ? 'default' : 'destructive'}>
                      {user.status}
                    </Badge>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Logs do Sistema</CardTitle>
            <CardDescription>
              Atividades recentes do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemLogs.map((log, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    log.type === 'success' ? 'bg-green-500' :
                    log.type === 'warning' ? 'bg-yellow-500' :
                    log.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {log.action}
                      </p>
                      <span className="text-xs text-gray-500">{log.time}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {log.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Admin Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Administrativas</CardTitle>
          <CardDescription>
            Ferramentas e configurações do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Database className="h-6 w-6 text-blue-600" />
              <span className="text-sm">Backup</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Settings className="h-6 w-6 text-green-600" />
              <span className="text-sm">Configurações</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Activity className="h-6 w-6 text-purple-600" />
              <span className="text-sm">Monitoramento</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Users className="h-6 w-6 text-orange-600" />
              <span className="text-sm">Relatórios</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

