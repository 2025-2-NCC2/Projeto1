import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, BarChart3, Users, Heart, Brain } from 'lucide-react'

export default function Home({ user }) {
  const features = [
    {
      icon: BarChart3,
      title: 'Dashboard Inteligente',
      description: 'Visualize métricas e indicadores em tempo real com gráficos interativos.'
    },
    {
      icon: Users,
      title: 'Gestão de Grupos',
      description: 'Organize e gerencie grupos de usuários de forma eficiente.'
    },
    {
      icon: Heart,
      title: 'Sistema de Doações',
      description: 'Facilite doações com QR codes e acompanhe o progresso.'
    },
    {
      icon: Brain,
      title: 'Inteligência Artificial',
      description: 'Utilize IA para análises avançadas e insights automáticos.'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Sistema de Gestão
          <span className="text-blue-600 block">Inteligente</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Uma plataforma completa para gerenciar grupos, acompanhar métricas, 
          facilitar doações e utilizar inteligência artificial para insights avançados.
        </p>
        
        {!user ? (
          <div className="space-x-4">
            <Button size="lg" asChild>
              <a href="/login" className="flex items-center space-x-2">
                <span>Começar Agora</span>
                <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="outline" size="lg">
              Saiba Mais
            </Button>
          </div>
        ) : (
          <Button size="lg" asChild>
            <a href="/dashboard" className="flex items-center space-x-2">
              <span>Ir para Dashboard</span>
              <ArrowRight className="h-5 w-5" />
            </a>
          </Button>
        )}
      </div>

      {/* Features Grid */}
      <div className="py-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Principais Funcionalidades
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 bg-blue-50 rounded-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Números que Impressionam
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-gray-600">Usuários Ativos</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Grupos Gerenciados</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">R$ 100k+</div>
              <div className="text-gray-600">Doações Facilitadas</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!user && (
        <div className="py-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Pronto para Começar?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Junte-se a milhares de usuários que já transformaram sua gestão.
          </p>
          <Button size="lg" asChild>
            <a href="/login" className="flex items-center space-x-2">
              <span>Criar Conta Gratuita</span>
              <ArrowRight className="h-5 w-5" />
            </a>
          </Button>
        </div>
      )}
    </div>
  )
}

