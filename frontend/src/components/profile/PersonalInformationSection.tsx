import { Camera, Save, UserCircle2 } from 'lucide-react'
import type { ChangeEvent } from 'react'
import { Alert } from '../ui/alert'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import type { UserProfileResponse } from '../../types/api'

type PersonalInformationSectionProps = {
  profile: UserProfileResponse
  fullNameInput: string
  onFullNameChange: (value: string) => void
  onSaveProfile: () => void
  isSavingProfile: boolean
  avatarPreviewUrl: string | null
  onAvatarSelected: (event: ChangeEvent<HTMLInputElement>) => void
  isUploadingAvatar: boolean
  avatarValidationError: string | null
}

export default function PersonalInformationSection({
  profile,
  fullNameInput,
  onFullNameChange,
  onSaveProfile,
  isSavingProfile,
  avatarPreviewUrl,
  onAvatarSelected,
  isUploadingAvatar,
  avatarValidationError,
}: PersonalInformationSectionProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your public profile details and profile image.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4 rounded-2xl border bg-muted/20 p-4 sm:flex-row sm:items-center">
            <div className="h-20 w-20 overflow-hidden rounded-full border bg-white">
              {avatarPreviewUrl || profile.profileImageUrl ? (
                <img
                  src={avatarPreviewUrl ?? profile.profileImageUrl ?? undefined}
                  alt="Avatar preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  <UserCircle2 className="h-9 w-9" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Profile picture</p>
              <p className="text-xs text-muted-foreground">JPG or PNG, up to 25MB. Images are optimized before upload.</p>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border bg-background px-3 py-2 text-sm hover:bg-accent/60">
                <Camera className="h-4 w-4" />
                {isUploadingAvatar ? 'Uploading...' : 'Choose Avatar'}
                <input
                  className="hidden"
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={onAvatarSelected}
                  disabled={isUploadingAvatar}
                />
              </label>
            </div>
          </div>

          {avatarValidationError ? <Alert>{avatarValidationError}</Alert> : null}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Full Name</label>
              <Input value={fullNameInput} onChange={(event) => onFullNameChange(event.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Email</label>
              <Input value={profile.email} readOnly />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Username</label>
              <Input value={profile.username} readOnly />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Account Status</label>
              <Input value={profile.accountStatus} readOnly />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={onSaveProfile} disabled={isSavingProfile}>
              <Save className="mr-2 h-4 w-4" />
              {isSavingProfile ? 'Saving...' : 'Save Personal Info'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
