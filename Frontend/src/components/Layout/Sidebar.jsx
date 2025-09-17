import { 
  Home, 
  Users, 
  BarChart3, 
  Settings, 
  Heart, 
  QrCode, 
  Target, 
  List,
  Brain,
  UserCheck,
  Shield
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const menuItems = [
  { icon: Home, label: 'Home', href: '#/', roles: ['admin', 'colab'] },
  { icon: BarChart3, label: 'Dashboard', href: '#/dashboard', roles: ['admin', 'colab'] },
  { icon: Shield, label: 'Admin', href: '#/admin', roles: ['admin'] },
  { icon: UserCheck, label: 'Colaboração', href: '#/colab', roles: ['admin', 'colab'] },
  { icon: Users, label: 'Grupos', href: '#/groups', roles: ['admin', 'colab'] },
  { icon: Settings, label: 'Nomes', href: '#/names', roles: ['admin'] },
  { icon: BarChart3, label: 'Indicadores', href: '#/indicators', roles: ['admin', 'colab'] },
  { icon: Heart, label: 'Doações', href: '#/donations', roles: ['admin', 'colab'] },
  { icon: QrCode, label: 'QR Code', href: '#/qr-code', roles: ['admin', 'colab'] },
  { icon: Target, label: 'Métricas', href: '#/metrics', roles: ['admin', 'colab'] },
  { icon: List, label: 'Listas', href: '#/list', roles: ['admin', 'colab'] },
  { icon: Brain, label: 'IA', href: '#/ai', roles: ['admin'] },
]

export default function Sidebar({ user, currentPath = '/' }) {
  if (!user) return null

  const userRole = user.role || 'colab'
  const filteredItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  )

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Menu</h2>
        <nav className="space-y-2">
          {filteredItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPath === item.href
            
            return (
              <Button
                key={item.href}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start ${
                  isActive 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
                asChild
              >
                <a href={item.href} className="flex items-center space-x-3">
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </a>
              </Button>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

