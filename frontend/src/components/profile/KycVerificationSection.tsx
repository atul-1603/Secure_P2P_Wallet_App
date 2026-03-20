import { FileBadge, IdCard } from 'lucide-react'
import type { ChangeEvent } from 'react'
import { Alert } from '../ui/alert'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { formatDateTime } from '../../utils/format'

const KYC_DOCUMENT_OPTIONS = [
  { value: 'AADHAAR', label: 'Aadhaar Card' },
  { value: 'PAN', label: 'PAN Card' },
  { value: 'PASSPORT', label: 'Passport' },
  { value: 'DRIVING_LICENSE', label: 'Driving License' },
] as const

type KycVerificationSectionProps = {
  kycStatus: string
  kycDocumentType: string | null
  kycDocumentUrl: string | null
  updatedAt: string
  selectedDocumentType: string
  onSelectDocumentType: (value: string) => void
  onUploadDocument: (event: ChangeEvent<HTMLInputElement>) => void
  isUploadingDocument: boolean
  previewUrl: string | null
}

function resolveKycVariant(status: string): 'success' | 'warning' | 'outline' {
  const normalizedStatus = status.toUpperCase()

  if (normalizedStatus === 'VERIFIED') {
    return 'success'
  }

  if (normalizedStatus === 'REJECTED') {
    return 'warning'
  }

  return 'outline'
}

export default function KycVerificationSection({
  kycStatus,
  kycDocumentType,
  kycDocumentUrl,
  updatedAt,
  selectedDocumentType,
  onSelectDocumentType,
  onUploadDocument,
  isUploadingDocument,
  previewUrl,
}: KycVerificationSectionProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IdCard className="h-4 w-4 text-primary" />
            KYC Verification
          </CardTitle>
          <CardDescription>Upload identification documents and track your verification status.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Document Type</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedDocumentType}
                onChange={(event) => onSelectDocumentType(event.target.value)}
              >
                {KYC_DOCUMENT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Upload Document</label>
              <Input
                type="file"
                accept="image/png,image/jpeg,application/pdf"
                onChange={onUploadDocument}
                disabled={isUploadingDocument}
              />
              <p className="text-xs text-muted-foreground">
                Supported formats: JPG, PNG, PDF. Max size: 25MB.
              </p>
            </div>
          </div>

          {previewUrl ? (
            <div className="rounded-2xl border bg-background p-3">
              <p className="mb-2 text-xs text-muted-foreground">Document preview</p>
              <img src={previewUrl} alt="KYC preview" className="max-h-56 rounded-lg object-contain" />
            </div>
          ) : null}

          {kycDocumentUrl ? (
            <Alert className="border-blue-200 bg-blue-50 text-blue-700">
              Latest submitted file:{' '}
              <a className="font-semibold underline" href={kycDocumentUrl} target="_blank" rel="noreferrer">
                Open Document
              </a>
            </Alert>
          ) : (
            <Alert>No KYC document submitted yet. Upload one to start verification.</Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileBadge className="h-4 w-4 text-primary" />
            Verification Status
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border bg-background p-3">
            <p className="text-xs text-muted-foreground">Current Status</p>
            <Badge className="mt-2" variant={resolveKycVariant(kycStatus)}>
              {kycStatus}
            </Badge>
          </div>
          <div className="rounded-xl border bg-background p-3">
            <p className="text-xs text-muted-foreground">Document Type</p>
            <p className="mt-2 text-sm font-medium">{kycDocumentType ?? 'Not submitted'}</p>
          </div>
          <div className="rounded-xl border bg-background p-3">
            <p className="text-xs text-muted-foreground">Last Updated</p>
            <p className="mt-2 text-sm font-medium">{formatDateTime(updatedAt)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
