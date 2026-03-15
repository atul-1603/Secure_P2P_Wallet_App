import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { TransferRequest, WalletResponse } from '../../types/api'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'

const sendMoneySchema = z.object({
  toWalletId: z.string().uuid('Enter a valid receiver wallet UUID'),
  amount: z.number().finite('Amount is required').positive('Amount must be greater than zero'),
  reference: z.string().optional(),
  note: z.string().optional(),
})

type SendMoneyFormValues = z.infer<typeof sendMoneySchema>

type SendMoneyFormProps = {
  wallet: WalletResponse | null
  onSubmit: (payload: TransferRequest) => Promise<void>
  loading?: boolean
  prefilledToWalletId?: string
}

export function SendMoneyForm({
  wallet,
  onSubmit,
  loading = false,
  prefilledToWalletId,
}: SendMoneyFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SendMoneyFormValues>({
    resolver: zodResolver(sendMoneySchema),
    defaultValues: {
      toWalletId: '',
      amount: 0,
      reference: '',
      note: '',
    },
  })

  const disabled = loading || isSubmitting || !wallet

  useEffect(() => {
    if (prefilledToWalletId && prefilledToWalletId.trim().length > 0) {
      setValue('toWalletId', prefilledToWalletId.trim(), { shouldValidate: true })
    }
  }, [prefilledToWalletId, setValue])

  async function submit(values: SendMoneyFormValues) {
    await onSubmit({
      toWalletId: values.toWalletId.trim(),
      amount: values.amount,
      reference: values.reference?.trim() || undefined,
      note: values.note?.trim() || undefined,
    })

    reset({
      toWalletId: prefilledToWalletId?.trim() || '',
      amount: 0,
      reference: '',
      note: '',
    })
  }

  return (
    <Card id="send">
      <CardHeader>
        <CardTitle className="text-base">Send Money</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(submit)}>
          <div className="space-y-1">
            <label className="text-sm font-medium">Receiver Wallet ID</label>
            <Input placeholder="Destination wallet ID" {...register('toWalletId')} />
            {errors.toWalletId ? <p className="text-xs text-destructive">{errors.toWalletId.message}</p> : null}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Amount</label>
            <Input type="number" step="0.0001" min="0" {...register('amount', { valueAsNumber: true })} />
            {errors.amount ? <p className="text-xs text-destructive">{errors.amount.message}</p> : null}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Reference (optional)</label>
            <Input placeholder="Invoice # / context" {...register('reference')} />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Note (optional)</label>
            <Input placeholder="Add a note" {...register('note')} />
          </div>

          <Button className="w-full" type="submit" disabled={disabled}>
            {isSubmitting ? 'Sending…' : 'Send Money'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
