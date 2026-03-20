import { AnimatePresence, motion } from 'framer-motion'
import { Bell, IdCard, LayoutDashboard, Lock, type LucideIcon, UserRound } from 'lucide-react'
import { lazy, Suspense, useEffect, useRef, useState, type ChangeEvent } from 'react'
import { Alert } from '../../components/ui/alert'
import { Badge } from '../../components/ui/badge'
import { Card, CardContent } from '../../components/ui/card'
import { PageError, PageLoading } from '../../components/ui/page-state'
import { useToast } from '../../components/ui/toast'
import { useHistoryQuery, useWalletQuery } from '../../hooks/useDashboardData'
import {
  useChangePasswordMutation,
  useKycStatusQuery,
  useProfileQuery,
  useProfileSessionsQuery,
  useUpdateProfileMutation,
  useUpdateSecurityMutation,
  useUploadAvatarMutation,
  useUploadKycMutation,
} from '../../hooks/useProfileData'
import { getApiErrorMessage } from '../../utils/error'
import { optimizeAvatarImage, validateAvatarFile } from '../../utils/image'

const ProfileOverviewSection = lazy(() => import('../../components/profile/ProfileOverviewSection'))
const PersonalInformationSection = lazy(() => import('../../components/profile/PersonalInformationSection'))
const SecuritySettingsSection = lazy(() => import('../../components/profile/SecuritySettingsSection'))
const KycVerificationSection = lazy(() => import('../../components/profile/KycVerificationSection'))
const PreferencesSection = lazy(() => import('../../components/profile/PreferencesSection'))

type ProfileSectionKey = 'overview' | 'personal' | 'security' | 'kyc' | 'preferences'

type SectionConfig = {
  key: ProfileSectionKey
  label: string
  description: string
  icon: LucideIcon
}

const SECTIONS: SectionConfig[] = [
  {
    key: 'overview',
    label: 'Profile Overview',
    description: 'Identity and account snapshot',
    icon: LayoutDashboard,
  },
  {
    key: 'personal',
    label: 'Personal Information',
    description: 'Name, avatar, and basic details',
    icon: UserRound,
  },
  {
    key: 'security',
    label: 'Security Settings',
    description: 'Password, 2FA, and sessions',
    icon: Lock,
  },
  {
    key: 'kyc',
    label: 'KYC Verification',
    description: 'Document upload and status',
    icon: IdCard,
  },
  {
    key: 'preferences',
    label: 'Preferences',
    description: 'Minimal notification controls',
    icon: Bell,
  },
]

export default function ProfilePage() {
  const profileQuery = useProfileQuery()
  const sessionsQuery = useProfileSessionsQuery()
  const kycStatusQuery = useKycStatusQuery()
  const walletQuery = useWalletQuery()
  const historyQuery = useHistoryQuery()

  const updateProfileMutation = useUpdateProfileMutation()
  const uploadAvatarMutation = useUploadAvatarMutation()
  const updateSecurityMutation = useUpdateSecurityMutation()
  const changePasswordMutation = useChangePasswordMutation()
  const uploadKycMutation = useUploadKycMutation()

  const { showError, showSuccess } = useToast()

  const [activeSection, setActiveSection] = useState<ProfileSectionKey>('overview')
  const [visitedSections, setVisitedSections] = useState<ProfileSectionKey[]>(['overview'])

  const [fullNameInput, setFullNameInput] = useState('')
  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(true)
  const [transferAlertsEnabled, setTransferAlertsEnabled] = useState(true)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const [kycDocumentType, setKycDocumentType] = useState('AADHAAR')
  const [kycDocumentPreviewUrl, setKycDocumentPreviewUrl] = useState<string | null>(null)

  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null)
  const [avatarValidationError, setAvatarValidationError] = useState<string | null>(null)

  const avatarPreviewObjectUrlRef = useRef<string | null>(null)
  const kycPreviewObjectUrlRef = useRef<string | null>(null)

  const profile = profileQuery.data
  const sessions = sessionsQuery.data ?? []
  const walletBalance = walletQuery.data?.balance ?? null
  const transactionsCount = historyQuery.data?.length ?? 0

  const loading = profileQuery.isLoading || sessionsQuery.isLoading || kycStatusQuery.isLoading
  const error = [profileQuery.error, sessionsQuery.error, kycStatusQuery.error]
    .filter(Boolean)
    .map((item) => getApiErrorMessage(item, 'Unable to load profile details'))[0]

  useEffect(() => {
    if (!profile) {
      return
    }

    setFullNameInput(profile.fullName)
    setEmailAlertsEnabled(profile.preferences.emailAlerts)
    setTransferAlertsEnabled(profile.preferences.transferAlerts)
  }, [profile])

  useEffect(() => {
    return () => {
      if (avatarPreviewObjectUrlRef.current) {
        URL.revokeObjectURL(avatarPreviewObjectUrlRef.current)
      }
      if (kycPreviewObjectUrlRef.current) {
        URL.revokeObjectURL(kycPreviewObjectUrlRef.current)
      }
    }
  }, [])

  function selectSection(section: ProfileSectionKey) {
    setActiveSection(section)
    setVisitedSections((previous) => {
      if (previous.includes(section)) {
        return previous
      }
      return [...previous, section]
    })
  }

  function setAvatarPreview(file: File) {
    if (avatarPreviewObjectUrlRef.current) {
      URL.revokeObjectURL(avatarPreviewObjectUrlRef.current)
    }

    const objectUrl = URL.createObjectURL(file)
    avatarPreviewObjectUrlRef.current = objectUrl
    setAvatarPreviewUrl(objectUrl)
  }

  function setKycPreview(file: File) {
    if (kycPreviewObjectUrlRef.current) {
      URL.revokeObjectURL(kycPreviewObjectUrlRef.current)
      kycPreviewObjectUrlRef.current = null
    }

    if (!file.type.toLowerCase().startsWith('image/')) {
      setKycDocumentPreviewUrl(null)
      return
    }

    const objectUrl = URL.createObjectURL(file)
    kycPreviewObjectUrlRef.current = objectUrl
    setKycDocumentPreviewUrl(objectUrl)
  }

  async function handleProfileSave() {
    if (!profile) {
      return
    }

    try {
      const response = await updateProfileMutation.mutateAsync({
        fullName: fullNameInput.trim(),
        emailAlerts: emailAlertsEnabled,
        transferAlerts: transferAlertsEnabled,
      })

      setFullNameInput(response.fullName)
      setEmailAlertsEnabled(response.preferences.emailAlerts)
      setTransferAlertsEnabled(response.preferences.transferAlerts)
      showSuccess('Profile details updated successfully.')
    } catch (mutationError) {
      showError(getApiErrorMessage(mutationError, 'Unable to update profile details'))
    }
  }

  async function handleAvatarUpload(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) {
      return
    }

    const validationError = validateAvatarFile(selectedFile)
    if (validationError) {
      setAvatarValidationError(validationError)
      showError(validationError)
      event.target.value = ''
      return
    }

    try {
      const optimizedFile = await optimizeAvatarImage(selectedFile)
      const optimizedValidationError = validateAvatarFile(optimizedFile)
      if (optimizedValidationError) {
        throw new Error(optimizedValidationError)
      }

      setAvatarPreview(optimizedFile)
      setAvatarValidationError(null)

      await uploadAvatarMutation.mutateAsync(optimizedFile)
      showSuccess('Avatar uploaded successfully.')
    } catch (mutationError) {
      const message = getApiErrorMessage(mutationError, 'Unable to upload avatar.')
      setAvatarValidationError(message)
      showError(message)
    } finally {
      event.target.value = ''
    }
  }

  async function handlePasswordChange() {
    if (!currentPassword || !newPassword) {
      showError('Current and new password are required.')
      return
    }

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword,
        newPassword,
      })

      setCurrentPassword('')
      setNewPassword('')
      showSuccess('Password changed successfully.')
    } catch (mutationError) {
      showError(getApiErrorMessage(mutationError, 'Unable to change password'))
    }
  }

  async function handleToggleTwoFactor(enabled: boolean) {
    try {
      await updateSecurityMutation.mutateAsync({ twoFactorEnabled: enabled })
      showSuccess(`Two-factor authentication ${enabled ? 'enabled' : 'disabled'}.`)
    } catch (mutationError) {
      showError(getApiErrorMessage(mutationError, 'Unable to update security settings'))
    }
  }

  async function handleKycUpload(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) {
      return
    }

    setKycPreview(selectedFile)

    try {
      const response = await uploadKycMutation.mutateAsync({
        documentType: kycDocumentType,
        file: selectedFile,
      })

      showSuccess(response.message)
    } catch (mutationError) {
      showError(getApiErrorMessage(mutationError, 'Unable to upload KYC document'))
    } finally {
      event.target.value = ''
    }
  }

  if (loading) {
    return <PageLoading title="Loading profile..." />
  }

  if (error || !profile) {
    return (
      <PageError
        message={error ?? 'Unable to load profile'}
        onRetry={() => {
          void profileQuery.refetch()
          void sessionsQuery.refetch()
          void kycStatusQuery.refetch()
          void walletQuery.refetch()
          void historyQuery.refetch()
        }}
      />
    )
  }

  const profileReady = profile

  const kycSource = kycStatusQuery.data ?? {
    status: profileReady.kycStatus,
    documentType: profileReady.kycDocumentType,
    documentUrl: profileReady.kycDocumentUrl,
    updatedAt: profileReady.createdAt,
  }

  function renderSection() {
    switch (activeSection) {
      case 'overview':
        return (
          <ProfileOverviewSection
            profile={profileReady}
            avatarPreviewUrl={avatarPreviewUrl}
            walletBalance={walletBalance}
            transactionsCount={transactionsCount}
            sessionsCount={sessions.length}
            onGoToPersonal={() => selectSection('personal')}
            onGoToSecurity={() => selectSection('security')}
            onGoToKyc={() => selectSection('kyc')}
          />
        )
      case 'personal':
        return (
          <PersonalInformationSection
            profile={profileReady}
            fullNameInput={fullNameInput}
            onFullNameChange={setFullNameInput}
            onSaveProfile={() => {
              void handleProfileSave()
            }}
            isSavingProfile={updateProfileMutation.isPending}
            avatarPreviewUrl={avatarPreviewUrl}
            onAvatarSelected={(event) => {
              void handleAvatarUpload(event)
            }}
            isUploadingAvatar={uploadAvatarMutation.isPending}
            avatarValidationError={avatarValidationError}
          />
        )
      case 'security':
        return (
          <SecuritySettingsSection
            twoFactorEnabled={profileReady.twoFactorEnabled}
            currentPassword={currentPassword}
            newPassword={newPassword}
            onCurrentPasswordChange={setCurrentPassword}
            onNewPasswordChange={setNewPassword}
            onChangePassword={() => {
              void handlePasswordChange()
            }}
            isChangingPassword={changePasswordMutation.isPending}
            onToggleTwoFactor={(enabled) => {
              void handleToggleTwoFactor(enabled)
            }}
            isUpdatingTwoFactor={updateSecurityMutation.isPending}
            sessions={sessions}
          />
        )
      case 'kyc':
        return (
          <KycVerificationSection
            kycStatus={kycSource.status}
            kycDocumentType={kycSource.documentType}
            kycDocumentUrl={kycSource.documentUrl}
            updatedAt={kycSource.updatedAt}
            selectedDocumentType={kycDocumentType}
            onSelectDocumentType={setKycDocumentType}
            onUploadDocument={(event) => {
              void handleKycUpload(event)
            }}
            isUploadingDocument={uploadKycMutation.isPending}
            previewUrl={kycDocumentPreviewUrl}
          />
        )
      case 'preferences':
        return (
          <PreferencesSection
            emailAlertsEnabled={emailAlertsEnabled}
            transferAlertsEnabled={transferAlertsEnabled}
            onEmailAlertsChange={setEmailAlertsEnabled}
            onTransferAlertsChange={setTransferAlertsEnabled}
            onSavePreferences={() => {
              void handleProfileSave()
            }}
            isSavingPreferences={updateProfileMutation.isPending}
          />
        )
      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <Card className="overflow-hidden border-0 bg-gradient-to-r from-sky-500/20 via-cyan-500/5 to-emerald-500/15">
        <CardContent className="space-y-3 p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Fintech profile center</p>
          <h1 className="text-2xl font-semibold">Manage your account with clarity</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Your profile is organized into focused sections so identity, security, verification, and preferences stay clean and actionable.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[270px_minmax(0,1fr)]">
        <Card className="h-fit">
          <CardContent className="space-y-2 p-3">
            {SECTIONS.map((section) => {
              const Icon = section.icon
              const isActive = activeSection === section.key

              return (
                <motion.button
                  key={section.key}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.99 }}
                  type="button"
                  onClick={() => selectSection(section.key)}
                  className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                    isActive
                      ? 'border-primary/40 bg-primary/10 shadow-sm'
                      : 'border-transparent bg-transparent hover:border-border hover:bg-accent/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-primary" />
                      <p className="text-sm font-medium">{section.label}</p>
                    </div>
                    {visitedSections.includes(section.key) ? (
                      <Badge variant="outline" className="text-[10px] uppercase">
                        Opened
                      </Badge>
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{section.description}</p>
                </motion.button>
              )
            })}
          </CardContent>
        </Card>

        <Suspense fallback={<PageLoading title="Loading section..." />}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </div>

      {profileReady.accountRestricted ? (
        <Alert className="border-amber-200 bg-amber-50 text-amber-700">
          Your account is currently restricted. Contact support to restore full access.
        </Alert>
      ) : null}
    </motion.div>
  )
}
