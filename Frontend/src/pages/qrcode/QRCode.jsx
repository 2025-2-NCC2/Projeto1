import { useState } from 'react'
import QRCode from 'react-qr-code'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  QrCode as QrCodeIcon, 
  Download, 
  Copy, 
  Share2,
  Smartphone,
  CreditCard,
  Link,
  Mail
} from 'lucide-react'

export default function QRCodePage() {
  const [qrData, setQrData] = useState({
    type: 'pix',
    pixKey: '',
    amount: '',
    description: '',
    url: '',
    text: ''
  })
  const [generatedQR, setGeneratedQR] = useState('')
  const [qrType, setQrType] = useState('pix')

  const generateQR = () => {
    let qrContent = ''
    
    switch (qrType) {
      case 'pix':
        // Formato simplificado do PIX (em produção seria mais complexo)
        qrContent = `PIX:${qrData.pixKey}:${qrData.amount}:${qrData.description}`
        break
      case 'url':
        qrContent = qrData.url
        break
      case 'text':
        qrContent = qrData.text
        break
      default:
        qrContent = qrData.text
    }
    
    setGeneratedQR(qrContent)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedQR)
    // Em um app real, mostraria uma notificação de sucesso
  }

  const downloadQR = () => {
    const svg = document.getElementById('qr-code')
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL('image/png')
      
      const downloadLink = document.createElement('a')
      downloadLink.download = 'qr-code.png'
      downloadLink.href = pngFile
      downloadLink.click()
    }
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  const qrTypes = [
    { id: 'pix', label: 'PIX', icon: CreditCard, description: 'Gerar QR Code para pagamento PIX' },
    { id: 'url', label: 'URL', icon: Link, description: 'Gerar QR Code para link/website' },
    { id: 'text', label: 'Texto', icon: Mail, description: 'Gerar QR Code para texto livre' },
  ]

  const presetDonations = [
    { amount: '25', description: 'Doação Básica' },
    { amount: '50', description: 'Doação Padrão' },
    { amount: '100', description: 'Doação Generosa' },
    { amount: '250', description: 'Doação Premium' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
          <QrCodeIcon className="h-8 w-8 text-blue-600" />
          <span>Gerador de QR Code</span>
        </h1>
        <p className="text-gray-600 mt-2">
          Crie QR codes para doações PIX, links ou textos personalizados.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* QR Generator Form */}
        <Card>
          <CardHeader>
            <CardTitle>Configurar QR Code</CardTitle>
            <CardDescription>
              Escolha o tipo e preencha as informações necessárias
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* QR Type Selection */}
            <div className="space-y-3">
              <Label>Tipo de QR Code</Label>
              <div className="grid grid-cols-3 gap-3">
                {qrTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <Button
                      key={type.id}
                      variant={qrType === type.id ? 'default' : 'outline'}
                      className="h-auto p-3 flex flex-col items-center space-y-2"
                      onClick={() => setQrType(type.id)}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs">{type.label}</span>
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* PIX Form */}
            {qrType === 'pix' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="pixKey">Chave PIX</Label>
                  <Input
                    id="pixKey"
                    placeholder="Digite sua chave PIX (email, CPF, telefone ou chave aleatória)"
                    value={qrData.pixKey}
                    onChange={(e) => setQrData(prev => ({ ...prev, pixKey: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="amount">Valor (opcional)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={qrData.amount}
                    onChange={(e) => setQrData(prev => ({ ...prev, amount: e.target.value }))}
                  />
                </div>

                {/* Preset Amounts */}
                <div>
                  <Label>Valores Pré-definidos</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {presetDonations.map((preset, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setQrData(prev => ({ 
                          ...prev, 
                          amount: preset.amount, 
                          description: preset.description 
                        }))}
                      >
                        R$ {preset.amount}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    placeholder="Descrição da doação"
                    value={qrData.description}
                    onChange={(e) => setQrData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </div>
            )}

            {/* URL Form */}
            {qrType === 'url' && (
              <div>
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://exemplo.com"
                  value={qrData.url}
                  onChange={(e) => setQrData(prev => ({ ...prev, url: e.target.value }))}
                />
              </div>
            )}

            {/* Text Form */}
            {qrType === 'text' && (
              <div>
                <Label htmlFor="text">Texto</Label>
                <Textarea
                  id="text"
                  placeholder="Digite o texto que será codificado no QR Code"
                  value={qrData.text}
                  onChange={(e) => setQrData(prev => ({ ...prev, text: e.target.value }))}
                  rows={4}
                />
              </div>
            )}

            <Button onClick={generateQR} className="w-full">
              Gerar QR Code
            </Button>
          </CardContent>
        </Card>

        {/* QR Code Display */}
        <Card>
          <CardHeader>
            <CardTitle>QR Code Gerado</CardTitle>
            <CardDescription>
              Escaneie com seu smartphone ou compartilhe
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedQR ? (
              <div className="space-y-6">
                {/* QR Code */}
                <div className="flex justify-center">
                  <div className="p-4 bg-white rounded-lg border">
                    <QRCode
                      id="qr-code"
                      value={generatedQR}
                      size={200}
                      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    />
                  </div>
                </div>

                {/* QR Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Informações do QR Code:</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div><strong>Tipo:</strong> {qrTypes.find(t => t.id === qrType)?.label}</div>
                    {qrType === 'pix' && (
                      <>
                        <div><strong>Chave PIX:</strong> {qrData.pixKey}</div>
                        {qrData.amount && <div><strong>Valor:</strong> R$ {qrData.amount}</div>}
                        {qrData.description && <div><strong>Descrição:</strong> {qrData.description}</div>}
                      </>
                    )}
                    {qrType === 'url' && <div><strong>URL:</strong> {qrData.url}</div>}
                    {qrType === 'text' && <div><strong>Texto:</strong> {qrData.text}</div>}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <Button onClick={downloadQR} className="flex-1 flex items-center space-x-2">
                    <Download className="h-4 w-4" />
                    <span>Baixar</span>
                  </Button>
                  <Button variant="outline" onClick={copyToClipboard} className="flex-1 flex items-center space-x-2">
                    <Copy className="h-4 w-4" />
                    <span>Copiar</span>
                  </Button>
                  <Button variant="outline" className="flex-1 flex items-center space-x-2">
                    <Share2 className="h-4 w-4" />
                    <span>Compartilhar</span>
                  </Button>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Smartphone className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">Como usar:</h4>
                      <p className="text-sm text-blue-700">
                        {qrType === 'pix' 
                          ? 'Abra o app do seu banco, vá em PIX e escaneie o código para fazer a doação.'
                          : qrType === 'url'
                          ? 'Use a câmera do seu smartphone ou um leitor de QR Code para acessar o link.'
                          : 'Escaneie o código com um leitor de QR Code para visualizar o texto.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <QrCodeIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Preencha as informações e clique em "Gerar QR Code" para visualizar
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

