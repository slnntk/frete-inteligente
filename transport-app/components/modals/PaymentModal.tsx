"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface PaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  viagemId: number
  valor: number
  onPaymentConfirmed: () => void
}

export function PaymentModal({ open, onOpenChange, viagemId, valor, onPaymentConfirmed }: PaymentModalProps) {
  const [loading, setLoading] = useState(false)
  const [qrCodeData, setQrCodeData] = useState<string>("")

  useEffect(() => {
    if (open) {
      // Gerar dados do QR code (simulando um código de pagamento PIX)
      const paymentData = JSON.stringify({
        viagemId,
        valor,
        timestamp: Date.now()
      })
      setQrCodeData(paymentData)
      
      // Gerar QR code usando API externa (QR Server)
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(paymentData)}`
      setQrCodeData(qrCodeUrl)
    }
  }, [open, viagemId, valor])

  const handleQRCodeScanned = async () => {
    setLoading(true)
    try {
      // Simular leitura do QR code e confirmação do pagamento
      // Em produção, isso seria feito por um webhook ou polling
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Chamar callback para confirmar pagamento
      onPaymentConfirmed()
      onOpenChange(false)
    } catch (error) {
      console.error("Erro ao processar pagamento:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        style={{ backgroundColor: '#ffffff', opacity: 1 }}
        className="max-w-md !bg-white !opacity-100"
      >
        <DialogHeader>
          <DialogTitle>Pagamento via PIX</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Escaneie o QR code para realizar o pagamento
            </p>
            <div className="flex justify-center p-4 bg-white border rounded-lg">
              {qrCodeData && (
                <img 
                  src={qrCodeData} 
                  alt="QR Code de Pagamento" 
                  className="w-48 h-48"
                />
              )}
            </div>
            <p className="text-lg font-semibold mt-4">
              R$ {valor.toFixed(2)}
            </p>
          </div>
          <Button
            onClick={handleQRCodeScanned}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              "Confirmar Pagamento"
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Após escanear o QR code, clique em "Confirmar Pagamento" para finalizar
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

