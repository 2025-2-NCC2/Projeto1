import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Heart, 
  DollarSign, 
  TrendingUp, 
  Users, 
  QrCode,
  Calendar,
  Search,
  Filter,
  Download
} from 'lucide-react'

export default function Donations() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')

  const donationStats = [
    { title: 'Total Arrecadado', value: 'R$ 125,430', icon: DollarSign, color: 'text-green-600' },
    { title: 'Doações Este Mês', value: 'R$ 45,678', icon: TrendingUp, color: 'text-blue-600' },
    { title: 'Doadores Ativos', value: '234', icon: Users, color: 'text-purple-600' },
    { title: 'Campanhas Ativas', value: '8', icon: Heart, color: 'text-red-600' },
  ]

  const donations = [
    { 
      id: 1, 
      donor: 'João Silva', 
      amount: 'R$ 150,00', 
      date: '2024-01-15', 
      campaign: 'Campanha Solidária', 
      status: 'confirmado',
      method: 'PIX'
    },
    { 
      id: 2, 
      donor: 'Maria Santos', 
      amount: 'R$ 300,00', 
      date: '2024-01-14', 
      campaign: 'Ajuda Emergencial', 
      status: 'pendente',
      method: 'Cartão'
    },
    { 
      id: 3, 
      donor: 'Pedro Costa', 
      amount: 'R$ 75,00', 
      date: '2024-01-13', 
      campaign: 'Campanha Solidária', 
      status: 'confirmado',
      method: 'PIX'
    },
    { 
      id: 4, 
      donor: 'Ana Oliveira', 
      amount: 'R$ 200,00', 
      date: '2024-01-12', 
      campaign: 'Projeto Educação', 
      status: 'confirmado',
      method: 'Transferência'
    },
  ]

  const campaigns = [
    { 
      name: 'Campanha Solidária', 
      goal: 'R$ 50,000', 
      raised: 'R$ 32,500', 
      progress: 65,
      status: 'ativa'
    },
    { 
      name: 'Ajuda Emergencial', 
      goal: 'R$ 30,000', 
      raised: 'R$ 28,900', 
      progress: 96,
      status: 'ativa'
    },
    { 
      name: 'Projeto Educação', 
      goal: 'R$ 25,000', 
      raised: 'R$ 15,200', 
      progress: 61,
      status: 'ativa'
    },
  ]

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.donor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.campaign.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || donation.status === selectedFilter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <Heart className="h-8 w-8 text-red-600" />
            <span>Sistema de Doações</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Gerencie campanhas, acompanhe doações e gere relatórios.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Exportar</span>
          </Button>
          <Button asChild>
            <a href="/qr-code" className="flex items-center space-x-2">
              <QrCode className="h-4 w-4" />
              <span>Gerar QR Code</span>
            </a>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {donationStats.map((stat, index) => {
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
        {/* Donations List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Doações Recentes</CardTitle>
                <CardDescription>
                  Acompanhe todas as doações recebidas
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar doações..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-48"
                  />
                </div>
                <select 
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">Todos</option>
                  <option value="confirmado">Confirmado</option>
                  <option value="pendente">Pendente</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredDonations.map((donation) => (
                <div key={donation.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <Heart className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{donation.donor}</div>
                      <div className="text-sm text-gray-500">{donation.campaign}</div>
                      <div className="text-xs text-gray-400 flex items-center space-x-2">
                        <Calendar className="h-3 w-3" />
                        <span>{donation.date}</span>
                        <span>•</span>
                        <span>{donation.method}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600 text-lg">{donation.amount}</div>
                    <Badge variant={donation.status === 'confirmado' ? 'default' : 'secondary'}>
                      {donation.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle>Campanhas Ativas</CardTitle>
            <CardDescription>
              Progresso das campanhas em andamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {campaigns.map((campaign, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                    <Badge variant="default">
                      {campaign.status}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Arrecadado: {campaign.raised}</span>
                      <span className="text-gray-600">Meta: {campaign.goal}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${campaign.progress}%` }}
                      ></div>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      {campaign.progress}% da meta
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Ferramentas para gerenciar doações e campanhas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Heart className="h-6 w-6 text-red-600" />
              <span className="text-sm">Nova Campanha</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" asChild>
              <a href="/qr-code">
                <QrCode className="h-6 w-6 text-blue-600" />
                <span className="text-sm">Gerar QR Code</span>
              </a>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Download className="h-6 w-6 text-green-600" />
              <span className="text-sm">Relatório</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Users className="h-6 w-6 text-purple-600" />
              <span className="text-sm">Doadores</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

