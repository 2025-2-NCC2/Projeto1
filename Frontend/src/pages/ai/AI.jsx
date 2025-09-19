import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Sparkles, 
  BarChart3, 
  TrendingUp, 
  Users,
  MessageSquare,
  Lightbulb,
  Target,
  Zap,
  Send
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AI({ user }) {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState(null)

  // Verificar se o usuário tem acesso (apenas admin neste exemplo)
  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Brain className="h-12 w-12 text-purple-500 mx-auto mb-4" />
            <CardTitle>Acesso Restrito</CardTitle>
            <CardDescription>
              O módulo de IA está disponível apenas para administradores.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <Link to="/dashboard">Voltar ao Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const aiFeatures = [
    {
      title: 'Análise Preditiva',
      description: 'Previsões sobre tendências de doações e engajamento',
      icon: TrendingUp,
      color: 'text-blue-600',
      status: 'ativo'
    },
    {
      title: 'Segmentação Inteligente',
      description: 'Agrupamento automático de usuários por comportamento',
      icon: Users,
      color: 'text-green-600',
      status: 'ativo'
    },
    {
      title: 'Otimização de Campanhas',
      description: 'Sugestões para melhorar performance das campanhas',
      icon: Target,
      color: 'text-purple-600',
      status: 'beta'
    },
    {
      title: 'Insights Automáticos',
      description: 'Relatórios e descobertas gerados automaticamente',
      icon: Lightbulb,
      color: 'text-orange-600',
      status: 'ativo'
    }
  ]

  const recentInsights = [
    {
      type: 'trend',
      title: 'Aumento nas doações aos finais de semana',
      description: 'Doações aumentam 35% aos sábados e domingos. Considere campanhas específicas para estes dias.',
      confidence: 92,
      impact: 'alto'
    },
    {
      type: 'segment',
      title: 'Novo segmento de doadores identificado',
      description: 'Usuários de 25-35 anos com alta propensão a doações recorrentes.',
      confidence: 87,
      impact: 'médio'
    },
    {
      type: 'optimization',
      title: 'Melhoria sugerida para QR Codes',
      description: 'QR Codes com valores pré-definidos têm 40% mais conversão.',
      confidence: 94,
      impact: 'alto'
    }
  ]

  const handleAnalyze = async () => {
    if (!query.trim()) return
    
    setIsLoading(true)
    
    // Simulação de análise de IA
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setResults({
      summary: 'Análise concluída com sucesso',
      insights: [
        'Padrão de crescimento identificado nos últimos 3 meses',
        'Oportunidade de otimização em campanhas de final de ano',
        'Segmento de usuários com alto potencial de engajamento'
      ],
      recommendations: [
        'Implementar campanhas segmentadas por faixa etária',
        'Aumentar frequência de comunicação aos finais de semana',
        'Criar programa de fidelidade para doadores recorrentes'
      ]
    })
    
    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
          <Brain className="h-8 w-8 text-purple-600" />
          <span>Inteligência Artificial</span>
          <Badge variant="secondary" className="ml-2">
            <Sparkles className="h-3 w-3 mr-1" />
            Beta
          </Badge>
        </h1>
        <p className="text-gray-600 mt-2">
          Utilize IA para obter insights avançados, previsões e otimizações automáticas.
        </p>
      </div>

      {/* AI Query Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Consulta Inteligente</span>
          </CardTitle>
          <CardDescription>
            Faça perguntas sobre seus dados e receba análises detalhadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Ex: Analise as tendências de doação dos últimos 6 meses e sugira estratégias para aumentar o engajamento..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={3}
            />
            <Button 
              onClick={handleAnalyze} 
              disabled={isLoading || !query.trim()}
              className="flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Zap className="h-4 w-4 animate-spin" />
                  <span>Analisando...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Analisar</span>
                </>
              )}
            </Button>
          </div>

          {/* Results */}
          {results && (
            <div className="mt-6 space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">Resumo da Análise</h4>
                <p className="text-green-700">{results.summary}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-3">Insights Descobertos</h4>
                  <ul className="space-y-2">
                    {results.insights.map((insight, index) => (
                      <li key={index} className="text-blue-700 text-sm flex items-start space-x-2">
                        <Lightbulb className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-medium text-purple-900 mb-3">Recomendações</h4>
                  <ul className="space-y-2">
                    {results.recommendations.map((rec, index) => (
                      <li key={index} className="text-purple-700 text-sm flex items-start space-x-2">
                        <Target className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* AI Features */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Funcionalidades de IA</CardTitle>
            <CardDescription>
              Recursos inteligentes disponíveis no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {aiFeatures.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg bg-gray-100`}>
                        <Icon className={`h-5 w-5 ${feature.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">{feature.title}</h4>
                          <Badge variant={feature.status === 'ativo' ? 'default' : 'secondary'} className="text-xs">
                            {feature.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Insights Recentes</CardTitle>
            <CardDescription>
              Descobertas automáticas da IA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInsights.map((insight, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-900 text-sm">{insight.title}</h4>
                    <Badge variant={insight.impact === 'alto' ? 'default' : 'secondary'} className="text-xs">
                      {insight.impact}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{insight.description}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Confiança:</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-blue-600 h-1 rounded-full"
                        style={{ width: `${insight.confidence}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">{insight.confidence}%</span>
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
          <CardTitle>Ações Rápidas de IA</CardTitle>
          <CardDescription>
            Ferramentas e análises automatizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <BarChart3 className="h-6 w-6 text-blue-600" />
              <span className="text-sm">Análise Completa</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <span className="text-sm">Previsões</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Users className="h-6 w-6 text-purple-600" />
              <span className="text-sm">Segmentação</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Target className="h-6 w-6 text-orange-600" />
              <span className="text-sm">Otimização</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

