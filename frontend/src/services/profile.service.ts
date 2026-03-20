import type {
  ActiveSessionItemResponse,
  ChangePasswordRequest,
  KycReviewRequest,
  KycStatusResponse,
  KycUploadResponse,
  MessageResponse,
  SecuritySettingsResponse,
  UpdateProfileRequest,
  UpdateSecuritySettingsRequest,
  UserProfileResponse,
} from '../types/api'
import { apiClient } from './apiClient'

function createFormData(file: File, extraFields?: Record<string, string>): FormData {
  const formData = new FormData()
  formData.append('file', file)

  if (extraFields) {
    Object.entries(extraFields).forEach(([key, value]) => {
      formData.append(key, value)
    })
  }

  return formData
}

export const profileService = {
  async getMyProfile(): Promise<UserProfileResponse> {
    const response = await apiClient.get<UserProfileResponse>('/profile/me')
    return response.data
  },

  async updateMyProfile(payload: UpdateProfileRequest): Promise<UserProfileResponse> {
    const response = await apiClient.put<UserProfileResponse>('/profile/me', payload)
    return response.data
  },

  async uploadAvatar(file: File): Promise<UserProfileResponse> {
    const response = await apiClient.post<UserProfileResponse>('/profile/avatar', createFormData(file), {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  async changePassword(payload: ChangePasswordRequest): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>('/profile/change-password', payload)
    return response.data
  },

  async updateSecurity(payload: UpdateSecuritySettingsRequest): Promise<SecuritySettingsResponse> {
    const response = await apiClient.patch<SecuritySettingsResponse>('/profile/security', payload)
    return response.data
  },

  async getActiveSessions(): Promise<ActiveSessionItemResponse[]> {
    const response = await apiClient.get<ActiveSessionItemResponse[]>('/profile/sessions')
    return response.data
  },

  async getKycStatus(): Promise<KycStatusResponse> {
    const response = await apiClient.get<KycStatusResponse>('/kyc/status')
    return response.data
  },

  async uploadKycDocument(documentType: string, file: File): Promise<KycUploadResponse> {
    const response = await apiClient.post<KycUploadResponse>(
      '/kyc/upload',
      createFormData(file),
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: {
          documentType,
        },
      },
    )

    return response.data
  },

  async reviewKycStatus(payload: KycReviewRequest): Promise<KycStatusResponse> {
    const response = await apiClient.post<KycStatusResponse>('/kyc/review', payload)
    return response.data
  },
}
