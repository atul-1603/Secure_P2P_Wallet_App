import { AnimatePresence, motion } from 'framer-motion'
import { Check, Copy, Download } from 'lucide-react'
import { useMemo, useState } from 'react'
import QRCodeComponent from 'react-qr-code'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'

// Safely extract the default export for ESM/React 19 compatibility
const QRCode = (QRCodeComponent as any)?.default || QRCodeComponent;

type WalletQrCardProps = {
  walletId: string
  title?: string
  description?: string
}

export function WalletQrCard({
  walletId,
  title = 'Wallet QR',
  description = 'Share this QR to receive money instantly.',
}: WalletQrCardProps) {
  const [copied, setCopied] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const qrElementId = useMemo(() => `wallet-qr-${walletId}`, [walletId])

  async function onCopyWalletId() {
    try {
      await navigator.clipboard.writeText(walletId)
      setCopied(true)
      setActionError(null)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      setActionError('Clipboard access is blocked. Please copy the wallet ID manually.')
    }
  }

  function onDownloadQr() {
    const qrContainer = document.getElementById(qrElementId)
    const svg = qrContainer?.querySelector('svg')

    if (!(svg instanceof SVGSVGElement)) {
      setActionError('Unable to prepare QR download. Please refresh and try again.')
      return
    }

    const serializer = new XMLSerializer()
    const source = serializer.serializeToString(svg)
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' })
    const blobUrl = URL.createObjectURL(blob)

    const downloadLink = document.createElement('a')
    downloadLink.href = blobUrl
    downloadLink.download = `wallet-${walletId}.svg`
    document.body.appendChild(downloadLink)
    downloadLink.click()
    downloadLink.remove()
    URL.revokeObjectURL(blobUrl)

    setDownloaded(true)
    setActionError(null)
    window.setTimeout(() => setDownloaded(false), 1400)
  }

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div id={qrElementId} className="flex justify-center rounded-xl border bg-white p-4">
            <QRCode value={walletId} size={180} />
          </div>

          <div className="rounded-xl border bg-background p-3 text-xs">
            <p className="text-muted-foreground">Wallet ID</p>
            <p className="truncate font-medium">{walletId}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={onCopyWalletId}>
              {copied ? <Check className="mr-1 h-4 w-4" /> : <Copy className="mr-1 h-4 w-4" />}
              {copied ? 'Copied' : 'Copy Wallet ID'}
            </Button>
            <Button type="button" variant="outline" onClick={onDownloadQr}>
              {downloaded ? <Check className="mr-1 h-4 w-4" /> : <Download className="mr-1 h-4 w-4" />}
              {downloaded ? 'Downloaded' : 'Download QR'}
            </Button>
          </div>

          <AnimatePresence>
            {(copied || downloaded) ? (
              <motion.p
                className="text-xs text-emerald-600"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
              >
                {copied ? 'Wallet ID copied to clipboard.' : 'QR code downloaded as SVG.'}
              </motion.p>
            ) : null}
          </AnimatePresence>

          {actionError ? <p className="text-xs text-destructive">{actionError}</p> : null}
        </CardContent>
      </Card>
    </motion.div>
  )
}
