import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  ChangePasswordRequest,
  KycReviewRequest,
  UpdateProfileRequest,
  UpdateSecuritySettingsRequest,
} from '../types/api'
import { profileService } from '../services/profile.service'

const profileQueryKeys = {
  profile: ['profile', 'me'] as const,
  sessions: ['profile', 'sessions'] as const,
  kyc: ['profile', 'kyc'] as const,
  wallet: ['wallet', 'me'] as const,
  transactions: ['transactions', 'history'] as const,
}

export function useProfileQuery() {
  return useQuery({
    queryKey: profileQueryKeys.profile,
    queryFn: profileService.getMyProfile,
  })
}

export function useProfileSessionsQuery() {
  return useQuery({
    queryKey: profileQueryKeys.sessions,
    queryFn: profileService.getActiveSessions,
  })
}

export function useKycStatusQuery() {
  return useQuery({
    queryKey: profileQueryKeys.kyc,
    queryFn: profileService.getKycStatus,
  })
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateProfileRequest) => profileService.updateMyProfile(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: profileQueryKeys.profile })
    },
  })
}

export function useUploadAvatarMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => profileService.uploadAvatar(file),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: profileQueryKeys.profile })
    },
  })
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (payload: ChangePasswordRequest) => profileService.changePassword(payload),
  })
}

export function useUpdateSecurityMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateSecuritySettingsRequest) => profileService.updateSecurity(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: profileQueryKeys.profile })
      await queryClient.invalidateQueries({ queryKey: profileQueryKeys.sessions })
    },
  })
}

export function useUploadKycMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ documentType, file }: { documentType: string; file: File }) =>
      profileService.uploadKycDocument(documentType, file),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: profileQueryKeys.profile })
      await queryClient.invalidateQueries({ queryKey: profileQueryKeys.kyc })
    },
  })
}

export function useReviewKycMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: KycReviewRequest) => profileService.reviewKycStatus(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: profileQueryKeys.profile })
      await queryClient.invalidateQueries({ queryKey: profileQueryKeys.kyc })
    },
  })
}

export const profileRelatedKeys = profileQueryKeys
