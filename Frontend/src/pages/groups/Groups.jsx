import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Users, 
  Plus, 
  Search, 
  Settings, 
  UserPlus,
  Crown,
  Calendar,
  Activity
} from 'lucide-react'

export default function Groups() {
  const [searchTerm, setSearchTerm] = useState('')

  const groups = [
    {
      id: 1,
      name: 'Equipe de Desenvolvimento',
      description: 'Desenvolvedores e designers do projeto',
      members: 12,
      admin: 'João Silva',
      created: '2024-01-10',
      status: 'ativo',
      lastActivity: '2 horas atrás'
    },
    {
      id: 2,
      name: 'Voluntários',
      description: 'Grupo de voluntários para eventos',
      members: 45,
      admin: 'Maria Santos',
      created: '2024-01-05',
      status: 'ativo',
      lastActivity: '1 dia atrás'
    },
    {
      id: 3,
      name: 'Doadores Premium',
      description: 'Doadores com contribuições acima de R$ 500',
      members: 8,
      admin: 'Pedro Costa',
      created: '2024-01-15',
      status: 'ativo',
      lastActivity: '3 horas atrás'
    },
    {
      id: 4,
      name: 'Coordenadores',
      description: 'Coordenadores de projetos e campanhas',
      members: 6,
      admin: 'Ana Oliveira',
      created: '2024-01-08',
      status: 'inativo',
      lastActivity: '1 semana atrás'
    }
  ]

  const groupStats = [
    { title: 'Total de Grupos', value: '12', icon: Users, color: 'text-blue-600' },
    { title: 'Membros Ativos', value: '234', icon: UserPlus, color: 'text-green-600' },
    { title: 'Grupos Ativos', value: '9', icon: Activity, color: 'text-purple-600' },
    { title: 'Novos Este Mês', value: '3', icon: Plus, color: 'text-orange-600' },
  ]

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <Users className="h-8 w-8 text-blue-600" />
            <span>Gerenciamento de Grupos</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Organize e gerencie grupos de usuários, voluntários e colaboradores.
          </p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Novo Grupo</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {groupStats.map((stat, index) => {
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

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Grupos</CardTitle>
              <CardDescription>
                Lista de todos os grupos cadastrados no sistema
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar grupos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredGroups.map((group) => (
              <div key={group.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                        <Badge variant={group.status === 'ativo' ? 'default' : 'secondary'}>
                          {group.status}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{group.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <UserPlus className="h-4 w-4" />
                          <span>{group.members} membros</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Crown className="h-4 w-4" />
                          <span>Admin: {group.admin}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Criado: {group.created}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Activity className="h-4 w-4" />
                          <span>{group.lastActivity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <UserPlus className="h-4 w-4 mr-1" />
                      Membros
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4 mr-1" />
                      Configurar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Ferramentas para gerenciar grupos e membros
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Plus className="h-6 w-6 text-blue-600" />
              <span className="text-sm">Criar Grupo</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <UserPlus className="h-6 w-6 text-green-600" />
              <span className="text-sm">Convidar Membros</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Settings className="h-6 w-6 text-purple-600" />
              <span className="text-sm">Configurações</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Activity className="h-6 w-6 text-orange-600" />
              <span className="text-sm">Relatórios</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

