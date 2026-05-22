export interface ApiResponse<T> {
  message: string
  data:    T | null
}

export interface AuthUser {
  id:           number
  name:         string
  email:        string
  profileImage: string | null
}

export interface AuthPayload {
  user:         AuthUser
  access_token: string
}

export interface UserProfile {
  id:           number
  name:         string
  email:        string
  accountTheme: string | null
  profileImage: string | null
}

export interface LoginCredentials {
  email:    string
  password: string
}

export interface RegisterPayload {
  name:     string
  email:    string
  password: string
}

export interface UpdateUserPayload {
  id:            number
  name?:         string
  email?:        string
  password?:     string
  accountTheme?: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface VerifyCodePayload {
  email: string
  code:  string
}

export interface RedefinePasswordPayload {
  email:    string
  password: string
}

export type NotificationType =
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'error'

export type ConfirmDialogType = 
  | 'edit'
  | 'logout'
  | 'delete'
  | 'warning'
  | 'info'
  | 'success'
  | 'error'
